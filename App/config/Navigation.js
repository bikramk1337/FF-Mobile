import React from "react"
import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import Home from "../screens/Home"
import Options from "../screens/Options"
import Login from "../screens/Login"
import SignUp from "../screens/SignUp"
import CaptureImage from "../screens/CaptureImage"


const MainStack = createStackNavigator()
const MainStackScreen = () => (
    <MainStack.Navigator
        initialRouteName="CaptureImage">
        <MainStack.Screen name="Home" component={Home} options={{ headerShown: false }}
        />
        <MainStack.Screen name="Options" component={Options} />
        <MainStack.Screen name="Login" component={Login} />
        <MainStack.Screen name="SignUp" component={SignUp} />
        <MainStack.Screen name="CaptureImage" component={CaptureImage} />
    </MainStack.Navigator >



)
export default () => {
    return (
        <NavigationContainer>
            <MainStackScreen />
        </NavigationContainer>

    )


}

