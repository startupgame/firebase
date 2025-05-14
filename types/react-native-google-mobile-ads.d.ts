declare module 'react-native-google-mobile-ads' {
  export enum MaxAdContentRating {
    G = 'G',
    PG = 'PG',
    T = 'T',
    MA = 'MA',
  }

  export enum BannerAdSize {
    BANNER = 'BANNER',
    FULL_BANNER = 'FULL_BANNER',
    LARGE_BANNER = 'LARGE_BANNER',
    MEDIUM_RECTANGLE = 'MEDIUM_RECTANGLE',
    LEADERBOARD = 'LEADERBOARD',
    SMART_BANNER = 'SMART_BANNER',
    ANCHORED_ADAPTIVE_BANNER = 'ANCHORED_ADAPTIVE_BANNER',
  }

  export enum TestIds {
    BANNER = 'ca-app-pub-3940256099942544/6300978111',
    INTERSTITIAL = 'ca-app-pub-3940256099942544/1033173712',
    REWARDED = 'ca-app-pub-3940256099942544/5224354917',
    REWARDED_INTERSTITIAL = 'ca-app-pub-3940256099942544/5354046379',
  }

  export enum AdEventType {
    LOADED = 'loaded',
    ERROR = 'error',
    OPENED = 'opened',
    CLOSED = 'closed',
    IMPRESSION = 'impression',
    CLICKED = 'clicked',
  }

  export enum RewardedAdEventType {
    LOADED = 'loaded',
    ERROR = 'error',
    OPENED = 'opened',
    CLOSED = 'closed',
    EARNED_REWARD = 'earned_reward',
  }

  export interface RewardedAdReward {
    type: string;
    amount: number;
  }

  export interface AdapterStatus {
    state: number;
    description: string;
    latency: number;
  }

  export interface AdapterStatuses {
    [key: string]: AdapterStatus;
  }

  export interface RequestConfiguration {
    maxAdContentRating?: MaxAdContentRating;
    tagForChildDirectedTreatment?: boolean | null;
    tagForUnderAgeOfConsent?: boolean | null;
    testDeviceIdentifiers?: string[];
  }

  export interface RequestOptions {
    requestNonPersonalizedAdsOnly?: boolean;
    keywords?: string[];
    contentUrl?: string;
    neighboringContentUrls?: string[];
    mediationExtras?: Record<string, string>[];
    httpTimeoutMs?: number;
    serverSideVerificationOptions?: {
      userId?: string;
      customData?: string;
    };
  }

  export class InterstitialAd {
    static createForAdRequest(adUnitId: string, requestOptions?: RequestOptions): InterstitialAd;
    addAdEventListener(event: AdEventType, listener: (error?: Error) => void): () => void;
    load(): Promise<void>;
    show(): Promise<void>;
    isLoaded(): boolean;
  }

  export class RewardedAd {
    static createForAdRequest(adUnitId: string, requestOptions?: RequestOptions): RewardedAd;
    addAdEventListener(event: RewardedAdEventType, listener: (reward?: RewardedAdReward) => void): () => void;
    load(): Promise<void>;
    show(): Promise<void>;
    isLoaded(): boolean;
  }

  export default function MobileAds(): {
    initialize(): Promise<AdapterStatuses>;
    setRequestConfiguration(requestConfiguration: RequestConfiguration): Promise<void>;
  };
}
