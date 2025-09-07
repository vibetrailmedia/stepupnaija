import { queryClient } from '@/lib/queryClient';

export interface OfflineData {
  timestamp: Date;
  data: any;
  key: string;
}

export interface SyncTask {
  id: string;
  type: 'CREATE' | 'UPDATE' | 'DELETE';
  endpoint: string;
  data: any;
  timestamp: Date;
  retryCount: number;
}

class OfflineService {
  private isOnline: boolean = navigator.onLine;
  private syncTasks: SyncTask[] = [];
  private offlineData: Map<string, OfflineData> = new Map();
  private syncInProgress: boolean = false;

  constructor() {
    this.setupOfflineDetection();
    this.loadOfflineData();
    this.setupPeriodicSync();
  }

  private setupOfflineDetection(): void {
    window.addEventListener('online', () => {
      this.isOnline = true;
      console.log('🌐 Back online! Starting sync...');
      this.syncPendingTasks();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      console.log('📴 Gone offline. Caching data locally...');
    });
  }

  private loadOfflineData(): void {
    try {
      const storedTasks = localStorage.getItem('syncTasks');
      if (storedTasks) {
        this.syncTasks = JSON.parse(storedTasks).map((task: any) => ({
          ...task,
          timestamp: new Date(task.timestamp)
        }));
      }

      const storedData = localStorage.getItem('offlineData');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        this.offlineData = new Map(
          Object.entries(parsedData).map(([key, value]: [string, any]) => [
            key,
            {
              ...value,
              timestamp: new Date(value.timestamp)
            }
          ])
        );
      }
    } catch (error) {
      console.error('Failed to load offline data:', error);
    }
  }

  private saveOfflineData(): void {
    try {
      localStorage.setItem('syncTasks', JSON.stringify(this.syncTasks));
      
      const dataObject = Object.fromEntries(this.offlineData);
      localStorage.setItem('offlineData', JSON.stringify(dataObject));
    } catch (error) {
      console.error('Failed to save offline data:', error);
    }
  }

  private setupPeriodicSync(): void {
    // Attempt to sync every 30 seconds when online
    setInterval(() => {
      if (this.isOnline && this.syncTasks.length > 0) {
        this.syncPendingTasks();
      }
    }, 30000);
  }

  // Cache data for offline use
  cacheData(key: string, data: any): void {
    this.offlineData.set(key, {
      timestamp: new Date(),
      data: JSON.parse(JSON.stringify(data)), // Deep clone
      key
    });
    this.saveOfflineData();
  }

  // Get cached data
  getCachedData(key: string): any | null {
    const cached = this.offlineData.get(key);
    if (!cached) return null;

    // Check if data is older than 24 hours
    const isStale = Date.now() - cached.timestamp.getTime() > 24 * 60 * 60 * 1000;
    if (isStale && this.isOnline) {
      this.offlineData.delete(key);
      this.saveOfflineData();
      return null;
    }

    return cached.data;
  }

  // Queue action for later sync
  queueSyncTask(type: 'CREATE' | 'UPDATE' | 'DELETE', endpoint: string, data: any): void {
    const task: SyncTask = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      type,
      endpoint,
      data,
      timestamp: new Date(),
      retryCount: 0
    };

    this.syncTasks.push(task);
    this.saveOfflineData();

    // Show user feedback
    this.showOfflineNotification(`Action queued for sync when online`);
  }

  // Sync pending tasks when online
  private async syncPendingTasks(): Promise<void> {
    if (this.syncInProgress || !this.isOnline || this.syncTasks.length === 0) {
      return;
    }

    this.syncInProgress = true;
    const tasksToSync = [...this.syncTasks];

    for (const task of tasksToSync) {
      try {
        await this.executeSyncTask(task);
        
        // Remove successful task
        this.syncTasks = this.syncTasks.filter(t => t.id !== task.id);
        
        console.log(`✅ Synced ${task.type} to ${task.endpoint}`);
      } catch (error) {
        console.error(`❌ Failed to sync task ${task.id}:`, error);
        
        // Increment retry count
        const taskIndex = this.syncTasks.findIndex(t => t.id === task.id);
        if (taskIndex !== -1) {
          this.syncTasks[taskIndex].retryCount++;
          
          // Remove task if it failed too many times
          if (this.syncTasks[taskIndex].retryCount > 3) {
            this.syncTasks.splice(taskIndex, 1);
            console.warn(`🗑️ Removed task ${task.id} after 3 failed attempts`);
          }
        }
      }
    }

    this.saveOfflineData();
    this.syncInProgress = false;

    if (this.syncTasks.length === 0) {
      this.showOfflineNotification('All changes synced successfully! ✅');
    }
  }

  private async executeSyncTask(task: SyncTask): Promise<void> {
    const method = task.type === 'CREATE' ? 'POST' : 
                   task.type === 'UPDATE' ? 'PUT' : 'DELETE';

    const response = await fetch(task.endpoint, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: task.type !== 'DELETE' ? JSON.stringify(task.data) : undefined
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    // Invalidate related cache
    queryClient.invalidateQueries({ queryKey: [task.endpoint] });
  }

  private showOfflineNotification(message: string): void {
    // Create a simple toast notification
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 text-sm';
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.remove();
    }, 3000);
  }

  // Civic engagement specific offline features
  
  // Cache user's civic profile for offline viewing
  cacheUserProfile(userId: string, profile: any): void {
    this.cacheData(`user_profile_${userId}`, profile);
  }

  getCachedUserProfile(userId: string): any | null {
    return this.getCachedData(`user_profile_${userId}`);
  }

  // Cache local events for offline access
  cacheLocalEvents(state: string, events: any[]): void {
    this.cacheData(`local_events_${state}`, events);
  }

  getCachedLocalEvents(state: string): any[] | null {
    return this.getCachedData(`local_events_${state}`);
  }

  // Queue civic engagement actions
  queueEventRegistration(eventId: string, userId: string): void {
    this.queueSyncTask('POST', `/api/events/${eventId}/register`, { userId });
  }

  queueVote(projectId: string, vote: 'yes' | 'no'): void {
    this.queueSyncTask('POST', `/api/projects/${projectId}/vote`, { vote });
  }

  queueTaskCompletion(taskId: string, evidence: any): void {
    this.queueSyncTask('POST', `/api/tasks/${taskId}/complete`, { evidence });
  }

  queueForumPost(forumId: string, content: string): void {
    this.queueSyncTask('POST', `/api/forums/${forumId}/posts`, { content });
  }

  // Check connection status
  isOnlineStatus(): boolean {
    return this.isOnline;
  }

  // Get pending sync count
  getPendingSyncCount(): number {
    return this.syncTasks.length;
  }

  // Clear all offline data (for privacy/logout)
  clearOfflineData(): void {
    this.offlineData.clear();
    this.syncTasks = [];
    localStorage.removeItem('offlineData');
    localStorage.removeItem('syncTasks');
  }

  // Check if device has low connectivity
  isSlowConnection(): boolean {
    const connection = (navigator as any).connection;
    if (!connection) return false;

    // Consider 2G or slow 3G as slow connection
    return connection.effectiveType === '2g' || connection.effectiveType === 'slow-2g';
  }

  // Preload essential data for offline use
  async preloadEssentialData(userId: string, userState: string): Promise<void> {
    if (!this.isOnline) return;

    try {
      // Preload user profile
      const userResponse = await fetch('/api/user');
      if (userResponse.ok) {
        const userData = await userResponse.json();
        this.cacheUserProfile(userId, userData);
      }

      // Preload local events
      const eventsResponse = await fetch(`/api/events?state=${encodeURIComponent(userState)}&limit=50`);
      if (eventsResponse.ok) {
        const eventsData = await eventsResponse.json();
        this.cacheLocalEvents(userState, eventsData);
      }

      // Preload active tasks
      const tasksResponse = await fetch('/api/tasks?status=active');
      if (tasksResponse.ok) {
        const tasksData = await tasksResponse.json();
        this.cacheData('active_tasks', tasksData);
      }

      // Preload current projects for voting
      const projectsResponse = await fetch('/api/projects?status=active&limit=20');
      if (projectsResponse.ok) {
        const projectsData = await projectsResponse.json();
        this.cacheData('active_projects', projectsData);
      }

      console.log('📱 Essential data preloaded for offline access');
    } catch (error) {
      console.error('Failed to preload essential data:', error);
    }
  }
}

// Export singleton instance
export const offlineService = new OfflineService();