import React from "react";
import { View, Text, Pressable } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import styled from "styled-components/native";

const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const NextButton = styled.Pressable`
  margin-top: 20px;
  margin-bottom: 20px;
  font-size: 16px;
  border-radius: 3px;
  padding: 10px;
  width: fit-content;
`;

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
      <Title>Welcome to Puffin!</Title>
      <Text>Are you ready to begin your relationship journey?</Text>
      <NextButton onPress={() => navigation.navigate("Onboarding2")}>
        <Text>Yes, let's go!</Text>
      </NextButton>
    </View>
  );
}
