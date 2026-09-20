import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, type NavigatorScreenParams } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { ChatScreen } from '../screens/ChatScreen';
import { DirectionsScreen } from '../screens/DirectionsScreen';
import { FieldStatesScreen } from '../screens/FieldStatesScreen';
import { ItineraryScreen } from '../screens/ItineraryScreen';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { PoiDetailScreen } from '../screens/PoiDetailScreen';
import { SavedScreen } from '../screens/SavedScreen';
import { TodayScreen } from '../screens/TodayScreen';
import { TabBar } from './TabBar';

/**
 * Điều hướng theo handoff §Tương tác:
 *  - Màn 3/4/7 (+ Trợ lý) là tab gốc, không dùng back stack giữa chúng.
 *  - Chi tiết điểm và Chỉ đường mở chồng lên (stack).
 *  - Onboarding là màn đầu, vào app xong thì thay bằng tab.
 */

export type TabParamList = {
  Today: undefined;
  Itinerary: undefined;
  Chat: undefined;
  Saved: undefined;
};

export type RootStackParamList = {
  Onboarding: undefined;
  Main: NavigatorScreenParams<TabParamList>;
  PoiDetail: { poiId: string };
  Directions: { poiId: string };
  FieldStates: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

const MainTabs: React.FC = () => (
  <Tab.Navigator
    tabBar={(props) => <TabBar {...props} />}
    screenOptions={{ headerShown: false }}
    initialRouteName="Today"
  >
    <Tab.Screen name="Today">
      {({ navigation }) => (
        <TodayScreen
          onOpenPoi={(poiId) => navigation.navigate('PoiDetail', { poiId })}
          onOpenDirections={(poiId) => navigation.navigate('Directions', { poiId })}
        />
      )}
    </Tab.Screen>

    <Tab.Screen name="Itinerary">
      {({ navigation }) => (
        <ItineraryScreen
          onOpenPoi={(poiId) => navigation.navigate('PoiDetail', { poiId })}
          onAskAssistant={() => navigation.navigate('Chat')}
        />
      )}
    </Tab.Screen>

    <Tab.Screen name="Chat">
      {({ navigation }) => (
        <ChatScreen
          onBackToOnboarding={() => navigation.navigate('Onboarding')}
          onOpenItinerary={() => navigation.navigate('Itinerary')}
        />
      )}
    </Tab.Screen>

    <Tab.Screen name="Saved">
      {({ navigation }) => (
        <SavedScreen
          onNewTrip={() => navigation.navigate('Onboarding')}
          onOpenTrip={() => navigation.navigate('Today')}
          onOpenPoi={(poiId) => navigation.navigate('PoiDetail', { poiId })}
        />
      )}
    </Tab.Screen>
  </Tab.Navigator>
);

export const RootNavigator: React.FC = () => (
  <NavigationContainer>
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Onboarding">
      <Stack.Screen name="Onboarding">
        {({ navigation }) => (
          <OnboardingScreen onSubmit={() => navigation.navigate('Main', { screen: 'Chat' })} />
        )}
      </Stack.Screen>

      <Stack.Screen name="Main" component={MainTabs} />

      <Stack.Screen name="PoiDetail">
        {({ navigation, route }) => (
          <PoiDetailScreen
            poiId={route.params.poiId}
            onBack={() => navigation.goBack()}
            onAddToItinerary={() => navigation.navigate('Main', { screen: 'Itinerary' })}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="Directions">
        {({ navigation, route }) => (
          <DirectionsScreen poiId={route.params.poiId} onBack={() => navigation.goBack()} />
        )}
      </Stack.Screen>

      <Stack.Screen name="FieldStates" component={FieldStatesScreen} />
    </Stack.Navigator>
  </NavigationContainer>
);
