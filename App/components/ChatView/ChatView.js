import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import colors from "../../constants/colors";
import { aiChat } from "../../helper/axios";

const AIChatComponent = ({ fauna }) => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");

  const [responseMessage, setResponseMessage] = useState("");

  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (fauna) {
      const initialMessage = [
        {
          id: 1,
          text: "Hello there, I am your AI fauna guide. How can I help you today?",
          from: "bot",
        },
        {
          id: 2,
          text: `You have spotted a ${fauna.common_name}!`,
          from: "bot",
        },
      ];
      setMessages(initialMessage);
    }
  }, [fauna]);

  useEffect(() => {
    if (responseMessage) {
      const newMessage = {
        id: messages.length + 1,
        text: responseMessage,
        from: "bot",
      };
      setIsTyping(false);
      setMessages([...messages, newMessage]);
      setResponseMessage("");
    }
  }, [responseMessage]);

  const flatListRef = useRef(null);

  React.useLayoutEffect(() => {
    const timeout = setTimeout(() => {
      if (flatListRef.current && messages && messages.length > 0) {
        flatListRef.current.scrollToEnd({ animated: true });
      }
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, [messages]);

  const handleSend = () => {
    if (inputText.trim() === "") return;

    const newMessage = {
      id: messages.length + 1,
      text: inputText,
      from: "user",
    };

    setMessages([...messages, newMessage]);
    setInputText("");
    setIsTyping(true);

    fetchChatResponse(inputText);
  };

  const fetchChatResponse = async (inputText) => {
    try {
      const response = await aiChat({
        faunaDescription: fauna.common_name,
        request: inputText,
      });
      if (response.status === 200 && response.data) {
        setResponseMessage(response.data.response);
      } else {
        setResponseMessage("Sorry, I cannot help you with that.");
      }
    } catch (error) {
      setResponseMessage("Sorry, I cannot help you with that.");
      console.error("chat bot error: ", error);
    }
  };

  const renderMessage = ({ item }) => (
    <View
      style={[
        styles.messageContainer,
        item.from === "user" ? styles.userMessage : styles.botMessage,
      ]}
    >
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      keyboardVerticalOffset={400}
      keyboardShouldPersistTaps="handled"
    >
      <FlatList
        style={{ paddingHorizontal: 14, marginTop: 14 }}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id.toString()}
        keyboardDismissMode="drag"
        keyboardShouldPersistTaps="handled"
        scrollToEnd={{ animated: true }}
        ref={flatListRef}
        ListFooterComponent={
          isTyping ? (
            <View style={[styles.messageContainer, styles.botMessage]}>
              <Text
                style={[
                  styles.messageText,
                  { fontStyle: "italic", fontSize: 12 },
                ]}
              >
                Typing...
              </Text>
            </View>
          ) : (
            <></>
          )
        }
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder={isTyping ? "Please wait..." : "Type your message..."}
          value={inputText}
          onChangeText={setInputText}
          placeholderTextColor={colors.darkGray}
        />
        <Button title="Send" onPress={handleSend} disabled={isTyping} />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

    // backgroundColor: "#F5F5F5",
  },
  messageContainer: {
    borderRadius: 8,
    padding: 8,
    marginVertical: 4,
    maxWidth: "80%",
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: colors.accent,
  },
  botMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#E5E5EA",
  },
  messageText: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "#CCCCCC",
    backgroundColor: "#FFFFFF",
  },
  input: {
    flex: 1,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
    height: 46,
  },
});

export default AIChatComponent;
