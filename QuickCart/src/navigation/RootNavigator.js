import React, {useEffect, useRef} from 'react';
import {NativeEventEmitter, NativeModules, Platform} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import branch from 'react-native-branch';
import HomeScreen from '../screens/HomeScreen';
import ProductScreen from '../screens/ProductScreen';
import CategoryScreen from '../screens/CategoryScreen';
import {resolveDeepLink} from '../routeResolver';

const Stack = createNativeStackNavigator();
const {DeepLinkModule} = NativeModules;

export default function RootNavigator() {
  const navigationRef = useRef(null);
  const isReadyRef = useRef(false);

  const navigateFromUrl = url => {
    const route = resolveDeepLink(url, 'quickcart');
    if (!route || !navigationRef.current) {
      return;
    }
    console.log('[QuickCart] Deep link resolved:', url, route);
    if (route.screen === 'Home') {
      navigationRef.current.navigate('Home');
      return;
    }
    navigationRef.current.navigate(route.screen, route.params);
  };

  useEffect(() => {
    if (Platform.OS !== 'ios' || !DeepLinkModule) {
      return undefined;
    }

    const emitter = new NativeEventEmitter(DeepLinkModule);
    const subscription = emitter.addListener('DeepLinkReceived', event => {
      if (event?.url) {
        navigateFromUrl(event.url);
      }
    });

    const branchSub = branch.subscribe({
      onOpenStart: ({uri}) => console.log('[Branch] open start', uri),
      onOpenComplete: ({error, params, uri}) => {
        if (error) {
          console.warn('[Branch] error', error);
          return;
        }
        console.log('[Branch] open complete', params, uri);
        const branchUrl =
          params?.$canonical_url ||
          params?.$desktop_url ||
          params?.['+non_branch_link'] ||
          uri;
        if (branchUrl && isReadyRef.current) {
          navigateFromUrl(branchUrl);
        }
      },
    });

    return () => {
      subscription.remove();
      branchSub();
    };
  }, []);

  const onReady = () => {
    isReadyRef.current = true;
    if (Platform.OS === 'ios' && DeepLinkModule?.notifyNavigationReady) {
      DeepLinkModule.notifyNavigationReady();
    }
  };

  return (
    <NavigationContainer ref={navigationRef} onReady={onReady}>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{title: 'QuickCart'}}
        />
        <Stack.Screen
          name="Product"
          component={ProductScreen}
          options={{title: 'Product'}}
        />
        <Stack.Screen
          name="Category"
          component={CategoryScreen}
          options={{title: 'Category'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
