import React, { useEffect } from "react";
import { View, Text, ScrollView, TextInput, Button } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { supabase } from "../../lib/supabase";
import styled from "styled-components/native";
import BigButton from "../../components/BigButton";
import { StackedLogo } from "../../components/StackedLogo";

const OnboardingView = styled.View`
  flex: 1;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  padding-top: 60px;
  background-color: #faf3ea;
`;

const Input = styled.TextInput`
  border-radius: 5px;
  padding: 10px;
  font-size: 16px;
  margin-bottom: 10px;
  width: ${(props) => props.width || "200px"};
  border: solid 0px #0a3924;
  border-bottom-width: 0.5px;
  color: #0a3924;
  text-align: ${(props) => (props.center ? "center" : "left")};
`;

const Label = styled.Text`
  font-size: 16px;
  color: #0a3924;
  font-weight: 600;
  margin-bottom: 4px;
`;

const Error = styled.Text`
  font-size: 12px;
  color: red;
  font-weight: 600;
  margin-bottom: 4px;
`;

type OnboardingStackParamList = {
  Onboarding1: undefined;
  Onboarding2: undefined;
  Onboarding3: undefined;
};

type OnboardingScreen2NavigationProp = StackNavigationProp<
  OnboardingStackParamList,
  "Onboarding2"
>;

type OnboardingScreen2RouteProp = RouteProp<
  OnboardingStackParamList,
  "Onboarding2"
>;

type Props = {
  navigation: OnboardingScreen2NavigationProp;
  route: OnboardingScreen2RouteProp;
};

export default function OnboardingScreen2({ navigation }: Props) {
  const [name, setName] = React.useState("");
  const [nameError, setNameError] = React.useState("");

  const handleConfirm = async () => {
    const { data, error } = await supabase.auth.updateUser({
      data: { name: name },
    });

    if (error) {
      setNameError(error.message);
    } else {
      navigation.navigate("Home");
    }
  };

  return (
    <OnboardingView>
      <StackedLogo />
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View>
          <Label>Your name</Label>
          <Input
            value={name}
            onChangeText={(e) => {
              setName(e);
              setNameError("");
            }}
          />
          {nameError && <Error>{nameError}</Error>}
        </View>
        <BigButton
          text={"Confirm"}
          onPress={handleConfirm}
          disabled={!name || !!nameError}
        />
      </ScrollView>
    </OnboardingView>
  );
}
