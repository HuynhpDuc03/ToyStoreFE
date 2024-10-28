import axios from "axios"

export const axiosJWT = axios.create()

export const loginUser = async (data) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/user/sign-in`, data)
    return res.data
}

export const signupUser = async (data) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/user/sign-up`, data)
    return res.data
}

export const getDetailsUser = async (id, access_token) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/user/get-details/${id}`, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    },)
    return res.data
}

export const getAllUSer = async (access_token) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/user/getAll`, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    },)
    return res.data
}


export const UpdateUser = async (id, data,access_token) => {
    const res = await axiosJWT.put(`${process.env.REACT_APP_API_URL}/user/update-user/${id}`, data,{
        headers: {
            token: `Bearer ${access_token}`,
        }
    },)
    return res.data
}

export const deleteUser = async (id, data, access_token) => {
    const res = await axiosJWT.delete(`${process.env.REACT_APP_API_URL}/user/delete-user/${id}`, data, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    },)
    return res.data
}



export const refreshToken = async (refreshToken) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/user/refresh-token`, {}, {
        headers: {
            token: `Bearer ${refreshToken}`,
        }
    })
    return res.data
}

export const logoutUser = async () => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/user/log-out`)
    return res.data
}


export const forgotPassword = async (data) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/user/forgot-password`, data)
    return res.data
}


export const resetPassword = async (data) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/user/reset-password`, data)
    return res.data
}

export const verifyOtp = async (data) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/user/verify-Otp`, data)
    return res.data
}