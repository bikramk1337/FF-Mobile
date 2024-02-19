import React from 'react'
import { SafeAreaView, Text, Image, StyleSheet, View, TouchableOpacity } from 'react-native'
import { TextInput } from 'react-native-paper';
import { Button, Icon } from 'react-native-paper'
import colors from '../constants/colors';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },

})


export default () => {
    const [text, setText] = React.useState("");
    return (
        <SafeAreaView style={styles.container} >
            <Text> this is sign up page</Text>



        </SafeAreaView >
    )
}
