import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
} from "react-native";
import Daily, {
  DailyCall,
  DailyParticipantsObject,
} from "@daily-co/react-native-daily-js";
import { StackedLogo } from "../components/StackedLogo";
import BigButton from "../components/BigButton";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#faf3ea",
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontFamily: "Inter-Black",
    textAlign: "center",
  },
  smallTitle: {
    fontSize: 16,
    fontFamily: "Inter-Black",
  },
  button: {
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 10,
    padding: 20,
    width: 200,
    alignItems: "center",
  },
  disclaimerContainer: {
    padding: 10,
    marginBottom: 80,
    gap: 4,
  },
  logoContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  roundedLogo: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#0a3924",
    borderRadius: 100,
    width: 100,
    height: 100,
  },
  transcriptContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
    width: 250,
  },
  transcript: {
    fontSize: 20,
    fontFamily: "Inter-Black",
    fontWeight: "bold",
    textAlign: "center",
  },
});

type CallScreenProps = {
  messages: string[];
  guidingQuestions: string[];
  prompt_id?: string;
};

export default function CallScreen({
  messages,
  guidingQuestions,
  prompt_id,
}: CallScreenProps) {
  type CallStateOptions = "waiting" | "connecting" | "active" | "ended";
  const [call, setCall] = useState<null | DailyCall>();
  const [callState, setCallState] = useState<CallStateOptions>("waiting");

  const [partialTranscript, setPartialTranscript] = useState<string>();

  const [localParticipantId, setLocalParticipantId] = useState<string>();

  const fades = Array(messages.length + 1)
    .fill(0)
    .map(() => useRef(new Animated.Value(0)).current);

  const voice = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      // runs given animations in a sequence
      Animated.sequence([
        // increase size
        Animated.timing(voice, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        // decrease size
        Animated.timing(voice, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  fades.forEach((fade, index) => {
    useEffect(() => {
      setTimeout(() => {
        Animated.timing(fade, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }).start();
      }, 500 * index);
    }, [fade]);
  });

  const handleStart = async () => {
    const data = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/startRoom?prompt_id=${prompt_id}`
    );
    const json = await data.json();
    const url = json.url;
    console.log("url", url);
    const call = Daily.createCallObject({
      audioSource: true,
      videoSource: false,
    });
    setCall(call);

    const dailyObject = await call.join({ url: url });
    console.log("dailyObject");
    console.log(dailyObject);
    if (!dailyObject) {
      console.error("no obj");
      setCallState("waiting");
      return;
    }

    setLocalParticipantId(dailyObject.local.session_id);

    call.on("transcription-message", (message) => {
      console.log("transcription");
      console.log(message);

      if (message.participantId !== localParticipantId) {
        setPartialTranscript(message.text);
      }

      console.log(
        message.rawResponse.channel.alternatives?.map((alt) =>
          alt.words?.map((word) => word.speaker)
        )
      );
    });

    call.on("app-message", (message) => {
      console.log("app");
      console.log(message);
    });

    call.on("error", (error) => {
      console.error(error);
      setCallState("waiting");
    });

    setCallState("active");
  };

  const handleEnd = () => {
    call?.leave();
    setCall(null);
    setCallState("waiting");
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          flex: 1,
          paddingTop: 20,
          gap: 64,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {callState === "waiting" || callState === "connecting" ? (
          <>
            {messages.map((message, index) => (
              <Animated.View key={index} style={{ opacity: fades[index] }}>
                <Text style={styles.title}>{message}</Text>
              </Animated.View>
            ))}
            <Animated.View style={{ opacity: fades[messages.length] }}>
              <BigButton
                disabled={callState === "connecting"}
                onPress={handleStart}
                text={callState === "waiting" ? "Get Started" : "Connecting"}
              ></BigButton>
            </Animated.View>
          </>
        ) : (
          <>
            <View style={styles.logoContainer}>
              <Animated.View
                style={[styles.roundedLogo, { transform: [{ scale: voice }] }]}
              >
                <StackedLogo />
              </Animated.View>
              <View style={styles.transcriptContainer}>
                <Text style={styles.transcript}>{partialTranscript}</Text>
              </View>
            </View>
            {guidingQuestions?.length > 0 && (
              <View>
                <Text style={styles.smallTitle}>Helpful questions</Text>
                {guidingQuestions.map((question, index) => (
                  <Text key={index}>{question}</Text>
                ))}
              </View>
            )}
            <BigButton onPress={handleEnd} text='End call'></BigButton>
          </>
        )}
      </View>
    </View>
  );
}
