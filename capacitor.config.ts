import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.stepupnaija.app',
  appName: 'Step Up Naija',
  webDir: 'dist/public',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      launchAutoHide: true,
      backgroundColor: "#22C55E",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: false
    },
    StatusBar: {
      style: "DARK",
      backgroundColor: "#FFFFFF"
    },
    App: {
      appUrlOpen: {
        iosCustomScheme: "stepupnaija"
      }
    }
  }
};

export default config;
