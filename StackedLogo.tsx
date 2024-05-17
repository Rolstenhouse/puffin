import { StyleSheet, View, Text, Image } from "react-native";

export const StackedLogo = () => {
  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        paddingTop: 20,
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
