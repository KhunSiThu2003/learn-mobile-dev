import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';

import { askAI } from '@/services/openrouter';

type Message = {
  id: string;
  role: 'user' | 'ai';
  text: string;
};

export default function HomeScreen() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'ai',
      text: 'Hi 👋 I am your AI assistant. Ask me anything!',
    },
  ]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
    };

    setMessages(prev => [...prev, userMsg]);

    const question = input;
    setInput('');
    setLoading(true);

    try {
      const reply = await askAI(question);

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        text: reply,
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (e) {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'ai',
          text: 'Something went wrong ❌',
        },
      ]);
    }

    setLoading(false);
  };

  const renderItem = ({ item }: { item: Message }) => {
    const isUser = item.role === 'user';

    return (
      <View
        style={[
          styles.bubble,
          isUser ? styles.userBubble : styles.aiBubble,
        ]}
      >
        <Text style={isUser ? styles.userText : styles.aiText}>
          {item.text}
        </Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Header */}
      <Text style={styles.header}>🤖 OpenRouter Chat</Text>

      {/* Chat List */}
      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.chatContainer}
      />

      {/* Typing Indicator */}
      {loading && (
        <View style={styles.loading}>
          <ActivityIndicator />
          <Text style={{ marginLeft: 10 }}>AI is typing...</Text>
        </View>
      )}

      {/* Input Box */}
      <View style={styles.inputContainer}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Type message..."
          style={styles.input}
          placeholderTextColor="#888"
        />

        <TouchableOpacity
          onPress={sendMessage}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f',
  },

  header: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 60,
    marginBottom: 10,
  },

  chatContainer: {
    padding: 12,
  },

  bubble: {
    padding: 12,
    borderRadius: 16,
    marginVertical: 5,
    maxWidth: '80%',
  },

  userBubble: {
    backgroundColor: '#2563eb',
    alignSelf: 'flex-end',
  },

  aiBubble: {
    backgroundColor: '#222',
    alignSelf: 'flex-start',
  },

  userText: {
    color: '#fff',
  },

  aiText: {
    color: '#fff',
  },

  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },

  input: {
    flex: 1,
    backgroundColor: '#1e1e1e',
    color: '#fff',
    paddingHorizontal: 12,
    borderRadius: 10,
  },

  button: {
    marginLeft: 10,
    backgroundColor: '#2563eb',
    paddingHorizontal: 16,
    justifyContent: 'center',
    borderRadius: 10,
  },

  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  loading: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 12,
    paddingBottom: 6,
  },
});