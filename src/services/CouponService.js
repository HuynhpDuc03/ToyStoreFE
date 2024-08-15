import { axiosJWT } from "./UserService";


export const getAllCoupons = async () => {
  const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/coupon/getAllCoupons`);
  return res.data;
};

export const getDetailCoupons = async (id,access_token) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/coupon/getDetailCoupon/${id}`, {
        headers: {
          token: `Bearer ${access_token}`,
        }
      });
    return res.data;
  };

export const updateCoupon = async (id, access_token, data) => {
  const res = await axiosJWT.put(`${process.env.REACT_APP_API_URL}/coupon/updateCoupon/${id}`, data, {
    headers: {
      token: `Bearer ${access_token}`,
    }
  });
  return res.data;
};

export const deleteCoupon = async (id, access_token) => {
  const res = await axiosJWT.delete(`${process.env.REACT_APP_API_URL}/coupon/deleteCoupon/${id}`, {
    headers: {
      token: `Bearer ${access_token}`,
    }
  });
  return res.data;
};

export const createCoupon = async (access_token) => {
  const res = await axiosJWT.post(`${process.env.REACT_APP_API_URL}/coupon/createCoupon`, {},{
    headers: {
      token: `Bearer ${access_token}`,
    }
  });
  return res.data;
};

export const applyCoupon = async (couponCode) => {
  const res = await axiosJWT.post(`${process.env.REACT_APP_API_URL}/coupon/applyCoupon`, { couponCode });
  return res.data;
};