import axios from "axios"
// instead of sessionStorage
import AsyncStorage from '@react-native-async-storage/async-storage';

const rootUrl = "http://192.168.1.181:8000"
const loginApi = rootUrl + "/users"
const registerApi = rootUrl + "/register"




const fetchProcessor = async ({ method, url, data, token, isPrivate }) => {
    try {
        const jwtToken = token || await AsyncStorage.getItem('@storage_Key')
        const headers = isPrivate
            ? {
                Authorization: `Bearer ${jwtToken}`

            }
            : null;

        console.log(headers.Authorization, "authorixation", data)


        const res = await axios({
            method,
            url,
            data,
            headers

        })
        console.log("res")
        return res.data

    } catch (error) {
        return {
            status: "error",
            message: error.message,
        };
    }
}



export const loginUser = async (loginData) => {

    const url = loginApi + "/login";
    const obj = {
        method: 'post',
        url,
        data: loginData,
        isPrivate: true,
        token: "realSESSIONKEYISNEEDEDHERE"
    }
    return fetchProcessor(obj)

}


export const registerNewUser = async (data) => {
    const url = registerApi;
    const obj = {
        method: "post",
        url,
        data,
        isPrivate: true,
        token: "realSESSIONKEYISNEEDEDHERE"
    }
    return fetchProcessor(obj)
}


export const resetPassword = async (resetData) => {

    const url = loginApi + "/resetPassword"

    const obj = {
        method: 'put',
        url,
        data: resetData,
        isPrivate: true,
        token: "realSESSIONKEYISNEEDEDHERE"
    }
    return fetchProcessor(obj)

}

export const fetchOtpRequest = async (data) => {
    const url = loginApi + "/requestOTP";
    const obj = {
        method: "put",
        url,
        data,
        isPrivate: true,
        token: "realSESSIONKEYISNEEDEDHERE"
    };
    console.log(data, "i am from axios")
    return fetchProcessor(obj);
};

