import {
  View,
  Text,
  Modal,
  ScrollView,
  SafeAreaView,
  TouchableWithoutFeedback,
  FlatList,
  Image,
} from "react-native";
import React from "react";
import colors from "../../constants/colors";
import { Button, Card, SegmentedButtons } from "react-native-paper";
import AIChatComponent from "../ChatView/ChatView";
import { StatusBar } from "expo-status-bar";

const KeyValueContainer = ({ name, value }) => {
  return (
    <View
      style={{
        marginTop: 8,
        flexDirection: "row",
      }}
    >
      <View style={{ width: "50%" }}>
        <Text style={{ fontWeight: "bold" }}>{name}</Text>
      </View>
      <View>
        <Text>{value}</Text>
      </View>
    </View>
  );
};

const DetectionResult = () => {
  return (
    <ScrollView>
      <View
        style={{
          padding: 14,
          borderColor: colors.lightGray,
          borderRadius: 14,
          borderWidth: 1,
          margin: 14,
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
          Red Kangaroo
        </Text>
        <Text
          style={{
            textAlign: "center",

            marginBottom: 14,
          }}
        >
          The red kangaroo, also known as the giant red kangaroo, is the largest
          marsupial in the world.
        </Text>
        <Text
          style={{
            textAlign: "center",
            // fontSize: 18,
            marginBottom: 14,
          }}
        >
          Fun fact: Red kangaroos can jump up to 10 feet high.
        </Text>
        <View
          style={{
            borderBottomWidth: 1,
            borderBottomColor: colors.lightGray,
            margin: 8,
          }}
        ></View>
        <KeyValueContainer name="Scientific name" value="Macropus rufus" />
        <KeyValueContainer name="Family" value="Macropodidae" />
        <KeyValueContainer name="Class" value="Mammalia" />
        <KeyValueContainer name="Infraclass" value="Marsupialia" />
        <View
          style={{
            borderBottomWidth: 1,
            borderBottomColor: colors.lightGray,
            margin: 8,
          }}
        ></View>
        <KeyValueContainer name="Habitat" value="Grasslands" />
        <KeyValueContainer name="Geographic range" value="Australia" />
        <KeyValueContainer name="Diet" value="Herbivore" />
        <KeyValueContainer name="Lifespan" value="20 years" />
        <View
          style={{
            borderBottomWidth: 1,
            borderBottomColor: colors.lightGray,
            margin: 8,
          }}
        ></View>
        <KeyValueContainer name="Conservation status" value="Least Concern" />
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
        width: "30%", // Adjust image width based on the number of columns
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
      contentContainerStyle={{ padding: 5 }}
    />
  );
};

const Chat = () => {
  return (
    <View style={{ backgroundColor: "red", height: 500 }}>
      <AIChatComponent />
    </View>
  );
};

const TabButtons = ({ value, setValue }) => {
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
      style={{ paddingHorizontal: 14, marginTop: 14 }}
      buttons={[
        {
          value: "result",
          label: "Result",
          style: {
            borderColor: value === "result" ? colors.primary : colors.lightGray,
            backgroundColor: value === "result" ? colors.primary : colors.white,
          },
          checkedColor: colors.white,
        },
        {
          value: "related",
          label: "More",
          style: {
            borderColor:
              value === "related" ? colors.primary : colors.lightGray,
            backgroundColor:
              value === "related" ? colors.primary : colors.white,
          },
          checkedColor: colors.white,
        },
        {
          value: "chat",
          label: "Chat",
          style: {
            borderColor: value === "chat" ? colors.primary : colors.lightGray,
            backgroundColor: value === "chat" ? colors.primary : colors.white,
          },
          checkedColor: colors.white,
        },
      ]}
    />
    // </SafeAreaView>
  );
};

const DetectionModal = ({ modalVisible, setModalVisible, image }) => {
  const [tab, setTab] = React.useState("result");
  return (
    <Modal
      animationType="slide"
      // presentationStyle="pageSheet"
      presentationStyle="fullScreen"
      //   transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}
    >
      <StatusBar style="light" />
      <View style={{ marginBottom: 20 }}>
        <Card
          // mode="contained"
          // theme={{ colors: { surfaceVariant: colors.white } }}
          style={{ borderRadius: 0 }}
        >
          <Card.Cover
            source={{ uri: image }}
            style={{ width: "100%", borderRadius: 0 }}
          />
        </Card>
        <TabButtons value={tab} setValue={setTab} />

        {tab === "result" && <DetectionResult />}
        {tab === "related" && <RelatedImages />}
        {tab === "chat" && <Chat />}
      </View>
    </Modal>
  );
};

export default DetectionModal;
