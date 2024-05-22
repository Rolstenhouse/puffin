import React, { useState, useRef, useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Vapi from "@vapi-ai/react-native";
import { CreateAssistantDTO } from "@vapi-ai/react-native/dist/api";

const vapi = new Vapi(process.env.EXPO_PUBLIC_VAPI_PUBLIC_KEY || "");

const prompt = `
        You are a couple's therapist asking the 36 questions to love. Ask each partner for their name, then refer to them by name when asking each question. Ask the questions to each partner (so you should have two distinct responses). Wait for the first person to answer the question. Do not repeat yourself. When asking a new question, alternate which person you ask first? 

        When asking the question for a second time, you can simply ask "what about you, <NAME>" or "and you?". Repeating the question is not necessary, unless they specifically ask for it.

        Remember, as a therapist your job is simply to sit in the background and allow the couple to chat. Do not summarize what was said. No yapping.

        1. Given the choice of anyone in the world, whom would you want as a dinner guest?
        2. Would you like to be famous? In what way?
        3. Before making a telephone call, do you ever rehearse what you are going to say? Why?
        4. What would constitute a "perfect" day for you?
        5. When did you last sing to yourself? To someone else?
        6. If you were able to live to the age of 90 and retain either the mind or body of a 30-year-old for the last 60 years of your life, which would you want?
        7. Do you have a secret hunch about how you will die?
        8. Name three things you and your partner appear to have in common.
        9. For what in your life do you feel most grateful?
        10. If you could change anything about the way you were raised, what would it be?
        11. Take four minutes and tell your partner your life story in as much detail as possible.
        12. If you could wake up tomorrow having gained any one quality or ability, what would it be?
        13. If a crystal ball could tell you the truth about yourself, your life, the future, or anything else, what would you want to know?
        14. Is there something that you've dreamed of doing for a long time? Why haven't you done it?
        15. What is the greatest accomplishment of your life?
        16. What do you value most in a friendship?
        17. What is your most treasured memory?
        18. What is your most terrible memory?
        19. If you knew that in one year you would die suddenly, would you change anything about the way you are now living? Why?
        20. What does friendship mean to you?
        21. What roles do love and affection play in your life?
        22. Alternate sharing something you consider a positive characteristic of your partner. Share a total of five items.
        23. How close and warm is your family? Do you feel your childhood was happier than most other people's?
        24. How do you feel about your relationship with your mother?
        25. Make three true "we" statements each. For instance, "We are both in this room feeling..."
        26. Complete this sentence: "I wish I had someone with whom I could share..."
        27. If you were going to become a close friend with your partner, please share what would be important for him or her to know.
        28. Tell your partner what you like about them; be very honest this time, saying things that you might not say to someone you've just met.
        29. Share with your partner an embarrassing moment in your life.
        30. When did you last cry in front of another person? By yourself?
        31. Tell your partner something that you like about them already.
        32. What, if anything, is too serious to be joked about?
        33. If you were to die this evening with no opportunity to communicate with anyone, what would you most regret not having told someone? Why haven't you told them yet?
        34. Your house, containing everything you own, catches fire. After saving your loved ones and pets, you have time to safely make a final dash to save any one item. What would it be? Why?
        35. Of all the people in your family, whose death would you find most disturbing? Why?
        36. Share a personal problem and ask your partner's advice on how he or she might handle it. Also, ask your partner to reflect to you how you seem to be feeling about the problem you have chosen.

        SYSTEM ONLY: When you start asking a new question, call the function newQuestion with the question as a parameter.
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

export default function QuestionsScreen() {
  type CallStateOptions = "waiting" | "connecting" | "active" | "ended";
  const [callState, setCallState] = useState<CallStateOptions>("waiting");

  const assistantOptions: CreateAssistantDTO = {
    name: "YC Interview Executive Assistant",
    firstMessage: "Hi there!",
    numWordsToInterruptAssistant: 1,
    transcriber: {
      provider: "deepgram",
      model: "nova-2",
      language: "en-US",
    },
    voice: {
      provider: "playht",
      voiceId: "jennifer",
    },
    model: {
      functions: [
        {
          name: "newQuestion",
          description: "Used to show the question on the frontend",
          parameters: {
            type: "object",
            properties: {
              question: {
                type: "string",
                description:
                  "The question which is currently being asked.",
              },
            },
          },
        },
      ],
      provider: "openai",
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: prompt,
        },
      ],
    },
  };

  const handleStart = () => {
    vapi.start(assistantOptions || "");
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
            <Text style={styles.title}>Grab your partner</Text>
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
