import React, { useState, useRef, useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Vapi from "@vapi-ai/react-native";
import { CreateAssistantDTO } from "@vapi-ai/react-native/dist/api";
import Daily from "@daily-co/react-native-daily-js";

const vapi = new Vapi(process.env.EXPO_PUBLIC_VAPI_PUBLIC_KEY || "");

const prompt = `
ROLE: 
You are a couple's therapist responsible for the long-term growth. You should use the Gottman series as a style to ask great questions. Your role is to yap as little as possible, asking direct questions. You should help the couple grow closer and go deeper. 

ACTIONS:
First ask the couple how they're doing, and to provide their names. Then say that you'll take turns asking questions. Each partner should take a turn answering the questions

QUESTIONS:
1 Think about all the times you have had sex. What are some of your
favorites? What about that time made it your favorite?
2 What turns you on?
3 How can you bring more passion to your relationship? 
4 <name 1> What's your favorite way to let <name 2> know you want to have sex?
5 Where and how do you like to be touched?
6 What's your favorite time to make love and why? What's your
favorite position?
7 Is there something sexually you've always wanted to try, but have
never asked? How often would you like to have sex?
8 <name 1> What can you do to make <name 2>'s sex life better?


SYSTEM INSTRUCTIONS:
When asking a question, call the function newQuestion with the question as a parameter.
`;

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
});

export default function Date3() {
  type CallStateOptions = "waiting" | "connecting" | "active" | "ended";
  const [callState, setCallState] = useState<CallStateOptions>("waiting");

  const assistantOptions: CreateAssistantDTO = {
    name: "Puffin: A couple's therapist",
    firstMessage: "Hi there!",
    numWordsToInterruptAssistant: 1,
    transcriber: {
      provider: "deepgram",
      model: "nova-2",
      language: "en-US",
    },
    voice: {
      provider: "azure",
      voiceId: "ryanNeural",
    },
    model: {
      functions: [
        {
          name: "botAskedQuestion",
          description:
            "When a new question is asked by the AI/bot this function should be called with the question it's asking",
          parameters: {
            type: "object",
            properties: {
              question: {
                type: "string",
                description: "The question which the bot just asked.",
              },
            },
          },
        },
      ],
      provider: "openai",
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: prompt,
        },
      ],
    },
  };

  const handleStart = async () => {
    const original_call = await vapi.start(assistantOptions || "");
    const call_id = original_call?.id;

    // Client would have to join the call in order to handle this flow correctly
    // const client = Daily.CallClient((event_handler = self));
    const call = Daily.createCallObject();

    setCallState("connecting");
  };

  function registerVapiMessages() {
    vapi.on("speech-start", () => {
      console.log("Speech has started");
    });

    vapi.on("speech-end", () => {
      console.log("Speech has ended");
    });

    vapi.on("call-start", () => {
      console.log("Call has started");
      setCallState("active");
    });

    vapi.on("call-end", () => {
      console.log("Call has stopped");
      setCallState("ended");
    });

    // Function calls and transcripts will be sent via messages
    vapi.on("message", (message) => {
      console.log(message);
    });

    vapi.on("error", (e) => {
      console.error(e);
    });
  }

  useEffect(() => {
    registerVapiMessages();
  }, []);

  const handleEnd = async () => {
    vapi.stop();
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
            <Text style={styles.title}>Sex & Intimacy</Text>
            <Text style={styles.title}>Find a romantic setting</Text>
            <Text style={styles.title}>Get comfortable</Text>
            <Text style={styles.title}>And turn on Puffin</Text>
            <TouchableOpacity
              style={styles.button}
              disabled={callState === "connecting"}
              onPress={handleStart}
            >
              <Text style={styles.title}>
                {callState === "waiting" ? "Get Started" : "Connecting"}
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleEnd}>
            <Text style={styles.title}>End call</Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.disclaimerContainer}>
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
      </View>
    </View>
  );
}
