import React, { useState } from 'react'
import { SafeAreaView, Text, Image, StyleSheet, View, TextInput, TouchableOpacity } from 'react-native'
import { Modal, Portal, Divider, Button, PaperProvider } from 'react-native-paper';
import colors from '../constants/colors';
import { CustomButton } from '../components/CustomButton';
import { InputField } from '../components/InputField';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import axios from 'axios'
import emailValidation from '../hooks/emailValidation';
import CustomModal from '../components/CustomModal';
import { loginUser } from '../helper/axios';
import { MaterialIcons, Feather } from '@expo/vector-icons';



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,


    },
    textContent: {
        color: colors.textAndIcons,
        // marginBottom: 13

    },
    loginButton: {
        backgroundColor: colors.primary,
        color: colors.white,
        padding: 10,
        fontSize: 30,
        marginBottom: 20

    },
    containerStyle: {
        backgroundColor: colors.background,
        padding: 20,
        margin: 20, backgroundColor: colors.backgroundColor, borderRadius: 20, padding: 35, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5


    },
    modalText: { marginBottom: 15, textAlign: 'center' }


})


export default ({ navigation }) => {
    const { email, emailVerified, handleEmail } = emailValidation();
    const [password, setPassword] = useState('')
    const [visible, setVisible] = useState(false)




    const handlePassword = (passwordVar) => {
        setPassword(passwordVar)
    }


    const handleLogin = async (e) => {
        if (!emailVerified) {
            alert('please verify your email')
            return
        }
        const formData = {
            email, password
        }
        try {
            // url must be same network, not a local host network
            const response = await loginUser(formData)
            alert(response.message)

            if (response.status >= 200 && response.status < 300) {
                navigation.navigate('CaptureImage')
            }


        } catch (error) {
            alert(error.message);


        }

    }


    const handleForgetPassword = () => {
        console.log(email)
        setVisible(true)

    }

    const hideModal = () => setVisible(false);

    return (

        <SafeAreaView style={styles.container} >
            <KeyboardAwareScrollView

                resetScrollToCoords={{ x: 0, y: 0 }}
                contentContainerStyle={{ flexGrow: 1 }}
                scrollEnabled={true}
            >

                <PaperProvider>
                    <Portal>
                        <Modal animationType="slide"
                            visible={visible} onDismiss={hideModal} contentContainerStyle={styles.containerStyle}>

                            <CustomModal />
                        </Modal>


                    </Portal>


                    <>

                        <View style={{ height: 300, width: 300, overflow: 'hidden' }}>
                            <Image
                                source={require("../assets/images/loginSVG.png")}
                                style={{
                                    height: '100%',
                                    width: '100%',
                                    transform: [{ rotate: '-30deg' }],

                                }}
                            />
                        </View>


                        <View>


                            <InputField
                                label={'email'}
                                icon={
                                    <MaterialIcons name="alternate-email" size={20} color={colors.textAndIcons} style={{ marginHorizontal: 15 }} />}
                                keyboardType="email-address"
                                onChangeText={e => handleEmail(e)}
                                textContentType="emailAddress"
                                condition={email.length < 1 ? null : emailVerified ?
                                    (<Feather name="check-circle" color="green" size={20} />)
                                    :
                                    (<MaterialIcons name="error" color="red" size={20} />)
                                }

                            >
                            </InputField>
                            <InputField
                                label={'password'}
                                icon={
                                    <MaterialIcons name="lock" size={20} color={colors.textAndIcons} style={{ marginHorizontal: 15 }} />}
                                inputType='password'
                                // fieldButtonLabel={"forget?"}
                                // fieldButtonFunction={() => handleForgetPassword()}

                                onChangeText={e => handlePassword(e)}
                                keyboardType={"numeric"}
                                secureTextEntry={true}
                                condition={
                                    <TouchableOpacity onPress={() => handleForgetPassword()}>
                                        <Text style={{ color: '#AD40AF', fontWeight: '700' }}>Forget?</Text>
                                    </TouchableOpacity>

                                }
                            >
                            </InputField>
                            <CustomButton label={"Login"} onPress={(e) => handleLogin(e)} icon={"login"} />

                            <Divider />

                            <Button
                                icon="google"
                                labelStyle={{ color: 'grey' }}
                            >
                                or, login with
                            </Button>
                        </View>

                        <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 30 }}>
                            <Text> New to the app?</Text>
                            <TouchableOpacity onPress={() => navigation.push("SignUp")}>
                                <Text style={{ color: "#AD40AF", fontWeight: '700' }}> Register</Text>
                            </TouchableOpacity>



                        </View>
                    </>



                </PaperProvider>
            </KeyboardAwareScrollView>







        </SafeAreaView >
    )
}
