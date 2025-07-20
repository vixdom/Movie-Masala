import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.moviemasala.wordsearch',
  appName: 'Bolly Word',
  webDir: 'dist/public',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      backgroundColor: "#FF6B35",
      androidSplashResourceName: "splash",
      showSpinner: false
    },
    StatusBar: {
      style: "light"
    }
  }
};

export default config;
