import React, { useContext, useState } from "react";
import {
  SafeAreaView,
  Text,
  Image,
  StyleSheet,
  View,
  TouchableOpacity,
} from "react-native";
import {
  Modal,
  Portal,
  Divider,
  Button,
  PaperProvider,
} from "react-native-paper";
import colors from "../constants/colors";
import { CustomButton } from "../components/CustomButton";
import { InputField } from "../components/InputField";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import emailValidation from "../hooks/emailValidation";
import CustomModal from "../components/CustomModal";
import { loginUser } from "../helper/axios";
import { MaterialIcons, Feather } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import Toast from "react-native-root-toast";
import Logo from "../components/Logo/Logo";
import { AuthContext } from "../contexts/AppContext";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.purple,
  },
  textContent: {
    color: colors.textAndIcons,
  },
  loginButton: {
    backgroundColor: colors.primary,
    color: colors.white,
    padding: 10,
    fontSize: 30,
    marginBottom: 20,
  },
  containerStyle: {
    backgroundColor: colors.purple,
    padding: 20,
    margin: 20,
    backgroundColor: colors.background,
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: { marginBottom: 15, textAlign: "center" },
});

export default ({ navigation }) => {
  const { email, emailVerified, password, handleEmail, handlePassword } =
    emailValidation();
  const [visible, setVisible] = useState(false);

  const [token, setToken] = useContext(AuthContext);

  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async (e) => {
    setIsLoggingIn(true);
    if (!emailVerified) {
      alert("please verify your email");
      setIsLoggingIn(false);
      return;
    }
    const formData = new URLSearchParams();
    formData.append("username", email);
    formData.append("password", password);

    try {
      const response = await loginUser(formData);
      if (response.status === 200 && response.data.access_token) {
        SecureStore.setItemAsync(
          "accessToken",
          response.data.access_token
        ).then(() => {
          setToken(response.data.access_token);
        });
      } else {
        setToken("");
        alert(response.message);
      }
    } catch (error) {
      setToken("");
      console.error("Login error:", error);
      alert("Error during request setup: " + error.message);
    }
    setIsLoggingIn(false);
  };

  const handleForgetPassword = () => {
    setVisible(true);
  };

  const hideModal = () => setVisible(false);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView
        resetScrollToCoords={{ x: 0, y: 0 }}
        contentContainerStyle={{ flexGrow: 1 }}
        scrollEnabled={true}
        keyboardShouldPersistTaps="handled"
      >
        <PaperProvider>
          <Portal>
            <Modal
              animationType="slide"
              visible={visible}
              onDismiss={hideModal}
              contentContainerStyle={styles.containerStyle}
            >
              <CustomModal />
            </Modal>
          </Portal>

          <>
            <View
              style={{
                display: "flex",
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                gap: 20,
              }}
            >
              {/* <Image
                source={require("../assets/images/loginSVG.png")}
                style={{
                  height: "100%",
                  width: "100%",
                  transform: [{ rotate: "-30deg" }],
                }}
              /> */}
              <Logo width={100} height={100} />
              <Text
                style={{ fontSize: 30, fontWeight: "700", color: colors.white }}
              >
                Fauna Finder
              </Text>
            </View>

            <View style={{ flex: 1, padding: 14 }}>
              <InputField
                label={"Enter email address"}
                icon={
                  <MaterialIcons
                    name="alternate-email"
                    size={20}
                    color={colors.textAndIcons}
                    style={{ marginHorizontal: 15 }}
                  />
                }
                keyboardType="email-address"
                onChangeText={(e) => handleEmail(e)}
                textContentType="emailAddress"
                condition={
                  email.length < 1 ? null : emailVerified ? (
                    <Feather name="check-circle" color="green" size={20} />
                  ) : (
                    <MaterialIcons name="error" color="red" size={20} />
                  )
                }
                style={{ borderColor: colors.white }}
              ></InputField>
              <InputField
                label={"Enter password"}
                icon={
                  <MaterialIcons
                    name="lock"
                    size={20}
                    color={colors.textAndIcons}
                    style={{ marginHorizontal: 15 }}
                  />
                }
                inputType="password"
                onChangeText={(e) => handlePassword(e)}
                keyboardType={"numeric"}
                secureTextEntry={true}
                maxLength={4}
                condition={
                  <TouchableOpacity onPress={() => handleForgetPassword()}>
                    <Text style={{ color: colors.purple, fontWeight: "700" }}>
                      Forgot password?
                    </Text>
                  </TouchableOpacity>
                }
                style={{ borderColor: colors.white }}
              ></InputField>
              <CustomButton
                label={isLoggingIn ? "Logging in..." : "Login"}
                onPress={(e) => handleLogin(e)}
                icon={"login"}
                style={{
                  backgroundColor: colors.purple,
                  borderWidth: 1,
                  borderColor: colors.white,
                  width: "100%",
                  margin: 0,
                  padding: 0,
                }}
                disabled={isLoggingIn}
              />
            </View>
            <Divider />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                marginVertical: 30,
              }}
            >
              <Text> New to the app?</Text>
              <TouchableOpacity onPress={() => navigation.push("SignUp")}>
                <Text style={{ color: colors.white, fontWeight: "700" }}>
                  {" "}
                  Register
                </Text>
              </TouchableOpacity>
            </View>
          </>
        </PaperProvider>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};
