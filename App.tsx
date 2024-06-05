import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  AppState,
} from "react-native";
import { Session } from "@supabase/supabase-js";

import React, { useEffect, useState } from "react";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import QuestionsScreen from "./screens/36Questions";
import { useFonts } from "expo-font";
import { supabase } from "./lib/supabase";

import OnboardingScreen1 from "./screens/onboarding/OnboardingScreen1";
import OnboardingScreen2 from "./screens/onboarding/OnboardingScreen2";
import OnboardingScreen3 from "./screens/onboarding/OnboardingScreen3";
import HomeScreen from "./screens/HomeScreen";
import Date3 from "./screens/Date3";

const Stack = createNativeStackNavigator();

AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

function DetailsScreen({ route, navigation }) {
  const headerTitle = route.params?.headerTitle || "Default Title";

  return (
    <View style={styles.container}>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>{headerTitle}</Text>
      </View>
    </View>
  );
}

function OnboardingNavigator() {
  return (
    <Stack.Navigator
      initialRouteName='Onboarding1'
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name='Onboarding1' component={OnboardingScreen1} />
      <Stack.Screen name='Onboarding2' component={OnboardingScreen2} />
      <Stack.Screen name='Onboarding3' component={OnboardingScreen3} />
    </Stack.Navigator>
  );
}

function MainAppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "var(--background)" },
        headerTitleStyle: { fontFamily: "Inter-Black" },
      }}
    >
      <Stack.Screen
        name='Home'
        component={HomeScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name='Details' component={DetailsScreen} />
      <Stack.Screen name='36Questions' component={QuestionsScreen} />
      <Stack.Screen name='Sex & Intimacy' component={Date3} />
    </Stack.Navigator>
  );
}

export default function App() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);
  return (
    <NavigationContainer>
      {session && session?.user?.user_metadata?.name ? (
        <MainAppNavigator />
      ) : (
        <OnboardingNavigator />
      )}
    </NavigationContainer>
  );
}
