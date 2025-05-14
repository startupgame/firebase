import { useRef, useEffect, useMemo, useState, useCallback } from 'react';
import { InteractionManager, Platform } from 'react-native';

/**
 * Hook to safely update state after the component has mounted
 * Prevents the "Warning: Can't perform a React state update on an unmounted component"
 */
export const useSafeState = <T>(initialState: T): [T, (newState: T) => void] => {
  const [state, setState] = useState<T>(initialState);
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const safeSetState = useCallback((newState: T) => {
    if (isMounted.current) {
      setState(newState);
    }
  }, []);

  return [state, safeSetState];
};

/**
 * Hook to defer expensive operations until after interactions
 */
export const useDeferredOperation = <T>(operation: () => T, deps: any[] = []) => {
  const [result, setResult] = useSafeState<T | null>(null);

  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      const operationResult = operation();
      setResult(operationResult);
    });

    return () => task.cancel();
  }, deps);

  return result;
};

/**
 * Optimize images based on platform
 * Use WebP for Android and optimized JPG/PNG for iOS
 */
export const getOptimizedImageSource = (path: string) => {
  if (Platform.OS === 'android') {
    // For Android, prefer WebP format if available
    return path.replace(/\.(png|jpg|jpeg)$/, '.webp');
  }
  // For iOS, use the original format (already optimized)
  return path;
};

/**
 * Memoize heavy computations
 */
export const memoize = <T, R>(fn: (arg: T) => R): (arg: T) => R => {
  const cache = new Map<T, R>();
  
  return (arg: T) => {
    if (cache.has(arg)) {
      return cache.get(arg)!;
    }
    
    const result = fn(arg);
    cache.set(arg, result);
    return result;
  };
};
