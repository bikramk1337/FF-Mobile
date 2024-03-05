

import React, { useState } from 'react'
import { SafeAreaView, Text, Image, StyleSheet, View, TextInput, TouchableOpacity } from 'react-native'

import { InputField } from '../components/InputField';
import colors from '../constants/colors';
import { CustomButton } from '../components/CustomButton';
import useEmailValidation from '../hooks/emailValidation';
import { fetchOtpRequest, resetPassword } from '../helper/axios';
import axios from "axios"
import { MaterialIcons, Feather } from '@expo/vector-icons';

const styles = StyleSheet.create({
    modalText: { marginBottom: 15, textAlign: 'center' }
})

const CustomModal = () => {
    const [isEmailVerified, setIsEmailVerified] = useState(false)
    const [reset_code, setReset_code] = useState('')
    const { email, emailVerified, showPassword, password, confirmPassword, setEmail, handleEmail, setShowPassword, handlePassword, handleConfirmPassword } = useEmailValidation();

    const handleToken = (tokenVar) => {
        setReset_code(tokenVar)
    }


    const handlePasswordReset = async () => {
        if (password !== confirmPassword) {
            alert('password do not match')
            return
        }

        try {
            const formData = {
                password, reset_code, email
            }
            const response = await fetchOtpRequest(formData)
            alert(response.message)


        } catch (error) {
            alert(error)

        }

    }
    const handleSubmitForgetPassword = async () => {
        if (!emailVerified) {
            alert('please verify your email')
            return
        }

        try {
            const formData = {
                email
            }


            const response = await resetPassword(formData)
            alert(response.token + response.message)
            if (response.status === "success") {
                setEmail(response.email)
                setIsEmailVerified(true)
                // fetch tokem and send an email
            }


        } catch (error) {
            // Return error status and message for further handling
            return error.response;


        }


    }
    return (
        <>

            {!isEmailVerified ? (
                <>

                    <Text style={styles.modalText}>Reset Password</Text>

                    <InputField
                        label={'enter your email address'}
                        value={email}
                        icon={
                            <MaterialIcons name="alternate-email" size={20} color={colors.textAndIcons} style={{ marginHorizontal: 15 }} />}
                        keyboardType="email-address"
                        onChangeText={email => handleEmail(email)}
                        textContentType={"emailAddress"}

                    >
                    </InputField>
                    <CustomButton label={"Reset"} onPress={() => handleSubmitForgetPassword()} />
                </>


            ) :
                (
                    <>
                        <Text style={styles.modalText}>Enter your token and password</Text>



                        <InputField
                            label={'password'}
                            icon={
                                <MaterialIcons name="lock" size={20} color={colors.textAndIcons} style={{ marginHorizontal: 15 }} />}
                            inputType='password'
                            onChangeText={e => handlePassword(e)}
                            secureTextEntry={showPassword}
                            keyboardType={"numeric"}
                            maxLength={4}



                            condition={<TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                {password.length < 1 ? null : showPassword ?
                                    (
                                        <Feather name='eye-off' color="green" size={20} />

                                    ) : (
                                        <Feather name='eye' color="green" size={20} />

                                    )}

                            </TouchableOpacity>}
                        >/
                        </InputField>
                        <InputField
                            label={'confirm password'}
                            icon={
                                <MaterialIcons name="lock" size={20} color={colors.textAndIcons} style={{ marginHorizontal: 15 }} />}
                            inputType='password'
                            secureTextEntry={showPassword}
                            onChangeText={e => handleConfirmPassword(e)}
                            keyboardType={"numeric"}
                            maxLength={4}

                            condition={
                                confirmPassword.length < 1 ? null : password === confirmPassword ? (<Feather name="check-circle" color="green" size={20} />)
                                    :
                                    (<MaterialIcons name="error" color="red" size={20} />)



                            }
                        >
                        </InputField>
                        <InputField
                            label={' enter your token here '}
                            icon={
                                <MaterialIcons name="token" size={20} color={colors.textAndIcons} style={{ marginHorizontal: 15 }} />}
                            keyboardType="numeric"
                            onChangeText={(e) => handleToken(e)}
                            maxLength={6}

                            condition={email.length < 1 ? null : emailVerified ?
                                (<Feather name="check-circle" color="green" size={20} />)
                                :
                                (<MaterialIcons name="error" color="red" size={20} />)
                            }
                        >
                        </InputField>


                        <CustomButton label={"Submit"} onPress={() => handlePasswordReset()} />

                    </>
                )
            }
        </>


    )
}

export default CustomModal