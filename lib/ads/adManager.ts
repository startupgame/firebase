import { Platform } from 'react-native';

// Define enums as JavaScript objects to avoid import errors
export const AdEventType = {
  LOADED: 'loaded',
  CLOSED: 'closed',
  ERROR: 'error',
  OPENED: 'opened',
  CLICKED: 'clicked',
  IMPRESSION: 'impression'
};

export const RewardedAdEventType = {
  LOADED: 'loaded',
  EARNED_REWARD: 'earned_reward',
  CLOSED: 'closed',
  ERROR: 'error',
  OPENED: 'opened'
};

export const MaxAdContentRating = {
  G: 'G',
  PG: 'PG',
  T: 'T',
  MA: 'MA'
};

// Create mock implementations
const mockMobileAds = () => ({
  initialize: () => {
    console.log('[MOCK] Google Mobile Ads initialized');
    return Promise.resolve({});
  },
  setRequestConfiguration: (config: any) => {
    console.log('[MOCK] Set ad configuration:', config);
    return Promise.resolve();
  }
});

const mockRewardedAd = {
  createForAdRequest: (adUnitId: string, requestOptions?: any) => {
    console.log(`[MOCK] Created rewarded ad for unit ID: ${adUnitId}`);
    return {
      load: () => {
        console.log('[MOCK] Loading rewarded ad');
      },
      show: () => {
        console.log('[MOCK] Showing rewarded ad');
      },
      addAdEventListener: (event: string, callback: any) => {
        console.log(`[MOCK] Added listener for event: ${event}`);
        
        // Simulate events with timeouts
        if (event === RewardedAdEventType.LOADED) {
          setTimeout(() => {
            console.log('[MOCK] Rewarded ad loaded');
            callback();
          }, 1000);
        }
        
        if (event === RewardedAdEventType.EARNED_REWARD) {
          setTimeout(() => {
            console.log('[MOCK] Reward earned');
            callback({ type: 'coins', amount: 1 });
          }, 2000);
        }
        
        if (event === RewardedAdEventType.CLOSED) {
          setTimeout(() => {
            console.log('[MOCK] Rewarded ad closed');
            callback();
          }, 3000);
        }
        
        // Return a function to unsubscribe
        return () => {
          console.log(`[MOCK] Removed listener for event: ${event}`);
        };
      }
    };
  }
};

const mockInterstitialAd = {
  createForAdRequest: (adUnitId: string, requestOptions?: any) => {
    console.log(`[MOCK] Created interstitial ad for unit ID: ${adUnitId}`);
    return {
      load: () => {
        console.log('[MOCK] Loading interstitial ad');
      },
      show: () => {
        console.log('[MOCK] Showing interstitial ad');
      },
      addAdEventListener: (event: string, callback: any) => {
        console.log(`[MOCK] Added listener for event: ${event}`);
        
        // Simulate events with timeouts
        if (event === AdEventType.LOADED) {
          setTimeout(() => {
            console.log('[MOCK] Interstitial ad loaded');
            callback();
          }, 1000);
        }
        
        if (event === AdEventType.CLOSED) {
          setTimeout(() => {
            console.log('[MOCK] Interstitial ad closed');
            callback();
          }, 2000);
        }
        
        // Return a function to unsubscribe
        return () => {
          console.log(`[MOCK] Removed listener for event: ${event}`);
        };
      }
    };
  }
};

// Decide which implementation to use
const isWeb = Platform.OS === 'web';
const isDev = __DEV__; // Use React Native's built-in __DEV__ flag

// Safely try to load the actual modules
let realMobileAds: any = null;
let realRewardedAd: any = null;
let realInterstitialAd: any = null;

// Only try to import if we're in a native environment
if (!isWeb && !isDev) {
  try {
    // Dynamic require to prevent crashes during import
    const GoogleMobileAds = require('react-native-google-mobile-ads');
    realMobileAds = GoogleMobileAds.default;
    realRewardedAd = GoogleMobileAds.RewardedAd;
    realInterstitialAd = GoogleMobileAds.InterstitialAd;
  } catch (error) {
    console.warn('Failed to load Google Mobile Ads module:', error);
  }
}

// Export the real modules or fallbacks as needed
export const MobileAdsManager = realMobileAds || mockMobileAds;
export const RewardedAdManager = realRewardedAd || mockRewardedAd;
export const InterstitialAdManager = realInterstitialAd || mockInterstitialAd;

// Helper function to initialize ads safely
export const initializeAds = async () => {
  try {
    if (isWeb || isDev || !realMobileAds) {
      console.log('Using mock ads implementation for web/dev environment');
      return true;
    } else {
      await realMobileAds().initialize();
      await realMobileAds().setRequestConfiguration({
        maxAdContentRating: MaxAdContentRating.PG,
        tagForChildDirectedTreatment: false,
        tagForUnderAgeOfConsent: false,
      });
      console.log('Google Mobile Ads initialized successfully');
      return true;
    }
  } catch (error) {
    console.warn('Error initializing Google Mobile Ads:', error);
    return false;
  }
};
