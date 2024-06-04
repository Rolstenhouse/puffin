import React from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import styled from "styled-components/native";
import { StackedLogo } from "../../components/StackedLogo";
import BigButton from "../../components/BigButton";

const OnboardingView = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background-color: #faf3ea;
`;

const Title = styled.Text`
  font-size: 32px;
  font-weight: 800;
  margin-bottom: 20px;
`;

const Subtitle = styled.Text`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 20px;
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
    <OnboardingView>
      <StackedLogo includeText={false} />
      <Title>Welcome to Puffin!</Title>
      <Subtitle>Take your relationship to the next level</Subtitle>
      <BigButton
        onPress={() => navigation.navigate("Onboarding2")}
        text="Let's get started!"
      />
    </OnboardingView>
  );
}
