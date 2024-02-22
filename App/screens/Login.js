import React from 'react'
import { SafeAreaView, Text, Image, StyleSheet, View, TextInput, TouchableOpacity } from 'react-native'
import { Divider } from 'react-native-paper';
import { Button } from 'react-native-paper'
import colors from '../constants/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { CustomButton } from '../components/CustomButton';
import { InputField } from '../components/InputField';


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

            <View>

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
                    fieldButtonLabel={"forget?"}
                    fieldButtonFunction={() => { }}

                >
                </InputField>
                <CustomButton label={"Login"} onPress={() => { }} icon={"login"} />

                <Divider />

                <Button
                    icon="google"
                    labelStyle={{ color: 'grey' }}
                    onPress={() => console.log('Pressed')}
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


        </SafeAreaView >
    )
}
