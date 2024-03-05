import React, { useState } from 'react'
import { SafeAreaView, Text, Image, StyleSheet, View, TouchableOpacity } from 'react-native'
import { Divider } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'


import colors from '../constants/colors';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import { InputField } from '../components/InputField';
import { CustomButton } from '../components/CustomButton';
import axios from 'axios'
import useEmailValidation from '../hooks/emailValidation';
import { registerNewUser } from '../helper/axios';






const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,

    },
    textContent: {
        color: colors.textAndIcons,
    }



})



export default ({ navigation }) => {
    const { email, emailVerified, showPassword, password, confirmPassword, handleEmail, setShowPassword, handlePassword, handleConfirmPassword } = useEmailValidation();
    const [name, setName] = useState('')
    const [nameVerify, setNameVerify] = useState(false)



    const handleName = (nameVar) => {
        setName(nameVar)
        setNameVerify(false)
        if (nameVar.length > 1) {
            setNameVerify(true)
        }
    }


    const handleSubmit = async () => {
        if (password !== confirmPassword) {
            alert('password do not match')
            return
        }

        if (!emailVerified) {
            alert('please verify your email')
            return
        }
        if (!nameVerify) {
            alert('please verify your name')
            return
        }

        const formData = {
            name, email, password
        }

        try {
            // url must be same network, not a localhostnetwork
            const response = await registerNewUser(formData)  //axios.post('http://192.168.1.181:8000/register', formData);
            // Check for successful response status code (200-299)
            alert(response.message)
            if (response.status === "success") {
                navigation.navigate('Login')
            }

        } catch (error) {
            alert(error)

        }




    }


    return (
        <SafeAreaView style={styles.container} >
            <KeyboardAwareScrollView

                resetScrollToCoords={{ x: 0, y: 0 }}
                contentContainerStyle={{ flexGrow: 1 }}
                scrollEnabled={true}
            >

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
                <Text style={{ alignSelf: 'center', fontSize: 30, fontWeight: "bold" }}> Register </Text>

                <View>
                    <InputField
                        label={'name'}
                        icon={
                            <MaterialIcons name="person-outline" size={20} color={colors.textAndIcons} style={{ marginHorizontal: 15 }} />}
                        onChangeText={e => handleName(e)}

                        condition={name.length < 1 ? null : nameVerify ?
                            (<Feather name="check-circle" color="green" size={20} />)
                            :
                            (<MaterialIcons name="error" color="red" size={20} />)
                        }

                    >


                    </InputField>



                    <InputField
                        label={'email'}
                        icon={
                            <MaterialIcons name="alternate-email" size={20} color={colors.textAndIcons} style={{ marginHorizontal: 15 }} />}
                        keyboardType="email-address"
                        onChangeText={e => handleEmail(e)}
                        textContentType={"emailAddress"}

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
                        onChangeText={e => handlePassword(e)}
                        // value={"1234"}
                        secureTextEntry={showPassword}
                        keyboardType={"numeric"}
                        condition={<TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                            {password.length < 1 ? null : showPassword ?
                                (
                                    <Feather name='eye-off' color="green" size={20} />

                                ) : (
                                    <Feather name='eye' color="green" size={20} />

                                )}

                        </TouchableOpacity>}
                    />

                    <InputField
                        label={'confirm password'}
                        icon={
                            <MaterialIcons name="lock" size={20} color={colors.textAndIcons} style={{ marginHorizontal: 15 }} />}
                        inputType='password'
                        secureTextEntry={showPassword}
                        onChangeText={e => handleConfirmPassword(e)}
                        keyboardType={"numeric"}

                        condition={
                            confirmPassword.length < 1 ? null : password === confirmPassword ? (<Feather name="check-circle" color="green" size={20} />)
                                :
                                (<MaterialIcons name="error" color="red" size={20} />)

                        }
                    >
                    </InputField>
                    <CustomButton icon={"account-plus-outline"} label={"Register"} onPress={handleSubmit} />
                    <Divider />

                </View>





                <View style={{ flexDirection: "row", justifyContent: "center", marginBottom: 30 }}>
                    <Text> Already registered?</Text>
                    <TouchableOpacity onPress={() => navigation.push("Login")}>
                        <Text style={{ color: "#AD40AF", fontWeight: '700' }}> Login</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAwareScrollView >
        </SafeAreaView >
    )
}
