import { View, Text, Dimensions, Modal, Pressable } from "react-native";
import React, { memo, useEffect, useState } from "react";
import colors from "../../constants/colors";
import UserAvatar from "react-native-user-avatar";
import FaunaDetailModal from "../FaunaDetailsModal/FaunaDetailsModal";
import { Ionicons } from "@expo/vector-icons";
import {
  getFaunaByLabel,
  getImageFromURL,
  getUserById,
} from "../../helper/axios";
import { Image } from "expo-image";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

const FaunaCard = memo(
  ({ showProfile, classification }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [image, setImage] = useState();
    const [fauna, setFauna] = useState({});
    const [user, setUser] = useState({});

    useEffect(() => {
      if (classification && classification.image_url) {
        fetchImageFromUrl();
      }
      if (classification && classification.prediction) {
        fetchClassificationFromLabel();
      }
      if (classification && classification.user_id && showProfile) {
        fetchUserById();
      }
    }, [classification]);

    const fetchImageFromUrl = async () => {
      getImageFromURL(classification.image_url)
        .then((response) => {
          setImage(response.request?.responseURL);
        })

        .catch((error) => {
          console.error(error);
        });
    };

    const fetchClassificationFromLabel = async () => {
      try {
        const response = await getFaunaByLabel(classification.prediction);
        if (response.status === 200) {
          setFauna(response.data);
        } else {
          console.error("getFaunaByLabel error", response);
          setFauna({});
        }
      } catch (error) {
        console.error("getFaunaByLabel error", error);
        setFauna({});
      }
    };

    const fetchUserById = async () => {
      try {
        const response = await getUserById(classification.user_id);
        if (response.status === 200) {
          setUser(response.data);
        } else {
          console.error("getUserById error", response);
          setUser({});
        }
      } catch (error) {
        console.error("getUserById error", error);
        setUser({});
      }
    };

    return (
      <View style={{ backgroundColor: colors.white }}>
        {showProfile && user?.full_name ? (
          <>
            <View
              style={{
                borderBottomWidth: 1,
                borderBottomColor: colors.lightGray,
              }}
            ></View>

            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 14,
                padding: 14,
                paddingBottom: 0,
              }}
            >
              <View style={{ width: 50, height: 50 }}>
                <UserAvatar
                  size={50}
                  name={user?.full_name || "A"}
                  bgColors={["#ff5100", "#00d0ff", "#5900ff", "#ff00bf"]}
                />
              </View>

              <View>
                <Text>{user?.full_name || "Anonymous"}</Text>
                <Text>2 days ago . Wollongong</Text>
              </View>
            </View>
          </>
        ) : (
          <View
            style={{
              borderBottomWidth: 1,
              borderBottomColor: colors.lightGray,
            }}
          ></View>
        )}
        <Pressable
          onPress={() => {
            setModalVisible(true);
          }}
          style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}
        >
          <View
            style={{
              backgroundColor: colors.lightGray,
              borderRadius: 14,
              margin: 14,
            }}
          >
            {image ? (
              <Image
                style={{
                  width: windowWidth - 28,
                  height: windowWidth - 28,
                  maxHeight: windowHeight - 300,
                  borderRadius: 14,
                  borderWidth: 1,
                  borderColor: colors.lightGray,
                }}
                source={image}
                contentFit="cover"
                placeholder={{ blurhash }}
              />
            ) : (
              <View
                style={{
                  width: windowWidth - 28,
                  height: windowWidth - 28,
                  maxHeight: windowHeight - 300,
                  borderRadius: 14,
                  borderWidth: 1,
                  borderColor: colors.lightGray,
                }}
              ></View>
            )}
          </View>
          {/* <View
          style={{ borderBottomWidth: 1, borderBottomColor: colors.lightGray }}
        ></View> */}
          <View style={{ paddingHorizontal: 14, paddingBottom: 14 }}>
            <Text
              style={{
                fontSize: 18,
                marginBottom: 8,
                fontWeight: "700",
                color: colors.textAndIcons,
              }}
            >
              {fauna?.common_name}
            </Text>
            <Text style={{ fontSize: 14, color: colors.textAndIcons }}>
              {fauna?.description}
            </Text>
          </View>
          <View
            style={{
              borderBottomWidth: 1,
              borderBottomColor: colors.lightGray,
            }}
          ></View>
        </Pressable>

        {modalVisible && (
          <FaunaDetailModal
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
            image={image}
            fauna={fauna}
            showChat
          />
        )}
      </View>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.classification.id === nextProps.classification.id &&
      prevProps.showProfile === nextProps.showProfile
    );
  }
);

export default FaunaCard;
