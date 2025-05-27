import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'BeUnreal',
  webDir: 'dist',
  plugins: {
    Geolocation: {
      permissions: ['location']
    }
  },
  server: {
    url: 'http://192.168.2.48:5173',
    cleartext: true,
    allowNavigation: ['192.168.2.48']
  }
};

export default config;
