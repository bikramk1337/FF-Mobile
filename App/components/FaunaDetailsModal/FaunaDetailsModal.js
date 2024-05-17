import {
  Dimensions,
  FlatList,
  Image,
  Modal,
  ScrollView,
  Text,
  View,
} from "react-native";
import colors from "../../constants/colors";
import { StatusBar } from "expo-status-bar";
import { Button, Card, IconButton, SegmentedButtons } from "react-native-paper";
import React, { useEffect, useState } from "react";
import AIChatComponent from "../ChatView/ChatView";
import { Ionicons } from "@expo/vector-icons";
import { getImageFromURL } from "../../helper/axios";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const KeyValueContainer = ({ name, value }) => {
  return (
    <View
      style={{
        marginTop: 8,
        flexDirection: "row",
      }}
    >
      <View style={{ flex: 1 }}>
        <Text style={{ fontWeight: "bold" }}>{name}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text>{value}</Text>
      </View>
    </View>
  );
};

const DetectionResult = ({ fauna }) => {
  return (
    <ScrollView style={{ marginTop: 14 }}>
      <View
        style={{
          padding: 14,
          borderColor: colors.lightGray,
          borderRadius: 14,
          borderWidth: 1,
          margin: 14,
          backgroundColor: "#f8f8f8",
        }}
      >
        <Text
          style={{
            textAlign: "center",
            fontSize: 18,
            fontWeight: "bold",
            marginBottom: 14,
          }}
        >
          {fauna?.common_name}
        </Text>
        <Text
          style={{
            textAlign: "center",

            marginBottom: 14,
          }}
        >
          {fauna?.description}
        </Text>
        {fauna?.other_names && (
          <Text
            style={{
              textAlign: "center",
              // fontSize: 18,
              // marginBottom: 14,
            }}
          >
            Also known as {fauna?.other_names}.
          </Text>
        )}

        <View
          style={{
            borderBottomWidth: 1,
            borderBottomColor: colors.lightGray,
            marginVertical: 14,
            marginHorizontal: -14,
          }}
        ></View>
        <KeyValueContainer
          name="Scientific name"
          value={fauna?.scientific_name || ""}
        />
        <KeyValueContainer name="Family" value={fauna?.family || ""} />
        <KeyValueContainer name="Class" value={fauna?.class_name || ""} />
        <KeyValueContainer name="Order" value={fauna?.order || ""} />
        <View
          style={{
            borderBottomWidth: 1,
            borderBottomColor: colors.lightGray,
            marginVertical: 14,
            marginHorizontal: -14,
          }}
        ></View>
        <KeyValueContainer name="Habitat" value={fauna?.habitat || ""} />
        <KeyValueContainer
          name="Geographic range"
          value={fauna?.geographic_range || ""}
        />
        <KeyValueContainer name="Diet" value={fauna?.diet || ""} />
        <KeyValueContainer name="Size" value={fauna?.size || ""} />
        <View
          style={{
            borderBottomWidth: 1,
            borderBottomColor: colors.lightGray,
            marginVertical: 14,
            marginHorizontal: -14,
          }}
        ></View>
        <Text
          style={{
            textAlign: "center",
            // fontSize: 18,
            marginBottom: 14,
            fontStyle: "italic",
          }}
        >
          {fauna?.other_info}.
        </Text>
      </View>
    </ScrollView>
  );
};

const RelatedImages = () => {
  const dummyImages = [
    { url: "https://via.placeholder.com/150" },
    { url: "https://via.placeholder.com/150" },
    { url: "https://via.placeholder.com/150" },
    { url: "https://via.placeholder.com/150" },
    { url: "https://via.placeholder.com/150" },
    // Add more dummy image URLs as needed
  ];
  const renderItem = ({ item }) => (
    <Image
      source={{ uri: item.url }}
      style={{
        width: `${100 / 3 - 2.5}%`, // Adjust image width based on the number of columns
        aspectRatio: 1, // Maintain aspect ratio for square images
        margin: 5,
        borderRadius: 8,
      }}
    />
  );

  return (
    <FlatList
      data={dummyImages}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
      numColumns={3} // Adjust the number of columns as needed
      // columnWrapperStyle={{ gap: 5 }}
    />
  );
};

const Chat = ({ fauna }) => {
  return (
    // <View >
    <AIChatComponent fauna={fauna} />
    // </View>
  );
};

const TabButtons = ({ value, setValue, showChat }) => {
  return (
    // <SafeAreaView
    //   style={{
    //     flex: 1,
    //     alignItems: "center",
    //   }}
    // >
    <SegmentedButtons
      value={value}
      onValueChange={setValue}
      style={{ paddingHorizontal: 14 }}
      buttons={
        showChat
          ? [
              {
                value: "result",
                label: "Result",
                style: {
                  borderColor: colors.primary,
                  // value === "result" ? colors.primary : colors.lightGray,
                  backgroundColor:
                    value === "result" ? colors.primary : colors.white,
                },
                checkedColor: colors.white,
                uncheckedColor: colors.primary,
              },
              {
                value: "related",
                label: "Images",
                style: {
                  borderColor: colors.primary,
                  // value === "related" ? colors.primary : colors.lightGray,
                  backgroundColor:
                    value === "related" ? colors.primary : colors.white,
                },
                checkedColor: colors.white,
                uncheckedColor: colors.primary,
              },
              {
                value: "chat",
                label: "Chat",
                style: {
                  borderColor: colors.primary,
                  // value === "chat" ? colors.primary : colors.lightGray,
                  backgroundColor:
                    value === "chat" ? colors.primary : colors.white,
                },
                checkedColor: colors.white,
                uncheckedColor: colors.primary,
              },
            ]
          : [
              {
                value: "result",
                label: "Result",
                style: {
                  borderColor: colors.primary,
                  // value === "result" ? colors.primary : colors.lightGray,
                  backgroundColor:
                    value === "result" ? colors.primary : colors.white,
                },
                checkedColor: colors.white,
                uncheckedColor: colors.primary,
              },
              {
                value: "related",
                label: "Images",
                style: {
                  borderColor: colors.primary,
                  // value === "related" ? colors.primary : colors.lightGray,
                  backgroundColor:
                    value === "related" ? colors.primary : colors.white,
                },
                checkedColor: colors.white,
                uncheckedColor: colors.primary,
              },
            ]
      }
    />
    // </SafeAreaView>
  );
};

const FaunaDetailModal = ({
  modalVisible,
  setModalVisible,
  showChat,
  fauna,
  image,
}) => {
  const [tab, setTab] = React.useState("result");

  return (
    <Modal
      animationType="slide"
      // presentationStyle="pageSheet"
      presentationStyle="overFullScreen"
      //   transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}
    >
      <StatusBar style="light" />

      <View
        style={{
          backgroundColor: colors.lightGray,
          width: "100%",
          // flex: 1,
          position: "relative",
        }}
      >
        {image ? (
          <Image
            style={{
              width: windowWidth,
              height: windowWidth,
              // maxHeight: windowHeight - 300,
            }}
            source={{
              uri: image,
            }}
          />
        ) : (
          <View
            style={{
              width: windowWidth,
              height: windowWidth,
              // maxHeight: windowHeight - 300,
            }}
          ></View>
        )}

        <View
          style={{
            height: 40,
            backgroundColor: "white",
            borderRadius: 20,
            // borderTopRightRadius: 20,
            // borderTopLeftRadius: 20,
            position: "absolute",
            bottom: -20,
            width: "100%",
            // left: 20,
            zIndex: 100,
            borderTopColor: colors.lightGray,
          }}
        ></View>
      </View>

      <IconButton
        // mode="outlined"
        theme={{
          colors: { primary: "black", outline: "black" },
        }}
        onPress={() => setModalVisible(!modalVisible)}
        style={{
          position: "absolute",
          top: 50,
          left: 20,

          backgroundColor: "white",
        }}
        icon={"arrow-left"}
      />

      <View style={{ marginBottom: 20, flex: 2 }}>
        <TabButtons value={tab} setValue={setTab} showChat={showChat} />

        {tab === "result" && <DetectionResult fauna={fauna} />}
        {tab === "related" && <RelatedImages />}
        {tab === "chat" && showChat && <Chat fauna={fauna} />}
      </View>
    </Modal>
  );
};

export default FaunaDetailModal;
