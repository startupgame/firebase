import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Platform } from 'react-native';
import { Text, Button, Title, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useSupabase } from '../../lib/supabase/SupabaseProvider';
import { useStore, updateUserBalanceEverywhere } from '../../lib/store/useStore';
import { supabase } from '../../lib/supabase/supabaseClient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { RewardedAdManager, RewardedAdEventType } from '../../lib/ads/adManager';

export default function BalanceScreen() {
  const theme = useTheme();
  const { session, isLoading: sessionLoading } = useSupabase();
  const router = useRouter();
  const storeUser = useStore(state => state.user);
  const balance = storeUser?.cashAvailable ?? 0;
  // State for throttling and loading
  const [adCooldown, setAdCooldown] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Redirect to login if unauthenticated
  useEffect(() => {
    if (!sessionLoading && !session) {
      router.replace('/auth/login');
    }
  }, [session, sessionLoading]);

  if (sessionLoading || !storeUser) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#FFFFFF" />
      </View>
    );
  }

  const addBalance = async (amount: number) => {
    if (!storeUser?.id) return;
    const newBalance = storeUser.cashAvailable + amount;
    await updateUserBalanceEverywhere(storeUser.id, newBalance);
  };

  // Simple throttle: prevent multiple ad watches in a short time
  const handleWatchAd = async () => {
    if (adCooldown) return;
    setAdCooldown(true);
    setIsLoading(true);
    try {
      // Create a rewarded ad with the new ad unit ID
      const rewardedAd = RewardedAdManager.createForAdRequest('ca-app-pub-4105560350915598/8580881335', {
        requestNonPersonalizedAdsOnly: true,
      });

      // Add event listeners
      const unsubscribeLoaded = rewardedAd.addAdEventListener(RewardedAdEventType.LOADED, () => {
        // Ad loaded, now show it
        rewardedAd.show();
      });

      const unsubscribeEarned = rewardedAd.addAdEventListener(RewardedAdEventType.EARNED_REWARD, (reward: { type: string; amount: number }) => {
        // User earned reward, give them 50k balance
        addBalance(50000);
      });

      const unsubscribeClosed = rewardedAd.addAdEventListener(RewardedAdEventType.CLOSED, () => {
        setIsLoading(false);
        // Clean up event listeners
        unsubscribeLoaded();
        unsubscribeEarned();
        unsubscribeClosed();
      });

      // Load the ad
      rewardedAd.load();
    } catch (error) {
      console.error('Rewarded ad error:', error);
      setIsLoading(false);
    } finally {
      // Keep the cooldown timer running regardless of success/failure
      setTimeout(() => setAdCooldown(false), 60000);
    }
  };

  // Use toLocaleString for currency formatting compatible with React Native
  const formatCurrency = (amt: number) =>
    amt.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    });

  return (
    <View style={styles.container}>
      <Title style={[styles.title, { color: '#FFFFFF' }]}> 
        <MaterialCommunityIcons name="bank-outline" size={24} color="#FFFFFF" style={{ marginRight: 8 }} />
        Balance
      </Title>
      <Text style={[styles.amount, { color: '#FFFFFF' }]}>{formatCurrency(balance)}</Text>
      <Text style={[styles.watchAdPrompt, { color: '#DDD' }]}>  
        {adCooldown
          ? 'Please wait 1 minute before watching another ad.'
          : 'Watch an ad to earn free balance!'}
      </Text>
      <View style={styles.buttonColumn}>
        <Button
          mode="contained"
          icon={() => <MaterialCommunityIcons name="video-outline" size={24} color="#FFFFFF" />}
          onPress={handleWatchAd}
          disabled={adCooldown}
          style={[styles.buttonFull, styles.watchAdButton]}
          labelStyle={styles.watchAdLabel}
        >
          Watch Ad for $50k
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16, backgroundColor: '#1C1B1F' },
  title: { marginBottom: 8, fontSize: 22 },
  amount: { fontSize: 36, fontWeight: 'bold', marginBottom: 24 },
  buttonColumn: { width: '100%' },
  buttonFull: { width: '100%', marginVertical: 8 },
  watchAdButton: { backgroundColor: '#E53935', height: 60, justifyContent: 'center' },
  watchAdLabel: { color: '#FFFFFF', fontWeight: 'bold' },
  watchAdPrompt: { marginVertical: 8, fontSize: 16, textAlign: 'center' },
  note: { marginTop: 16, fontSize: 12, color: '#DDD', textAlign: 'center' },
}); 