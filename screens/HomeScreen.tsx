import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  AppState,
} from "react-native";
import { Session } from "@supabase/supabase-js";

import React, { useEffect, useState } from "react";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { StackedLogo } from "../components/StackedLogo";
import styled from "styled-components/native";

const ContainerView = styled.View`
  flex: 1;
  align-items: center;
  justify-content: space-between;
  padding: 0px;
  padding-top: 60px;
  background-color: #faf3ea;
`;

type BentoItemProps = {
  title: string;
  description: string;
  bottomLeft: string;
  bottomRight: string;
  onPress: () => void;
};

const BentoItem = ({
  title,
  description,
  bottomLeft,
  bottomRight,
  onPress,
}: BentoItemProps) => {
  return (
    <TouchableOpacity style={styles.bentoBox} onPress={onPress}>
      <View>
        <Text style={styles.bentoBoxTitle}>{title}</Text>
        <Text style={styles.bentoBoxDescription}>{description}</Text>
      </View>
      <View
        style={{
          alignItems: "flex-start",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Text style={styles.bentoBoxDescription}>{bottomLeft}</Text>
        <Text style={styles.bentoBoxDescription}>{bottomRight}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default function HomeScreen({}) {
  const navigation = useNavigation();
  let [fontsLoaded] = useFonts({
    "Inter-Black": require("../assets/fonts/Inter-Black.otf"),
  });

  if (!fontsLoaded) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View>
      <ScrollView style={styles.container}>
        <BentoItem
          title='36 questions to fall in love'
          description='Loved by 10000+ couples'
          bottomLeft={"Est. 3 hours"}
          bottomRight={"Not started"}
          onPress={() =>
            navigation.navigate("36Questions", { headerTitle: "36 questions" })
          }
        />
        <BentoItem
          title='Discussing sex & intimacy'
          description='Loved by 100+ couples'
          bottomLeft={"Est. 3 hours"}
          bottomRight={"Not started"}
          onPress={() =>
            navigation.navigate("Sex & Intimacy", { headerTitle: "Date 3" })
          }
        />
        <BentoItem
          title='Finances & Money'
          description='Loved by 1000 couples'
          bottomLeft={"Est. 3 hours"}
          bottomRight={"Not started"}
          onPress={() =>
            navigation.navigate("Finances & Money", { headerTitle: "Date 3" })
          }
        />
        <BentoItem
          title='Bring your own'
          description='Loved by 1000+ couples'
          bottomLeft={"Est. 30 min"}
          bottomRight={"Not started"}
          onPress={() =>
            navigation.navigate("Bring your own", {
              headerTitle: "Bring your own",
            })
          }
        />
        <StackedLogo />
      </ScrollView>
      <StatusBar style='auto' />
    </View>
  );
}

const styles = StyleSheet.create({
  bentoBox: {
    justifyContent: "space-between",
    padding: 16,
    margin: 10,
    height: 140,
    borderRadius: 10,
    borderWidth: 0.2,
    borderColor: "#0a3924",
    shadowColor: "#000",
  },
  bentoBoxTitle: {
    fontSize: 20,
    color: "#0a3924",
    fontFamily: "Inter-Black",
  },
  bentoBoxDescription: {
    fontSize: 12,
    color: "#0a3924",
  },
  title: {
    fontSize: 20,
    fontFamily: "Inter-Black",
  },
  container: {
    paddingTop: 80,
    backgroundColor: "#faf3ea",
    height: "100%",
  },
});
