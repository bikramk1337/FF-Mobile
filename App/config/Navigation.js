import React, { createContext, useContext, useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as Linking from "expo-linking";
import Home from "../screens/Home";
import Options from "../screens/Options";
import Login from "../screens/Login";
import SignUp from "../screens/SignUp";
import CaptureImage from "../screens/CaptureImage";
import ForgetPassword from "../screens/ForgetPassword";
import MyFauna from "../screens/MyFauna/MyFauna";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Explore from "../screens/Explore/Explore";
import {
  Animated,
  Text,
  View,
  TouchableOpacity,
  Easing,
  Modal,
  StyleSheet,
  ImageBackground,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import {
  Button,
  Divider,
  Icon,
  IconButton,
  Menu,
  PaperProvider,
} from "react-native-paper";
import colors from "../constants/colors";
import { MaterialIcons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import { CustomButton } from "../components/CustomButton";
import * as ImagePicker from "expo-image-picker";
import FaunaDetailModal from "../components/FaunaDetailsModal/FaunaDetailsModal";
import UserAvatar from "react-native-user-avatar";
import {
  getAllClassificationHistory,
  getAllFauna,
  getCurrentUser,
  getFaunaByLabel,
  uploadAndPredict,
} from "../helper/axios";
import {
  AuthContext,
  ClassifierContext,
  CurrentUserContext,
  FaunaContext,
} from "../contexts/AppContext";

const MainBottomTab = createBottomTabNavigator();
const AuthStack = createStackNavigator();

// Get the full screen width and height
const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const prefix = Linking.createURL("/");
const linking = {
  prefixes: [prefix, "https://192.168.1.181:8081"],
  config: {
    screens: {
      ForgetPassword: "reset-password",
    },
  },
};

const CameraComponent = () => {
  return null;
};

const AuthStackScreen = () => (
  <AuthStack.Navigator initialRouteName="Login">
    <AuthStack.Screen
      name="Home"
      component={Home}
      options={{ headerShown: false }}
    />
    <AuthStack.Screen name="Options" component={Options} />
    <AuthStack.Screen
      name="Login"
      component={Login}
      options={{ headerShown: false }}
    />
    <AuthStack.Screen
      name="SignUp"
      options={{
        headerMode: "float",
        headerTitle: "Register",
        headerBackgroundContainerStyle: { backgroundColor: colors.primary },
      }}
      component={SignUp}
    />
    <AuthStack.Screen name="ForgetPassword" component={ForgetPassword} />
  </AuthStack.Navigator>
);

const MainStackScreen = () => {
  const [image, setImage] = useState(null);
  const [fauna, setFauna] = useState({});

  const [isButtonsVisible, setIsButtonsVisible] = useState(false);
  const [animation] = useState(new Animated.Value(0));

  const [showUserMenu, setShowUserMenu] = useState(false);

  const [showDetectionModal, setShowDetectionModal] = useState(false);
  const [showDetectingModal, setShowDetectingModal] = useState(false);

  const [currentUser, setCurrentUser] = useContext(CurrentUserContext);
  const [classificationHistory, setClassificationHistory] =
    useContext(ClassifierContext);
  const [token, setToken] = useContext(AuthContext);

  useEffect(() => {
    fetchInitialData();
  }, [token]);

  const fetchInitialData = async () => {
    const accessToken = await SecureStore.getItemAsync("accessToken");
    if (token && accessToken) {
      fetchCurrentUser();
      fetchClassificationHistory();
    }
  };

  const fetchClassificationHistory = async () => {
    try {
      const response = await getAllClassificationHistory();
      if (response.status === 200 && response.data?.data?.length > 0) {
        setClassificationHistory(response.data?.data);
      } else {
        setClassificationHistory([]);
      }
    } catch (error) {
      setClassificationHistory([]);
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const response = await getCurrentUser();
      if (response.status === 200 && response.data) {
        setCurrentUser(response.data);
      } else {
        setCurrentUser({});
        setToken("");
        await SecureStore.setItemAsync("accessToken", "");
      }
    } catch (error) {
      alert("Error: " + error.message);
      setCurrentUser({});
      setToken("");
      await SecureStore.setItemAsync("accessToken", "");
    }
  };

  const fetchClassificationFromLabel = async (classification_history) => {
    try {
      const response = await getFaunaByLabel(classification_history.prediction);
      if (response.status === 200) {
        setFauna(response.data);
        setShowDetectingModal(false);
        setShowDetectionModal(true);
        setClassificationHistory([
          ...classificationHistory,
          classification_history,
        ]);
      } else {
        setFauna({});
        setShowDetectingModal(false);
        console.error("getFaunaByLabel error", response);
        const message =
          response.message || "An error occurred. Please try again.";
        alert(message);
      }
    } catch (error) {
      setFauna({});
      console.error("getFaunaByLabel error", error);
      setShowDetectingModal(false);
      const errorMessage =
        error.response?.data?.detail || "An error occurred. Please try again.";
      alert(errorMessage);
    }
  };

  const detectImage = async (image) => {
    try {
      const response = await uploadAndPredict(image);

      if (response.status === 200) {
        fetchClassificationFromLabel(response.data?.classification_history);
      } else {
        setShowDetectingModal(false);
        const message =
          response.message || "An error occurred. Please try again.";
        alert(message);
      }
    } catch (error) {
      console.error("uploadAndPredict error", error);
      setShowDetectingModal(false);
      const errorMessage =
        error.response?.data?.detail || "An error occurred. Please try again.";
      alert(errorMessage);
    }
  };

  const toggleButtons = () => {
    setIsButtonsVisible(!isButtonsVisible);
    Animated.timing(animation, {
      toValue: isButtonsVisible ? 0 : 1,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  };

  const hideButtons = () => {
    if (isButtonsVisible) {
      setIsButtonsVisible(false);
      Animated.timing(animation, {
        toValue: 0,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start();
    }
  };

  const opacityInterpolate = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const translateYInterpolate = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [100, 0],
  });

  const animatedStyle = {
    opacity: opacityInterpolate,
    transform: [{ translateY: translateYInterpolate }],
  };

  const pickImage = async () => {
    hideButtons();
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }

    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setImage(result.assets[0]);
        setShowDetectingModal(true);
        detectImage(result.assets[0]);
      }
    } catch (e) {
      console.error(e);
      alert("An error occurred while picking the image.");
    }
  };
  const captureImage = async () => {
    hideButtons();
    const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
    if (cameraStatus.status !== "granted") {
      alert("Sorry, we need camera permissions to make this work!");
      return;
    }

    const libraryStatus =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (libraryStatus.status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }

    try {
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled) {
        setImage(result.assets[0]);
        setShowDetectingModal(true);
        detectImage(result.assets[0]);
      }
    } catch (e) {
      console.error(e);
      alert("An error occurred while capturing the image.");
    }
  };

  const CameraSelectButtons = () => {
    return (
      <>
        <View
          style={{
            top: -20,
            width: 80,
            height: 80,
            // backgroundColor: "#fff",
            backgroundColor: colors.primary,
            // padding: 4,
            borderRadius: 40,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            elevation: 4,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 4,
            },
            shadowOpacity: 0.3,
            shadowRadius: 4,
          }}
        >
          <IconButton
            style={{
              backgroundColor: colors.purple,
            }}
            iconColor="#fff"
            size={40}
            icon={"camera"}
            onPress={toggleButtons}
          />
        </View>

        {isButtonsVisible && <AnimatedTabs />}

        {showDetectingModal && (
          <Modal
            animationType="fade"
            transparent={true}
            visible={showDetectingModal}
            onRequestClose={() => {
              setShowDetectingModal(false);
              setFauna({});
              setImage(null);
            }}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 14,
              }}
            >
              <View
                style={{
                  backgroundColor: "white",
                  borderRadius: 14,
                  padding: 14,
                  alignItems: "center",
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 4,
                  elevation: 5,
                }}
              >
                <ImageBackground
                  source={{ uri: image?.uri }}
                  resizeMode="cover"
                  style={{
                    width: screenWidth * 0.8,
                    height: screenWidth * 0.8,
                    justifyContent: "center",
                    // backgroundColor: "#0000007b",
                    borderRadius: 14,
                  }}
                  imageStyle={{ borderRadius: 14 }}
                >
                  <View
                    style={{
                      color: "white",
                      fontSize: 42,
                      lineHeight: 84,
                      height: "100%",
                      fontWeight: "bold",
                      textAlign: "center",
                      backgroundColor: "#0000007b",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 14,
                    }}
                  >
                    <ActivityIndicator
                      size="large"
                      style={{
                        flex: 1,
                        // paddingTop: 50,
                      }}
                    />

                    <IconButton
                      iconColor="#000"
                      size={30}
                      icon={"close"}
                      style={{
                        position: "absolute",
                        top: 10,
                        right: 10,
                        backgroundColor: "#ffffff9c",
                      }}
                      onPress={() => {
                        setShowDetectingModal(false);
                        setFauna({});
                        setImage(null);
                      }}
                    />
                  </View>
                </ImageBackground>
              </View>
            </View>
          </Modal>
        )}

        {showDetectionModal && (
          <FaunaDetailModal
            modalVisible={showDetectionModal}
            setModalVisible={setShowDetectionModal}
            image={image.uri}
            fauna={fauna}
            showChat
          />
        )}
      </>
    );
  };

  const AnimatedTabs = () => (
    <Animated.View
      style={[
        {
          display: "flex",
          flex: 1,

          position: "absolute",
          bottom: 80,
          zIndex: 1000,
          width: "100%",
        },
        animatedStyle,
      ]}
    >
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "center",
          gap: 14,
        }}
      >
        <Button
          icon="image"
          mode="elevated"
          buttonColor="#fff"
          textColor={colors.primary}
          onPress={pickImage}
        >
          choose
        </Button>

        <Button
          icon="camera"
          mode="elevated"
          buttonColor={colors.primary}
          textColor="#fff"
          onPress={captureImage}
        >
          capture
        </Button>
      </View>
    </Animated.View>
  );

  return (
    <MainBottomTab.Navigator
      initialRouteName="myFauna"
      screenOptions={() => ({
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.darkGray,
        tabBarStyle: {
          position: "absolute",
          bottom: 20,
          left: 20,
          right: 20,
          borderRadius: 15,
          display: "flex",
          elevation: 4,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: 0.3,
          shadowRadius: 4,
        },
        headerShadowVisible: true,
      })}
    >
      <MainBottomTab.Screen
        name="myFauna"
        component={MyFauna}
        options={{
          tabBarLabel: "My Fauna",
          headerTitle: "My Fauna",
          headerLeft: () => (
            <PaperProvider>
              <Menu
                visible={showUserMenu}
                onDismiss={() => {
                  setShowUserMenu(false);
                }}
                style={{ width: 300 }}
                anchor={
                  <TouchableOpacity
                    onPress={() => {
                      setShowUserMenu(true);
                    }}
                    style={{ marginLeft: 16 }}
                  >
                    <UserAvatar
                      size={38}
                      name={
                        currentUser && currentUser.full_name
                          ? currentUser.full_name
                          : "A"
                      }
                      bgColors={["#ff5100", "#00d0ff", "#5900ff", "#ff00bf"]}
                    />
                  </TouchableOpacity>
                }
              >
                <Menu.Item
                  title={
                    currentUser && currentUser.full_name
                      ? currentUser.full_name
                      : "Anonymous"
                  }
                />
                {currentUser.email ? (
                  <Menu.Item title={currentUser.email} />
                ) : (
                  <></>
                )}

                <Divider />
                <Menu.Item
                  onPress={() => {
                    setShowUserMenu(false);
                    SecureStore.setItemAsync("accessToken", "");
                    setCurrentUser({});
                    setClassificationHistory([]);
                    setToken("");
                  }}
                  title="Logout"
                />
              </Menu>
            </PaperProvider>
          ),

          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="home" color={color} size={size} />
          ),
          tabBarIconStyle: {
            top: 10,
          },
          tabBarLabelStyle: {
            top: 8,
          },
        }}
      />
      <MainBottomTab.Screen
        name="Camera"
        component={CameraComponent}
        options={{
          tabBarButton: () => <CameraSelectButtons />,
        }}
      />
      <MainBottomTab.Screen
        name="explore"
        component={Explore}
        options={{
          headerTitle: "Explore the Wild",
          headerLeft: () => (
            <PaperProvider>
              <Menu
                visible={showUserMenu}
                onDismiss={() => {
                  setShowUserMenu(false);
                }}
                style={{ width: 300 }}
                anchor={
                  <TouchableOpacity
                    onPress={() => {
                      setShowUserMenu(true);
                    }}
                    style={{ marginLeft: 16 }}
                  >
                    <UserAvatar
                      size={38}
                      name={
                        currentUser && currentUser.full_name
                          ? currentUser.full_name
                          : "A"
                      }
                      bgColors={["#ff5100", "#00d0ff", "#5900ff", "#ff00bf"]}
                    />
                  </TouchableOpacity>
                }
              >
                <Menu.Item
                  title={
                    currentUser && currentUser.full_name
                      ? currentUser.full_name
                      : "Anonymous"
                  }
                />
                {currentUser.email ? (
                  <Menu.Item title={currentUser.email} />
                ) : (
                  <></>
                )}

                <Divider />
                <Menu.Item
                  onPress={() => {
                    setShowUserMenu(false);
                    SecureStore.setItemAsync("accessToken", "");
                    setCurrentUser({});
                    setClassificationHistory([]);
                    setToken("");
                  }}
                  title="Logout"
                />
              </Menu>
            </PaperProvider>
          ),

          tabBarLabel: "Explore",

          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="forest" color={color} size={size} />
          ),
          tabBarIconStyle: {
            top: 10,
          },
          tabBarLabelStyle: {
            top: 8,
          },
        }}
      />
    </MainBottomTab.Navigator>
  );
};

export default () => {
  const [token, setToken] = useState("");

  const [currentUser, setCurrentUser] = useState({});
  const [faunas, setFaunas] = useState([]);
  const [classificationHistory, setClassificationHistory] = useState([]);

  useEffect(() => {
    const getToken = async () => {
      const accessToken = await SecureStore.getItemAsync("accessToken");
      if (accessToken) {
        setToken(accessToken);
      } else {
        await SecureStore.setItemAsync("accessToken", "");
        setToken("");
      }
    };

    getToken();
  }, []);

  return (
    <AuthContext.Provider value={[token, setToken]}>
      <CurrentUserContext.Provider value={[currentUser, setCurrentUser]}>
        <FaunaContext.Provider value={[faunas, setFaunas]}>
          <ClassifierContext.Provider
            value={[classificationHistory, setClassificationHistory]}
          >
            <NavigationContainer linking={linking}>
              {token ? <MainStackScreen /> : <AuthStackScreen />}
            </NavigationContainer>
          </ClassifierContext.Provider>
        </FaunaContext.Provider>
      </CurrentUserContext.Provider>
    </AuthContext.Provider>
  );
};
