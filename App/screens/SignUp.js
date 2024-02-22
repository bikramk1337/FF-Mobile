import React from 'react'
import { SafeAreaView, Text, Image, StyleSheet, View, TextInput, TouchableOpacity } from 'react-native'
import { Divider } from 'react-native-paper';

import colors from '../constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { InputField } from '../components/InputField';
import { CustomButton } from '../components/CustomButton';




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
    const [text, setText] = React.useState("");
    return (
        <SafeAreaView style={styles.container} >
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
                    keyboardType="email address"
                >
                </InputField>

                <InputField
                    label={'email'}
                    icon={
                        <MaterialIcons name="alternate-email" size={20} color={colors.textAndIcons} style={{ marginHorizontal: 15 }} />}
                    keyboardType="email address"
                >
                </InputField>
                <InputField
                    label={'password'}
                    icon={
                        <MaterialIcons name="lock" size={20} color={colors.textAndIcons} style={{ marginHorizontal: 15 }} />}
                    inputType='password'
                >
                </InputField>
                <InputField
                    label={' confirm password'}
                    icon={
                        <MaterialIcons name="lock" size={20} color={colors.textAndIcons} style={{ marginHorizontal: 15 }} />}
                    inputType='password'
                >
                </InputField>



                <CustomButton icon={"account-plus-outline"} label={"Register"} onPress={() => { }} />
                <Divider />

            </View>





            <View style={{ flexDirection: "row", justifyContent: "center", marginBottom: 30 }}>
                <Text> Already registered?</Text>
                <TouchableOpacity onPress={() => navigation.push("Login")}>
                    <Text style={{ color: "#AD40AF", fontWeight: '700' }}> Login</Text>
                </TouchableOpacity>
            </View>




        </SafeAreaView >
    )
}
