import { axiosJWT } from "./UserService";

export const createOrder = async (data, access_token) => {
  const res = await axiosJWT.post(
    `${process.env.REACT_APP_API_URL}/order/create`,
    data,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};
export const getOrderByUserId = async (id, access_token, page, limit, status) => {
  const res = await axiosJWT.get(
    `${process.env.REACT_APP_API_URL}/order/get-all-order-details/${id}?limit=${limit}&page=${page}&status=${status}`,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};

export const getDetailsOrder = async (id, access_token) => {
  const res = await axiosJWT.get(
    `${process.env.REACT_APP_API_URL}/order/get-details-order/${id}`,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};

export const cancelOrder = async (id, access_token, orderItems) => {
  const res = await axiosJWT.delete(
    `${process.env.REACT_APP_API_URL}/order/cancel-order/${id}`,
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      data: { orderId: id, orderItems },
    }
  );
  return res.data;
};

export const getAllOrder = async (access_token,page, limit) => {
  const res = await axiosJWT.get(
    `${process.env.REACT_APP_API_URL}/order/get-all-order?page=${page}&limit=${limit}`,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};

export const updateOrderStatus = async ({ orderId, status }, access_token) => {
  const res = await axiosJWT.put(
    `${process.env.REACT_APP_API_URL}/order/update-status`,
    { orderId, status },
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};

export const markOrderAsReceived = async (
  { orderId, isPaid, isDelivered },
  access_token
) => {
  const res = await axiosJWT.put(
    `${process.env.REACT_APP_API_URL}/order/mark-as-received`,
    { orderId, isPaid, isDelivered },
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};



export const createOrderZalopay = async (data, access_token) => {
  const res = await axiosJWT.post(
    `${process.env.REACT_APP_API_URL}/payment/zalopay`,
    data,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};