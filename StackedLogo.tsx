import { useFonts } from "expo-font";
import { StyleSheet, View, Text, Image } from "react-native";

export const StackedLogo = () => {
  let [fontsLoaded] = useFonts({
    "Inter-Black": require("./assets/fonts/Inter-Black.otf"),
  });
  if (!fontsLoaded) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
        gap: 4,
      }}
    >
      <Image
        source={require("./assets/puffin_kiss.png")}
        style={{ width: 32, height: 20 }}
      />
      <Text style={styles.title}>Puffin</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontFamily: "Inter-Black",
  },
});
