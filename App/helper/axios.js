import axios from "axios";
import * as SecureStore from "expo-secure-store";
// root url should updated as per ip address of host machine unless  server is hosted on static address
// const rootUrl = "http://localhost:8888/api/v1";
const rootUrl = "https://api.odinsvault.xyz/api/v1";

const fetchProcessor = async ({ method, url, data, headers, token, isPrivate }) => {
  const authHeaders = {};
  if (isPrivate) {
    const accessToken = await SecureStore.getItemAsync("accessToken");
    if (accessToken) {
      authHeaders["Authorization"] = `Bearer ${accessToken}`;
    }
  }
  try {
    const res = await axios({
      method,
      url,
      data,
      headers: {
        ...headers,
        ...authHeaders,
      },
    });
    return res;
  } catch (error) {
  console.error("Error:", error);
  if (error.response) {
    console.error("Response Data:", error.response.data);
    console.error("Response Status:", error.response.status);
    console.error("Response Headers:", error.response.headers);
    return {
      status: error.response.status,
      message: error.response.data.detail || "Unknown error occurred",
    };
  } else if (error.request) {
    console.error("Request:", error.request);
    return {
      status: 500,
      message: "No response received from the server",
    };
  } else {
    console.error("Error Message:", error.message);
    return {
      status: 500,
      message: "Error setting up the request",
    };
  }
}
};

export const loginUser = async (loginData) => {
  const url = rootUrl + "/login/access-token";
  const obj = {
    method: "post",
    url,
    data: loginData,
    // isPrivate:true
  };
  return fetchProcessor(obj);
};

export const registerNewUser = async (data) => {
  const url = rootUrl + "/signup";
  const obj = {
    method: "post",
    url,
    data,
  };
  return fetchProcessor(obj);
};

export const RecoverPassword = async (email) => {
  const encodedEmail = encodeURIComponent(email);
  const url = `${rootUrl}/recover-password/${encodedEmail}`;
  const obj = {
    method: "post",
    url,
  };
  return fetchProcessor(obj);
};

export const resetPassword = async (data) => {
  const url = rootUrl + "/reset-password";
  const obj = {
    method: "post",
    url,
    data,
  };

  return fetchProcessor(obj);
};

export const verifyEmail = async (email, code) => {
  const params = new URLSearchParams({ email, code }).toString();
  const url = `${rootUrl}/signup/verify-email?${params}`;
  const obj = {
    method: "post",
    url,
    data: {},
  };

  return fetchProcessor(obj);
};

export const getCurrentUser = async () => {
  const url = `${rootUrl}/users/current_user`;
  const obj = {
    method: "get",
    url,
    isPrivate: true,
  };

  return fetchProcessor(obj);
};

export const getUserById = async (id) => {
  const url = `${rootUrl}/users/${id}`;
  const obj = {
    method: "get",
    url,
    isPrivate: true,
  };

  return fetchProcessor(obj);
};

export const uploadAndPredict = async (image) => {
  const formData = new FormData();

  formData.append("file", {
    uri: image.uri,
    name: image.fileName || "IMAGE",
    type: image.mimeType || "image/jpeg",
  });

  const url = `${rootUrl}/classifier/upload-and-predict`;
  const obj = {
    method: "post",
    url,
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
    isPrivate: true,
  };

  return fetchProcessor(obj);
};

export const getAllClassificationHistory = async () => {
  const url = `${rootUrl}/classifier/classification-histories_all`;
  const obj = {
    method: "get",
    url,
    isPrivate: true,
  };

  return fetchProcessor(obj);
};

export const getUsesrClassificationHistory = async () => {
  const url = `${rootUrl}/classifier/classification-histories_current`;
  const obj = {
    method: "get",
    url,
    isPrivate: true,
  };

  return fetchProcessor(obj);
};

export const getAllFauna = async () => {
  const url = `${rootUrl}/fauna??skip=0&limit=1000`;
  const obj = {
    method: "get",
    url,
    isPrivate: true,
  };

  return fetchProcessor(obj);
};

export const getFaunaByLabel = async (label) => {
  const url = `${rootUrl}/fauna/label?label=${label}`;
  const obj = {
    method: "get",
    url,
    isPrivate: true,
  };

  return fetchProcessor(obj);
};

export const getImageFromURL = async (image_url) => {
  const url = `${rootUrl}/classifier/image-from-url?image_url=${image_url}`;
  const obj = {
    method: "get",
    url,
    isPrivate: true,
  };

  return fetchProcessor(obj);
};

export const aiChat = async (params) => {
  const prompt = `context:"${params.faunaDescription}" request:"${params.request}". Generate short response for the given request on the given context only."`;
  const url = `${rootUrl}/llm/chat?prompt=${prompt}`;
  const obj = {
    method: "post",
    url,
    isPrivate: true,
  };

  return fetchProcessor(obj);
};
