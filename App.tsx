import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, TouchableOpacity, View, ScrollView } from "react-native";
import { useEffect } from "react";
import {
  NavigationContainer,
  useNavigation,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import QuestionsScreen from "./36Questions";  
import { useFonts } from "expo-font";




const Stack = createNativeStackNavigator();

const BentoItem = ({ title, description, bottomLeft, bottomRight }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.bentoBox}
      onPress={() =>
        navigation.navigate("36Questions", { headerTitle: "36 questions" })
      }
    >
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

function HomeScreen({ navigation }) {
  const [fontsLoaded] = useFonts({
    "Inter-Black": require("./assets/fonts/Inter-Black.otf"),
  });

  return (
    <View style={styles.container}>
      <ScrollView>
        <BentoItem
          title='36 questions to fall in love'
          description='Loved by 10000+ couples'
          bottomLeft={"Est. 3 hours"}
          bottomRight={"Not started"}
        />
        <StackedLogo />
      </ScrollView>
      <StatusBar style='auto' />
    </View>
  );
}

function DetailsScreen({ route, navigation }) {
  const headerTitle = route.params?.headerTitle || "Default Title";

  return (
    <View style={styles.container}>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>{headerTitle}</Text>
      </View>
    </View>
  );
}

import { StackedLogo } from "./StackedLogo";

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name='Puffin'
          component={HomeScreen}
          options={{
            headerShown: true,
            headerStyle: { backgroundColor: "#fff" },
            headerTitleStyle: {
              fontFamily: "Inter-Black",
            },
          }}
        />
        <Stack.Screen name='Details' component={DetailsScreen} />
        <Stack.Screen name='36Questions' component={QuestionsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  bentoBox: {
    justifyContent: "space-between",
    padding: 16,
    margin: 10,
    height: 140,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#000",
  },
  bentoBoxTitle: {
    fontSize: 20,
    color: "#000",
    fontFamily: "Inter-Black",
  },
  bentoBoxDescription: {
    fontSize: 12,
    color: "#000",
  },
  title: {
    fontSize: 20,
    fontFamily: "Inter-Black",
  },
});
