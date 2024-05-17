import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  Dimensions,
  Modal,
  ImageBackground,
  Pressable,
  ActivityIndicator,
  FlatList,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import FaunaCard from "../../components/FaunaCard/FaunaCard";
import { Button, Card, IconButton } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import colors from "../../constants/colors";
import DetectionModal from "../../components/DetectionModal/DetectionModal";
import FaunaDetailModal from "../../components/FaunaDetailsModal/FaunaDetailsModal";
import { uploadAndPredict } from "../../helper/axios";
import {
  ClassifierContext,
  CurrentUserContext,
  FaunaContext,
} from "../../contexts/AppContext";

const MyFauna = () => {
  const [showDetectionModal, setShowDetectionModal] = useState(false);

  const [classificationHistory, setClassificationHistory] =
    useContext(ClassifierContext);

  const [currentUser, setCurrentUser] = useContext(CurrentUserContext);

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      {classificationHistory && (
        <FlatList
          style={{ flex: 1 }}
          data={classificationHistory.filter(
            (item) => item.user_id === currentUser.id
          )}
          renderItem={({ item }) => <FaunaCard classification={item} />}
          ItemSeparatorComponent={<View style={{ height: 14 }}></View>}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={() => (
            <View
              style={{
                display: "flex",
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                padding: 40,
              }}
            >
              <Text
                style={{
                  color: colors.textAndIcons,
                  textAlign: "center",
                  fontSize: 16,
                }}
              >
                You do not have faunas in your collection yet. Time for an
                adventure!
              </Text>
            </View>
          )}
          ListFooterComponent={<View style={{ height: 100 }}></View>}
        />
      )}

      {showDetectionModal && (
        <FaunaDetailModal
          modalVisible={showDetectionModal}
          setModalVisible={setShowDetectionModal}
          image={image}
          showChat
        />
      )}
    </SafeAreaView>
  );
};

export default MyFauna;
