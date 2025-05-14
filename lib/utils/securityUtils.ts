import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * More secure storage solution
 * For sensitive data like auth tokens, consider using:
 * - iOS: Keychain
 * - Android: Encrypted SharedPreferences
 * 
 * This is a simplified version using AsyncStorage
 */
export const SecureStorage = {
  setItem: async (key: string, value: string): Promise<void> => {
    try {
      // In a real app, you'd encrypt this data before storing
      // or use a library like expo-secure-store
      await AsyncStorage.setItem("secure_" + key, value);
    } catch (error) {
      console.error('Error storing secure data:', error);
    }
  },
  
  getItem: async (key: string): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem("secure_" + key);
    } catch (error) {
      console.error('Error retrieving secure data:', error);
      return null;
    }
  },
  
  removeItem: async (key: string): Promise<void> => {
    try {
      await AsyncStorage.removeItem("secure_" + key);
    } catch (error) {
      console.error('Error removing secure data:', error);
    }
  },
  
  clear: async (): Promise<void> => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const secureKeys = keys.filter(key => key.startsWith('secure_'));
      await AsyncStorage.multiRemove(secureKeys);
    } catch (error) {
      console.error('Error clearing secure storage:', error);
    }
  }
};

/**
 * Network security utility
 */
export const validateServerResponse = (response: any): boolean => {
  // Implement validation logic for server responses
  // to prevent injection attacks
  if (!response) return false;
  
  // Example validation (adapt based on your API responses)
  if (typeof response === 'object' && !Array.isArray(response)) {
    return true;
  }
  
  return false;
};
