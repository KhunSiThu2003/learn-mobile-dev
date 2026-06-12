import React, { useState } from "react";
import { View, Text, TextInput, Button, ScrollView } from "react-native";
import { sendMessageToGemini } from "./src/services/openrouter";

export default function App() {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);

  const sendMessage = async () => {
    const userMessage = text;

    setMessages([...messages, { role: "user", text: userMessage }]);
    setText("");

    const reply = await sendMessageToGemini(userMessage);

    setMessages((prev) => [
      ...prev,
      { role: "ai", text: reply },
    ]);
  };

  return (
    <View style={{ flex: 1, padding: 20, marginTop: 40 }}>
      <ScrollView style={{ flex: 1 }}>
        {messages.map((msg, i) => (
          <Text
            key={i}
            style={{
              marginVertical: 5,
              color: msg.role === "user" ? "blue" : "green",
            }}
          >
            {msg.role}: {msg.text}
          </Text>
        ))}
      </ScrollView>

      <TextInput
        value={text}
        onChangeText={setText}
        placeholder="Type message..."
        style={{
          borderWidth: 1,
          padding: 10,
          marginBottom: 10,
        }}
      />

      <Button title="Send" onPress={sendMessage} />
    </View>
  );
}