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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontFamily: "Inter-Black",
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
    borderColor: "#000",
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

export default function Date3() {
  type CallStateOptions = "waiting" | "connecting" | "active" | "ended";
  const [call, setCall] = useState<null | DailyCall>();
  const [callState, setCallState] = useState<CallStateOptions>("waiting");

  const [partialTranscript, setPartialTranscript] = useState<string>();

  const [localParticipantId, setLocalParticipantId] = useState<string>();

  const fade1 = useRef(new Animated.Value(0)).current;
  const fade2 = useRef(new Animated.Value(0)).current;
  const fade3 = useRef(new Animated.Value(0)).current;
  const fade4 = useRef(new Animated.Value(0)).current;

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

  useEffect(() => {
    Animated.timing(fade1, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();
  }, [fade1]);
  useEffect(() => {
    setTimeout(() => {
      Animated.timing(fade2, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }).start();
    }, 500);
  }, [fade2]);
  useEffect(() => {
    setTimeout(() => {
      Animated.timing(fade3, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }).start();
    }, 1000);
  }, [fade3]);
  useEffect(() => {
    setTimeout(() => {
      Animated.timing(fade4, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }).start();
    }, 1500);
  }, [fade4]);

  const handleStart = async () => {
    const data = await fetch(
      "https://snail-informed-daily.ngrok-free.app" + "/startRoom"
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
            <Animated.View style={{ opacity: fade1 }}>
              <Text style={styles.title}>Find a romantic setting</Text>
            </Animated.View>
            <Animated.View style={{ opacity: fade2 }}>
              <Text style={styles.title}>Get comfortable</Text>
            </Animated.View>
            <Animated.View style={{ opacity: fade3 }}>
              <Text style={styles.title}>And turn on Puffin</Text>
            </Animated.View>
            <Animated.View style={{ opacity: fade4 }}>
              <TouchableOpacity
                style={styles.button}
                disabled={callState === "connecting"}
                onPress={handleStart}
              >
                <Text style={styles.title}>
                  {callState === "waiting" ? "Get Started" : "Connecting"}
                </Text>
              </TouchableOpacity>
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
            <View>
              <Text style={styles.smallTitle}>Helpful questions</Text>
              <Text>Can you tell me more?</Text>
              <Text>Do you like it more like this or like that?</Text>
              <Text>Yes, AND ...</Text>
              <Text>What does that mean?</Text>
            </View>
            <TouchableOpacity style={styles.button} onPress={handleEnd}>
              <Text style={styles.title}>End call</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
      {/* <View style={styles.disclaimerContainer}>
        <Text style={styles.smallTitle}>About puffin</Text>
        <Text>
          Puffin is an AI tool that asks you questions and helps navigate the
          conversation.
        </Text>
        <Text>
          Diving deeper, interrupting when necessary, or just asking questions.
        </Text>
        <Text>
          Puffin is here to help you grow closer to your partner. Our goal is to
          get you to leave this app as soon as possible.
        </Text>
      </View> */}
    </View>
  );
}
