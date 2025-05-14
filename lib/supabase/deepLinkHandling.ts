import * as Linking from 'expo-linking';
import { supabase } from './supabaseClient';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

/**
 * Set up deep link handling for Supabase authentication
 * This should be called in the root component of your app
 */
export const setupDeepLinking = () => {
  // Set up a listener for deep links
  const handleDeepLink = async (event: { url: string }) => {
    const url = event.url;
    console.log('Received deep link:', url);

    // Handle Supabase authentication URLs
    if (url.includes('auth/login') || url.includes('auth/callback')) {
      try {
        // Extract parameters like access_token, refresh_token from the URL
        const params = extractParamsFromUrl(url);
        
        if (params.access_token || params.refresh_token) {
          console.log('Handling auth deep link with tokens');
          
          // Set the session with the extracted tokens
          const { data, error } = await supabase.auth.setSession({
            access_token: params.access_token || '',
            refresh_token: params.refresh_token || '',
          });
          
          if (error) {
            console.error('Error setting session from deep link:', error);
          } else {
            console.log('Successfully set session from deep link');
          }
        }
      } catch (error) {
        console.error('Error handling deep link:', error);
      }
    }
  };

  // Register the listener for both initial URL and new URLs
  Linking.addEventListener('url', handleDeepLink);

  // Handle the initial URL that may have been used to open the app
  Linking.getInitialURL().then((url) => {
    if (url) {
      console.log('App opened with URL:', url);
      handleDeepLink({ url });
    }
  });

  return () => {
    // Clean up
    // Note: The version of Linking you're using may not require this cleanup
    // Linking.removeEventListener('url', handleDeepLink);
  };
};

/**
 * Extract URL parameters from a URL string
 */
const extractParamsFromUrl = (url: string): Record<string, string> => {
  try {
    // Extract query params and hash fragment
    const { queryParams } = Linking.parse(url);
    
    // Convert query params to a record of strings
    const params: Record<string, string> = {};
    
    // Process queryParams into a consistent format
    if (queryParams) {
      Object.entries(queryParams).forEach(([key, value]) => {
        // Handle arrays by taking the first item
        if (Array.isArray(value)) {
          params[key] = value[0] || '';
        } else {
          // Convert undefined to empty string
          params[key] = value || '';
        }
      });
    }
    
    return params;
  } catch (error) {
    console.error('Error parsing URL:', error);
    return {};
  }
};

/**
 * Register the custom scheme with Expo Linking
 */
export const registerLinkingConfiguration = () => {
  const scheme = Constants.expoConfig?.scheme || 'startup-pitch-challenge';
  const prefix = Platform.select({
    ios: `${scheme}://`,
    android: `${scheme}://`,
    web: '/',
  });

  // Register the scheme prefix
  if (prefix) {
    return {
      prefixes: [prefix],
      config: {
        screens: {
          // Define your screens here
          '/': 'home',
          '/auth/login': 'login',
          '/tabs/home': 'home',
          '/tabs/discover': 'discover',
          '/tabs/balance': 'balance',
        },
      },
    };
  }

  return {};
};
