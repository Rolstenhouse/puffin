import React from "react";
import { View, Text, Button } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";

type OnboardingStackParamList = {
  Onboarding1: undefined;
  Onboarding2: undefined;
  Onboarding3: undefined;
};

type OnboardingScreen1NavigationProp = StackNavigationProp<
  OnboardingStackParamList,
  "Onboarding1"
>;

type OnboardingScreen1RouteProp = RouteProp<
  OnboardingStackParamList,
  "Onboarding1"
>;

type Props = {
  navigation: OnboardingScreen1NavigationProp;
  route: OnboardingScreen1RouteProp;
};

export default function OnboardingScreen1({ navigation }: Props) {
  return (
    <View>
      <Text>Welcome to Puffin!</Text>
      <Text>Are you ready to begin your relationship journey?</Text>
      <Button title='Next' onPress={() => navigation.navigate("Onboarding2")} />
    </View>
  );
}
