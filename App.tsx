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
import CallScreen from "./screens/CallScreen";

const Stack = createNativeStackNavigator();

AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

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
        headerStyle: { backgroundColor: "#FAF3EA" },
        headerTitleStyle: { fontFamily: "Inter-Black" },
        headerBackTitleVisible: false,
        headerShadowVisible: false,
        headerTitle: "",
      }}
    >
      <Stack.Screen
        name='Home'
        component={HomeScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name='36Questions'>
        {() => (
          <CallScreen
            messages={[
              "This is a casual conversation",
              "Get comfortable",
              "And turn on Puffin",
            ]}
            guidingQuestions={["Can you tell me more?"]}
            prompt_id='QUESTIONS_36_PROMPT_ID'
          />
        )}
      </Stack.Screen>
      <Stack.Screen name='Sex & Intimacy'>
        {() => (
          <CallScreen
            messages={[
              "Find a romantic setting",
              "Get comfortable",
              "And turn on Puffin",
            ]}
            guidingQuestions={[
              "Can you tell me more?",
              "Do you like it more like this or like that?",
              "Yes, AND...",
              "What does that mean?",
            ]}
            prompt_id='RELATIONSHIP_PROMPT'
          />
        )}
      </Stack.Screen>
      <Stack.Screen name='Finances & Money'>
        {() => (
          <CallScreen
            messages={[
              "Secure the bag",
              "Align your financial goals",
              "Let puffin guide you",
            ]}
            guidingQuestions={[]}
            prompt_id='FINANCE_PROMPT'
          />
        )}
      </Stack.Screen>
      <Stack.Screen name='Bring your own'>
        {() => (
          <CallScreen
            messages={[
              "Talk to puffin",
              "Ask puffin to change up the prompt whenever",
              "See if you can do it in real life",
            ]}
            guidingQuestions={[]}
            prompt_id='GENERIC_PROMPT'
          />
        )}
      </Stack.Screen>
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
