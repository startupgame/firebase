import Constants from 'expo-constants';
import { Platform } from 'react-native';
import * as Linking from 'expo-linking';

/**
 * Determine if the app is running in development or production
 */
export const isDevelopment = __DEV__;

/**
 * Get the correct redirect URL for the current environment
 */
export const getRedirectUrl = (): string => {
  // Use environment variable if defined
  const envRedirectUrl = process.env.SUPABASE_REDIRECT_URL;
  if (envRedirectUrl) return envRedirectUrl;

  // For development on Expo, use the development server URL
  if (isDevelopment) {
    // Get the Expo development server URL
    const localhost = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
    const scheme = 'exp';
    const host = Constants.expoConfig?.hostUri || `${localhost}:8081`;
    return `${scheme}://${host}/auth/login`;
  }

  // For production, use the app scheme from app.json
  const appScheme = Constants.expoConfig?.scheme || 'startup-pitch-challenge';
  return `${appScheme}://auth/login`;
};

/**
 * Get the Supabase auth configuration options
 */
export const getSupabaseAuthOptions = () => {
  return {
    redirectTo: getRedirectUrl()
  };
};

/**
 * Log the current configuration
 */
export const logEnvironmentConfig = (): void => {
  console.log(`App running in ${isDevelopment ? 'DEVELOPMENT' : 'PRODUCTION'} mode`);
  console.log(`Supabase Redirect URL: ${getRedirectUrl()}`);
};
