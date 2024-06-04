import React from "react";
import { View, Text, TextInput, Button } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { supabase } from "../../lib/supabase";

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

  return (
    <View>
      <Text>Create your account to continue</Text>
      {waitingForOTP ? (
        <>
          <TextInput
            onChangeText={(e) => setOTP(e.slice(0, 6))}
            value={otp}
            maxLength={6}
            onEndEditing={verifyOTP}
          />
          {otpError && <Text>{otpError}</Text>}
        </>
      ) : (
        <>
          <Text>Phone Number</Text>

          <TextInput
            value={phone}
            onChangeText={handlePhoneChange}
            keyboardType='phone-pad'
            placeholder='Enter phone number'
            maxLength={14} // Maximum length for formatted phone number
          />

          {phoneError && <Text>{phoneError}</Text>}
        </>
      )}

      {!waitingForOTP && (
        <Button title='Create Account' onPress={handleLogin} />
      )}
    </View>
  );
}
