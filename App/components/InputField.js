
import React from 'react'
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native'
const style = StyleSheet.create({
    mainContainer: {
        flexDirection: 'row',
        borderBottomColor: "#ccc",
        borderBottomWidth: 1,
        paddingBottom: 8,
        marginBottom: 24,
        margin: 10

    },
    textInput: {
        flex: 1,
        paddingVertical: 0

    }

})


export const InputField = ({ label, icon, inputType, keyboardType, fieldButtonLabel, fieldButtonFunction, onChangeText, condition, secureTextEntry, value, textContentType }) => {
    return (


        <View style={style.mainContainer}>
            {icon}
            {inputType == "password" ? (
                <TextInput
                    placeholder={label}
                    style={style.textInput}
                    secureTextEntry={secureTextEntry}
                    keyboardType={keyboardType}
                    onChangeText={onChangeText}
                    value={value}
                />) :
                (
                    <TextInput
                        placeholder={label}
                        value={value}
                        style={style.textInput}
                        keyboardType={keyboardType}
                        textContentType={textContentType}
                        onChangeText={onChangeText} // Use onChangeText for TextInput



                    />

                )}
            {condition}

            <TouchableOpacity onPress={fieldButtonFunction}>
                <Text style={{ color: '#AD40AF', fontWeight: '700' }}>{fieldButtonLabel}</Text>
            </TouchableOpacity>

        </View>



    )
}




