import { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Network } from '@capacitor/network';
import { App } from '@capacitor/app';

export const useMobile = () => {
  const [isNative, setIsNative] = useState(false);
  const [networkStatus, setNetworkStatus] = useState<any>(null);

  useEffect(() => {
    // Check if running on mobile device
    setIsNative(Capacitor.isNativePlatform());

    // Initialize mobile features if on native platform
    if (Capacitor.isNativePlatform()) {
      initializeMobileFeatures();
      setupNetworkListener();
      setupAppStateListener();
    }
  }, []);

  const initializeMobileFeatures = async () => {
    try {
      // Set status bar style
      await StatusBar.setStyle({ style: Style.Dark });
      
      // Hide splash screen after initialization
      await SplashScreen.hide();
      
      // Get initial network status
      const status = await Network.getStatus();
      setNetworkStatus(status);
    } catch (error) {
      // Mobile initialization failed - running in web mode
    }
  };

  const setupNetworkListener = () => {
    Network.addListener('networkStatusChange', (status) => {
      setNetworkStatus(status);
    });
  };

  const setupAppStateListener = () => {
    App.addListener('appStateChange', ({ isActive }) => {
      // App state changed - handle foreground/background
    });
  };

  // Mobile utility functions
  const triggerHaptic = async (style: ImpactStyle = ImpactStyle.Medium) => {
    if (isNative) {
      try {
        await Haptics.impact({ style });
      } catch (error) {
        // Haptic feedback not available
      }
    }
  };

  const setStatusBarStyle = async (style: Style) => {
    if (isNative) {
      try {
        await StatusBar.setStyle({ style });
      } catch (error) {
        // Status bar customization not available
      }
    }
  };

  return {
    isNative,
    networkStatus,
    triggerHaptic,
    setStatusBarStyle,
    isOnline: networkStatus?.connected ?? true
  };
};