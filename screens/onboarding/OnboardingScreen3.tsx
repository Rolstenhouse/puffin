import React from "react";
import { View, Text, Button } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";

type OnboardingStackParamList = {
  Onboarding1: undefined;
  Onboarding2: undefined;
  Onboarding3: undefined;
  Home: undefined;
};

type OnboardingScreen3NavigationProp = StackNavigationProp<
  OnboardingStackParamList,
  "Onboarding3"
>;

type OnboardingScreen3RouteProp = RouteProp<
  OnboardingStackParamList,
  "Onboarding3"
>;

type Props = {
  navigation: OnboardingScreen3NavigationProp;
  route: OnboardingScreen3RouteProp;
};

export default function OnboardingScreen3({ navigation }: Props) {
  return (
    <View>
      <Text>You're ready to get started!</Text>
      <Button title='Get Started' onPress={() => navigation.navigate("Home")} />
    </View>
  );
}
