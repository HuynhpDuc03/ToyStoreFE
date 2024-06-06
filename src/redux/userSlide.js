import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    name: '',
    email: '',
    phone: '',
    access_token: '',
    id: '',
    isAdmin: false,
    refreshToken: '',
    address:'',
    city:'',
    ward:'',
    district:''

}

export const userSlide = createSlice({
    name: 'user',
    initialState,
    reducers: {
        updateUser: (state, action) => {
            const { name = '', email = '', access_token = '', phone = '', _id = '', isAdmin, refreshToken = '', address='',city='',ward='' ,district='' } = action.payload
            state.name = name ? name : state.name;
            state.email = email ? email : state.email;
            state.phone = phone ? phone : state.phone;
            state.id = _id ? _id : state.id
            state.access_token = access_token ? access_token : state.access_token;
            state.isAdmin = isAdmin ? isAdmin : state.isAdmin;
            state.refreshToken = refreshToken ? refreshToken : state.refreshToken;
            state.address = address ? address : state.address;
            state.city = city ? city : state.city;
            state.ward = ward ? ward : state.ward;
            state.district = district ? district : state.district;
        },
        resetUser: (state) => {
            state.name = '';
            state.email = '';
            state.phone = '';
            state.id = '';
            state.access_token = '';
            state.isAdmin = false;
            state.refreshToken = ''
            state.address = ''
            state.city = '';
            state.ward = '';
            state.district = '';
        },
    },
})

// Action creators are generated for each case reducer function
export const { updateUser, resetUser } = userSlide.actions

export default userSlide.reducer