import React from 'react'
import { SafeAreaView, Text, Image, StyleSheet, View, TextInput, TouchableOpacity } from 'react-native'
import { Divider } from 'react-native-paper';
import { Button } from 'react-native-paper'
import colors from '../constants/colors';
import { MaterialIcons } from '@expo/vector-icons';


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
            <View style={{ alignItems: 'center' }}>
                <Image source={require("../assets/images/loginSVG.png")} height={50} width={50} style={{ transform: [{ rotate: '-20deg' }] }} />
            </View>

            <View style={{ flexDirection: 'column', margin: 10 }}>
                <View style={{ flexDirection: 'row', borderBottomColor: "#ccc", borderBottomWidth: 1, paddingBottom: 8, marginBottom: 24 }}>
                    <MaterialIcons name="alternate-email" size={20} color={colors.textAndIcons} style={{ marginHorizontal: 15 }} />
                    <TextInput
                        placeholder='email'
                        value={text}
                        onChangeText={text => setText(text)}
                        style={{ paddingVertical: 0 }}
                        keyboardType="email-address"

                    />

                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderBottomColor: "#ccc", borderBottomWidth: 1, paddingBottom: 8, marginBottom: 24 }}>
                    <Button icon="lock"
                        labelStyle={{ color: 'grey' }}

                    ></Button>

                    <TextInput
                        placeholder='password'
                        onChangeText={text => setText(text)}
                        style={{ paddingVertical: 0 }}
                        secureTextEntry={true}

                    />

                    <TouchableOpacity>
                        <Text style={{ color: '#AD40AF', fontWeight: '700' }}>Forget?</Text>
                    </TouchableOpacity>


                </View>





                <Button icon="login" mode="contained" style={styles.loginButton}>
                    Login
                </Button>
                <Divider />

                <Button
                    icon="google"
                    labelStyle={{ color: 'grey' }} // Attempts to set the text color, but may not affect icon color
                    onPress={() => console.log('Pressed')}
                >
                    or, login with
                </Button>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "center", marginBottom: 30 }}>
                <Text> New to the app?</Text>
                <TouchableOpacity onPress={() => navigation.push("SignUp")}>
                    <Text style={{ color: "#AD40AF", fontWeight: '700' }}> Register</Text>
                </TouchableOpacity>



            </View>


        </SafeAreaView >
    )
}
