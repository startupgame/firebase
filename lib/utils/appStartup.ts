import { useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export function useAppStartup() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts
        await Font.loadAsync({
          // Add any custom fonts here
        });
        
        // Pre-load images
        await Asset.loadAsync([
          require('../../assets/icon.png'),
          require('../../assets/splash-icon.png'),
          // Add more critical images here
        ]);
        
        // Pre-warm any critical API calls or data
        // e.g., await supabase.auth.getUser();
        
        // Artificial delay for a smooth transition
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  useEffect(() => {
    if (appIsReady) {
      // This tells the splash screen to hide immediately
      SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  return appIsReady;
}
