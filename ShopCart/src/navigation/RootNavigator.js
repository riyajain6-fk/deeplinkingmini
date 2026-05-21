import React, {useEffect, useRef} from 'react';
import {NativeEventEmitter, NativeModules, Platform} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import ProductScreen from '../screens/ProductScreen';
import CategoryScreen from '../screens/CategoryScreen';
import QuickCartTabScreen from '../screens/QuickCartTabScreen';
import QuickCartProductScreen from '../screens/QuickCartProductScreen';
import {resolveDeepLink} from '../routeResolver';

const Stack = createNativeStackNavigator();
const {DeepLinkModule} = NativeModules;

export default function RootNavigator() {
  const navigationRef = useRef(null);
  const isReadyRef = useRef(false);

  const navigateFromUrl = url => {
    const route = resolveDeepLink(url, 'shopcart');
    if (!route || !navigationRef.current) {
      return;
    }
    console.log('[ShopCart] Deep link resolved:', url, route);
    if (route.screen === 'Home') {
      navigationRef.current.navigate('Home');
      return;
    }
    if (route.screen === 'QuickCartTab') {
      navigationRef.current.navigate('QuickCartTab', {
        productId: route.params?.productId,
      });
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

    return () => subscription.remove();
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
        <Stack.Screen name="Home" component={HomeScreen} options={{title: 'ShopCart'}} />
        <Stack.Screen name="Product" component={ProductScreen} options={{title: 'Product'}} />
        <Stack.Screen name="Category" component={CategoryScreen} options={{title: 'Category'}} />
        <Stack.Screen
          name="QuickCartTab"
          component={QuickCartTabScreen}
          options={{title: 'QuickCart (Minutes)'}}
        />
        <Stack.Screen
          name="QuickCartProduct"
          component={QuickCartProductScreen}
          options={{title: 'QC Product'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
