import 'react-native-url-polyfill/auto';
import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useStore } from '../lib/store/useStore';
import { SupabaseProvider, useSupabase } from '../lib/supabase/SupabaseProvider';
import { View, ActivityIndicator, Platform } from 'react-native';
import { initializeAds } from '../lib/ads/adManager';
import { setupDeepLinking } from '../lib/supabase/deepLinkHandling';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';

// Auth context provider
function RootLayoutNav() {
  const { session, isLoading } = useSupabase();
  const segments = useSegments();
  const router = useRouter();
  
  // Get store for initial data loading
  const loadStartups = useStore(state => state.loadStartups);

  // Effect to manage authentication state
  useEffect(() => {
    if (isLoading) return;

    // Handle auth state changes
    const inAuthGroup = segments[0] === 'auth';

    if (!session && !inAuthGroup) {
      // If not logged in and not in auth group, redirect to login
      router.replace('/auth/login');
    } else if (session && inAuthGroup) {
      // If logged in and in auth group, redirect to home
      router.replace('/tabs/home');
    }
  }, [session, segments, isLoading]);

  // On mount, try to load startup data
  useEffect(() => {
    if (session) {
      // Load real data when authenticated
      loadStartups();
    }
  }, [session]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0A66C2" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen 
        name="auth" 
        options={{ 
          headerShown: false,
          animation: 'fade',
        }} 
      />
      <Stack.Screen
        name="tabs"
        options={{
          headerShown: false,
          animation: 'fade',
        }}
      />
      <Stack.Screen
        name="modals"
        options={{
          presentation: 'modal',
          animation: 'slide_from_bottom',
        }}
      />
    </Stack>
  );
}

// Main app layout
export default function AppLayout() {
  useEffect(() => {
    // Initialize Google Mobile Ads
    initializeAds().catch(error => {
      console.warn('Failed to initialize ads:', error);
    });
    
    // Set up deep link handling for authentication
    const cleanupDeepLinking = setupDeepLinking();
    
    // Clean up on unmount
    return () => {
      if (typeof cleanupDeepLinking === 'function') {
        cleanupDeepLinking();
      }
    };
  }, []);
  
  // Define the app theme
  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: '#0A66C2',  // LinkedIn blue - matches your existing theme
      accent: '#D4AF37',   // Gold color for accents
    },
  };
  
  return (
    <PaperProvider theme={theme}>
      <SupabaseProvider>
        <RootLayoutNav />
      </SupabaseProvider>
    </PaperProvider>
  );
} 