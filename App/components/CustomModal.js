

import React, { useState } from 'react'
import { SafeAreaView, Text, Image, StyleSheet, View, TextInput, TouchableOpacity } from 'react-native'

import { InputField } from '../components/InputField';
import colors from '../constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { CustomButton } from '../components/CustomButton';
import emailValidation from '../hooks/emailValidation';
import { resetPassword } from '../helper/axios';
import axios from "axios"

const styles = StyleSheet.create({
    modalText: { marginBottom: 15, textAlign: 'center' }
})

const CustomModal = () => {
    const { email, emailVerified, handleEmail } = emailValidation();

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

            // axios.put('http://192.168.1.181:8000/users/resetPassword', formData);
            console.log(response)
            if (response.status >= 200 && response.status < 300) {

            }


        } catch (error) {

            // Return error status and message for further handling
            return error.response;


        }


    }
    return (
        <>
            <Text style={styles.modalText}>Reset Password</Text>

            <InputField
                label={'enter your email address'}
                value={email}
                icon={
                    <MaterialIcons name="alternate-email" size={20} color={colors.textAndIcons} style={{ marginHorizontal: 15 }} />}
                keyboardType="email-address"
                onChangeText={e => handleEmail(e)}
                textContentType={"emailAddress"}

            >
            </InputField>
            <CustomButton label={"Reset"} onPress={(e) => handleSubmitForgetPassword(e)} />

        </>
    )
}

export default CustomModal