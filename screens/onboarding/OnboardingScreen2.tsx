import React from "react";
import {
  View,
  KeyboardAvoidingView,
  Text,
  TextInput,
  Button,
  Pressable,
  ScrollView,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { supabase } from "../../lib/supabase";
import styled from "styled-components/native";
import BigButton from "../../components/BigButton";
import { StackedLogo } from "../../components/StackedLogo";

const OnboardingView = styled.KeyboardAvoidingView`
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

const Link = styled.Text`
  font-size: 12px;
  color: #0a3924;
  font-weight: 600;
  margin-bottom: 4px;
  text-decoration-line: underline;
  opacity: ${({ pressed }) => (pressed ? ".8" : "1")};
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
  const [phone, setPhone] = React.useState("");
  const [phoneError, setPhoneError] = React.useState("");
  const [waitingForOTP, setWaitingForOTP] = React.useState(false);
  const [otp, setOTP] = React.useState("");
  const [otpError, setOTPError] = React.useState("");

  const handlePhoneChange = (text: string) => {
    // Remove all non-numeric characters
    setPhoneError("");
    const cleaned = ("" + text).replace(/\D/g, "");
    const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);

    if (match) {
      const formatted = !match[2]
        ? match[1]
        : `(${match[1]}) ${match[2]}${match[3] ? `-${match[3]}` : ""}`;
      setPhone(formatted);
    } else {
      setPhone(text);
    }
  };

  const getE164Format = (): string => {
    // Remove all non-numeric characters
    const cleaned = phone.replace(/\D/g, "");
    return `+1${cleaned}`; // Assuming +1 for the country code
  };

  const handleSuccessfulOTP = () => {
    navigation.navigate("Onboarding3");
  };

  const verifyOTP = async () => {
    const { data, error } = await supabase.auth.verifyOtp({
      phone: getE164Format(),
      token: otp,
      type: "sms",
    });

    if (error) {
      setOTPError(error.message);
    } else {
      handleSuccessfulOTP();
    }
  };

  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithOtp({
      phone: getE164Format(),
      options: {
        channel: "sms",
      },
    });

    if (error) {
      setPhoneError(error.message);
    } else {
      setWaitingForOTP(true);
    }
  };

  const handleResendOTP = async () => {
    setOTPError("");
    const { data, error } = await supabase.auth.resend({
      type: "sms",
      phone: getE164Format(),
    });

    const { data: data2, error: error2 } = await supabase.auth.signInWithOtp({
      phone: getE164Format(),
      options: {
        channel: "sms",
      },
    });

    if (error) {
      setOTPError(error.message);
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
          {!waitingForOTP ? (
            <View>
              <Label>Phone</Label>

              <Input
                value={phone}
                onChangeText={handlePhoneChange}
                keyboardType='phone-pad'
                placeholder='(123) 456-7890'
                maxLength={14} // Maximum length for formatted phone number
              />

              {phoneError && <Error>{phoneError}</Error>}
            </View>
          ) : (
            <View style={{ alignItems: "center" }}>
              <Label>Your 6-digit code</Label>
              <Input
                onChangeText={(e) => {
                  setOTP(e.slice(0, 6));
                  setOTPError("");
                }}
                value={otp}
                maxLength={6}
                width='90px'
                center
              />
              {otpError ? (
                <>
                  <Error>{otpError}</Error>
                  <Pressable onPress={handleResendOTP}>
                    {({ pressed }) => (
                      <Link pressed={pressed}>Resend code</Link>
                    )}
                  </Pressable>
                </>
              ) : null}
            </View>
          )}
        </View>

        <View style={{ marginBottom: 20 }}>
          {!waitingForOTP ? (
            <BigButton
              text={"Create Account"}
              onPress={handleLogin}
              disabled={!phone || !!phoneError}
            />
          ) : (
            <BigButton
              text={"Confirm"}
              disabled={!otp || !!otpError}
              onPress={verifyOTP}
            />
          )}
        </View>
      </ScrollView>
    </OnboardingView>
  );
}
