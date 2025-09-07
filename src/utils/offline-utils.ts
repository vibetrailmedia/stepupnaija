/**
 * Offline Utilities for Nigerian Users
 * 
 * Designed to handle poor connectivity and provide
 * offline-first functionality for Step Up Naija.
 */

interface OfflineQueueItem {
  id: string;
  url: string;
  method: string;
  data?: any;
  timestamp: number;
  retryCount: number;
}

interface CacheConfig {
  maxAge: number; // in milliseconds
  maxSize: number; // max number of items
  strategy: 'networkFirst' | 'cacheFirst' | 'staleWhileRevalidate';
}

class OfflineManager {
  private requestQueue: OfflineQueueItem[] = [];
  private cache: Map<string, { data: any; timestamp: number; maxAge: number }> = new Map();
  private isOnline: boolean = navigator.onLine;
  private listeners: Set<(isOnline: boolean) => void> = new Set();

  constructor() {
    this.loadQueueFromStorage();
    this.setupNetworkListeners();
    this.processQueuePeriodically();
  }

  // Network status monitoring
  private setupNetworkListeners() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.notifyListeners(true);
      this.processQueue();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.notifyListeners(false);
    });

    // Additional connection quality detection for Nigerian networks
    this.monitorConnectionQuality();
  }

  private monitorConnectionQuality() {
    // @ts-ignore - Navigator connection is experimental
    const connection = navigator?.connection || navigator?.mozConnection || navigator?.webkitConnection;
    
    if (connection) {
      const updateConnection = () => {
        const isSlowConnection = connection.effectiveType === '2g' || 
                               connection.effectiveType === 'slow-2g' ||
                               (connection.effectiveType === '3g' && connection.downlink < 1.5);
        
        // Adjust caching strategy based on connection quality
        if (isSlowConnection) {
          this.enableAggressiveCaching();
        }
      };

      connection.addEventListener('change', updateConnection);
      updateConnection();
    }
  }

  private enableAggressiveCaching() {
    // Store more data locally for slow connections
    console.log('📡 Slow connection detected - enabling aggressive caching');
  }

  // Queue management for offline requests
  public queueRequest(url: string, options: RequestInit = {}): Promise<any> {
    return new Promise((resolve, reject) => {
      const queueItem: OfflineQueueItem = {
        id: this.generateId(),
        url,
        method: options.method || 'GET',
        data: options.body,
        timestamp: Date.now(),
        retryCount: 0
      };

      if (this.isOnline) {
        this.executeRequest(queueItem).then(resolve).catch(reject);
      } else {
        this.requestQueue.push(queueItem);
        this.saveQueueToStorage();
        
        // Return cached data if available
        const cached = this.getCached(url);
        if (cached) {
          resolve(cached);
        } else {
          reject(new Error('Offline: Request queued for when connection is restored'));
        }
      }
    });
  }

  private async executeRequest(item: OfflineQueueItem): Promise<any> {
    try {
      const response = await fetch(item.url, {
        method: item.method,
        body: item.data,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Cache successful responses
      if (item.method === 'GET') {
        this.setCached(item.url, data, 5 * 60 * 1000); // Cache for 5 minutes
      }

      return data;
    } catch (error) {
      item.retryCount++;
      
      if (item.retryCount < 3) {
        // Re-queue for retry
        setTimeout(() => {
          this.requestQueue.push(item);
        }, Math.pow(2, item.retryCount) * 1000); // Exponential backoff
      }
      
      throw error;
    }
  }

  private async processQueue() {
    if (!this.isOnline || this.requestQueue.length === 0) return;

    console.log(`📤 Processing ${this.requestQueue.length} queued requests`);
    
    const queue = [...this.requestQueue];
    this.requestQueue = [];
    
    for (const item of queue) {
      try {
        await this.executeRequest(item);
        console.log(`✅ Queued request completed: ${item.method} ${item.url}`);
      } catch (error) {
        console.error(`❌ Queued request failed: ${item.method} ${item.url}`, error);
      }
    }
    
    this.saveQueueToStorage();
  }

  private processQueuePeriodically() {
    setInterval(() => {
      if (this.isOnline) {
        this.processQueue();
      }
    }, 30000); // Check every 30 seconds
  }

  // Caching utilities
  public setCached(key: string, data: any, maxAge: number = 5 * 60 * 1000) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      maxAge
    });
  }

  public getCached(key: string): any | null {
    const cached = this.cache.get(key);
    
    if (!cached) return null;
    
    const age = Date.now() - cached.timestamp;
    if (age > cached.maxAge) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.data;
  }

  public clearCache() {
    this.cache.clear();
    console.log('🗑️ Cache cleared');
  }

  // Storage persistence
  private saveQueueToStorage() {
    try {
      localStorage.setItem('offline_queue', JSON.stringify(this.requestQueue));
    } catch (error) {
      console.warn('Failed to save offline queue:', error);
    }
  }

  private loadQueueFromStorage() {
    try {
      const stored = localStorage.getItem('offline_queue');
      if (stored) {
        this.requestQueue = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Failed to load offline queue:', error);
      this.requestQueue = [];
    }
  }

  // Utility methods
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private notifyListeners(isOnline: boolean) {
    this.listeners.forEach(listener => listener(isOnline));
  }

  // Public API
  public onConnectionChange(callback: (isOnline: boolean) => void) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  public getNetworkStatus() {
    return {
      isOnline: this.isOnline,
      queueLength: this.requestQueue.length,
      cacheSize: this.cache.size
    };
  }
}

// Create singleton instance
export const offlineManager = new OfflineManager();

// React hook for offline functionality
export function useOffline() {
  const [isOnline, setIsOnline] = React.useState(navigator.onLine);
  const [queueLength, setQueueLength] = React.useState(0);

  React.useEffect(() => {
    const unsubscribe = offlineManager.onConnectionChange((online) => {
      setIsOnline(online);
      const status = offlineManager.getNetworkStatus();
      setQueueLength(status.queueLength);
    });

    // Update queue length periodically
    const interval = setInterval(() => {
      const status = offlineManager.getNetworkStatus();
      setQueueLength(status.queueLength);
    }, 5000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  return {
    isOnline,
    queueLength,
    queueRequest: offlineManager.queueRequest.bind(offlineManager),
    getCached: offlineManager.getCached.bind(offlineManager),
    clearCache: offlineManager.clearCache.bind(offlineManager)
  };
}

// Service Worker utilities (if available)
export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('🔧 Service Worker registered:', registration);
        
        // Listen for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New version available
                console.log('🆕 New version available - refresh to update');
              }
            });
          }
        });
      } catch (error) {
        console.warn('Service Worker registration failed:', error);
      }
    });
  }
}

// Data compression for slower networks
export function compressData(data: any): string {
  try {
    const jsonString = JSON.stringify(data);
    
    // Simple compression for Nigerian mobile networks
    // In production, you might use a proper compression library
    return btoa(jsonString);
  } catch (error) {
    console.warn('Data compression failed:', error);
    return JSON.stringify(data);
  }
}

export function decompressData(compressedData: string): any {
  try {
    const jsonString = atob(compressedData);
    return JSON.parse(jsonString);
  } catch (error) {
    console.warn('Data decompression failed:', error);
    return compressedData;
  }
}

// Nigerian-specific offline features
export function saveForOfflineReading(content: any, id: string) {
  try {
    const offlineContent = JSON.parse(localStorage.getItem('offline_content') || '{}');
    offlineContent[id] = {
      ...content,
      savedAt: Date.now(),
      expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 days
    };
    
    localStorage.setItem('offline_content', JSON.stringify(offlineContent));
    console.log(`📖 Content saved for offline reading: ${id}`);
  } catch (error) {
    console.warn('Failed to save content for offline reading:', error);
  }
}

export function getOfflineContent(id: string): any | null {
  try {
    const offlineContent = JSON.parse(localStorage.getItem('offline_content') || '{}');
    const content = offlineContent[id];
    
    if (!content) return null;
    
    // Check if expired
    if (Date.now() > content.expiresAt) {
      delete offlineContent[id];
      localStorage.setItem('offline_content', JSON.stringify(offlineContent));
      return null;
    }
    
    return content;
  } catch (error) {
    console.warn('Failed to get offline content:', error);
    return null;
  }
}

// Import React for the hook
import React from 'react';