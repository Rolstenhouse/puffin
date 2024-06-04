import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  AppState,
} from "react-native";
import React from "react";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import QuestionsScreen from "./screens/36Questions";
import { useFonts } from "expo-font";
import { supabase } from "./lib/supabase";

import OnboardingScreen1 from "./screens/onboarding/OnboardingScreen1";
import OnboardingScreen2 from "./screens/onboarding/OnboardingScreen2";
import OnboardingScreen3 from "./screens/onboarding/OnboardingScreen3";

const Stack = createNativeStackNavigator();

AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

type BentoItemProps = {
  title: string;
  description: string;
  bottomLeft: string;
  bottomRight: string;
  onPress: () => void;
};

const BentoItem = ({
  title,
  description,
  bottomLeft,
  bottomRight,
  onPress,
}: BentoItemProps) => {
  return (
    <TouchableOpacity style={styles.bentoBox} onPress={onPress}>
      <View>
        <Text style={styles.bentoBoxTitle}>{title}</Text>
        <Text style={styles.bentoBoxDescription}>{description}</Text>
      </View>
      <View
        style={{
          alignItems: "flex-start",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Text style={styles.bentoBoxDescription}>{bottomLeft}</Text>
        <Text style={styles.bentoBoxDescription}>{bottomRight}</Text>
      </View>
    </TouchableOpacity>
  );
};

function HomeScreen({ navigation }) {
  let [fontsLoaded] = useFonts({
    "Inter-Black": require("./assets/fonts/Inter-Black.otf"),
  });

  if (!fontsLoaded) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View className='bg-background flex h-screen'>
      <ScrollView>
        <BentoItem
          title='36 questions to fall in love'
          description='Loved by 10000+ couples'
          bottomLeft={"Est. 3 hours"}
          bottomRight={"Not started"}
          onPress={() =>
            navigation.navigate("36Questions", { headerTitle: "36 questions" })
          }
        />
        <BentoItem
          title='Discussing sex and intimacy'
          description='Loved by 100+ couples'
          bottomLeft={"Est. 3 hours"}
          bottomRight={"Not started"}
          onPress={() =>
            navigation.navigate("Sex & Intimacy", { headerTitle: "Date 3" })
          }
        />
        <BentoItem
          title='Games: Would you rather?'
          description='Loved by 1000+ couples'
          bottomLeft={"Est. 30 min"}
          bottomRight={"Not started"}
          onPress={() =>
            navigation.navigate("Date3", { headerTitle: "Date 3" })
          }
        />
        <BentoItem
          title='Create your own'
          description='Puffin is a blank slate, you set the terms.'
          bottomLeft={"Est. ?"}
          bottomRight={"Not started"}
          onPress={() =>
            navigation.navigate("Date3", { headerTitle: "Date 3" })
          }
        />
        <StackedLogo />
      </ScrollView>
      <StatusBar style='auto' />
    </View>
  );
}

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

import { StackedLogo } from "./components/StackedLogo";
import Date3 from "./screens/Date3";

function OnboardingNavigator() {
  return (
    <Stack.Navigator initialRouteName='Onboarding1'>
      <Stack.Screen name='Onboarding1' component={OnboardingScreen1} />
      <Stack.Screen name='Onboarding2' component={OnboardingScreen2} />
      <Stack.Screen name='Onboarding3' component={OnboardingScreen3} />
    </Stack.Navigator>
  );
}

function MainAppNavigator({ navigation }) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "var(--background)" },
        headerTitleStyle: { fontFamily: "Inter-Black" },
      }}
    >
      <Stack.Screen
        name='Puffin'
        component={HomeScreen}
        options={{
          headerShown: true,
        }}
      />
      <Stack.Screen name='Details' component={DetailsScreen} />
      <Stack.Screen name='36Questions' component={QuestionsScreen} />
      <Stack.Screen name='Sex & Intimacy' component={Date3} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <OnboardingNavigator />
      {/* <MainAppNavigator /> */}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  bentoBox: {
    justifyContent: "space-between",
    padding: 16,
    margin: 10,
    height: 140,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#000",
  },
  bentoBoxTitle: {
    fontSize: 20,
    color: "#000",
    fontFamily: "Inter-Black",
  },
  bentoBoxDescription: {
    fontSize: 12,
    color: "#000",
  },
  title: {
    fontSize: 20,
    fontFamily: "Inter-Black",
  },
});
