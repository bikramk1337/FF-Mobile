import React, { useState } from "react";
import {
  SafeAreaView,
  Text,
  Image,
  StyleSheet,
  View,
  TouchableOpacity,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import colors from "../constants/colors";
import { MaterialIcons, Feather } from "@expo/vector-icons";
import { InputField } from "../components/InputField";
import { CustomButton } from "../components/CustomButton";
import useEmailValidation from "../hooks/emailValidation";
import { registerNewUser } from "../helper/axios";
import { Modal, Portal, Divider, PaperProvider } from "react-native-paper";
import CodeVerification from "../components/CodeVerification";
import Toast from "react-native-root-toast";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  textContent: {
    color: colors.textAndIcons,
  },
  containerStyle: {
    backgroundColor: colors.background,
    padding: 20,
    margin: 20,
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
  const {
    email,
    emailVerified,
    showPassword,
    password,
    confirmPassword,
    handleEmail,
    setShowPassword,
    handlePassword,
    handleConfirmPassword,
  } = useEmailValidation();
  const [name, setName] = useState("");
  const [nameVerify, setNameVerify] = useState(false);
  const [visible, setVisible] = useState(false);

  const handleName = (nameVar) => {
    setName(nameVar);
    setNameVerify(false);
    if (nameVar.length > 1) {
      setNameVerify(true);
    }
  };

  const handleSubmit = async () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    if (!emailVerified) {
      alert("Please verify your email");
      return;
    }
    if (!nameVerify) {
      alert("Please verify your name");
      return;
    }
    const formData = {
      full_name: name,
      email,
      password,
    };

    try {
      const response = await registerNewUser(formData);

      if (response.status === 200) {
        alert(response.data.message);
        Toast.show(response.data.message, {
          duration: Toast.durations.LONG,
          position: Toast.positions.CENTER,
          shadow: true,
        });
        setVisible(true);
      } else {
        alert(response.message);
        Toast.show(response.message, {
          duration: Toast.durations.LONG,
          position: Toast.positions.CENTER,
          shadow: true,
          animation: true,
        });
      }
    } catch (error) {
      Toast.show(error.message, {
        duration: Toast.durations.LONG,
        position: Toast.positions.CENTER,
        shadow: true,
        animation: true,
      });
      alert("Error during request setup: " + error.message);
    }
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
              <CodeVerification />
            </Modal>
          </Portal>

          <View
            style={{
              display: "flex",
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              gap: 20,
            }}
          >
            <Text
              style={{ fontSize: 30, fontWeight: "700", color: colors.primary }}
            >
              Fauna Finder
            </Text>
          </View>

          <View style={{ flex: 1, padding: 14 }}>
            <InputField
              label={"name"}
              icon={
                <MaterialIcons
                  name="person-outline"
                  size={20}
                  color={colors.textAndIcons}
                  style={{ marginHorizontal: 15 }}
                />
              }
              onChangeText={(e) => handleName(e)}
              condition={
                name.length < 1 ? null : nameVerify ? (
                  <Feather name="check-circle" color="green" size={20} />
                ) : (
                  <MaterialIcons name="error" color="red" size={20} />
                )
              }
              style={{
                backgroundColor: "#6f6fff14",
                borderColor: colors.primary,
                borderWidth: 1,
              }}
            ></InputField>

            <InputField
              label={"email"}
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
              textContentType={"emailAddress"}
              condition={
                email.length < 1 ? null : emailVerified ? (
                  <Feather name="check-circle" color="green" size={20} />
                ) : (
                  <MaterialIcons name="error" color="red" size={20} />
                )
              }
              style={{
                backgroundColor: "#6f6fff14",
                borderColor: colors.primary,
                borderWidth: 1,
              }}
            ></InputField>

            <InputField
              label={"password"}
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
              secureTextEntry={showPassword}
              keyboardType={"numeric"}
              maxLength={4}
              condition={
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                >
                  {password.length < 1 ? null : showPassword ? (
                    <Feather name="eye-off" color="green" size={20} />
                  ) : (
                    <Feather name="eye" color="green" size={20} />
                  )}
                </TouchableOpacity>
              }
              style={{
                backgroundColor: "#6f6fff14",
                borderColor: colors.primary,
                borderWidth: 1,
              }}
            />

            <InputField
              label={"Confirm password"}
              icon={
                <MaterialIcons
                  name="lock"
                  size={20}
                  color={colors.textAndIcons}
                  style={{ marginHorizontal: 15 }}
                />
              }
              inputType="password"
              secureTextEntry={showPassword}
              onChangeText={(e) => handleConfirmPassword(e)}
              keyboardType={"numeric"}
              maxLength={4}
              condition={
                confirmPassword.length < 1 ? null : password ===
                  confirmPassword ? (
                  <Feather name="check-circle" color="green" size={20} />
                ) : (
                  <MaterialIcons name="error" color="red" size={20} />
                )
              }
              style={{
                backgroundColor: "#6f6fff14",
                borderColor: colors.primary,
                borderWidth: 1,
              }}
            ></InputField>
            <CustomButton
              icon={"account-plus-outline"}
              label={"Register"}
              onPress={handleSubmit}
              style={{
                width: "100%",
                margin: 0,
                padding: 0,
              }}
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
            <Text> Already registered?</Text>
            <TouchableOpacity onPress={() => navigation.push("Login")}>
              <Text style={{ color: colors.primary, fontWeight: "700" }}>
                {" "}
                Login
              </Text>
            </TouchableOpacity>
          </View>
        </PaperProvider>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};
