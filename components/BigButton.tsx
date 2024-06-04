import React from "react";
import { View, Text, Pressable } from "react-native";
import styled from "styled-components/native";

const BigButtonComponent = styled.View`
  margin-top: 20px;
  margin-bottom: 20px;
  font-size: 16px;
  border-radius: 100px;
  padding: 16px;
  background-color: ${({ disabled }) => (disabled ? "#cccccc" : "#1d824a")};
  border: 1px solid #0a3924;
  opacity: ${({ pressed, disabled }) => (pressed || disabled ? ".8" : "1")};
  width: 250px;
`;
const BigButtonText = styled.Text`
  font-size: 20px;
  text-align: center;
  font-weight: bold;
  color: #faf3ea;
`;

export default function BigButton({
  onPress,
  text,
  disabled,
}: {
  onPress: () => void;
  text: string;
  disabled?: boolean;
}) {
  return (
    <Pressable
      onPress={() => {
        if (disabled) return;
        onPress?.();
      }}
    >
      {({ pressed }) => (
        <BigButtonComponent disabled={disabled} pressed={pressed}>
          <BigButtonText>{text}</BigButtonText>
        </BigButtonComponent>
      )}
    </Pressable>
  );
}
