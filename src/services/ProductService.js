import axios from "axios";
import { axiosJWT } from "./UserService";


export const getAllProduct = async (search, limit, sort, priceFilter) => {
  let res = {};
  const baseUrl = `${process.env.REACT_APP_API_URL}/product/get-all`;

  let query = `?limit=${limit}`;
  
  if (search?.length > 0) {
    query += `&filter=name=${search}`;
  }

  if (priceFilter) {
    query += `&filter=price=${priceFilter}`;
  }
  
  if (sort) {
    query += `&sort=${sort}`;
  }

  res = await axios.get(`${baseUrl}${query}`);
  return res.data;
};



// export const getAllProduct = async (search, limit) => {
//   let res = {};
//   if (search?.length > 0) {
//     res = await axios.get(
//       `${process.env.REACT_APP_API_URL}/product/get-all?filter=name&filter=${search}&limit=${limit}`
//     );
//   } else {
//     res = await axios.get(
//       `${process.env.REACT_APP_API_URL}/product/get-all?limit=${limit}`
//     );
//   }
//   return res.data;
// };

export const getProductType = async (type, limit, search, sortOrder) => {
  let res = {};
  const baseUrl = `${process.env.REACT_APP_API_URL}/product/get-all`;

  let query = `?limit=${limit}`;

  if (type) {
      query += `&filter=type=${type}`;
  }

  if (search?.length > 0) {
      query += `&filter=name=${search}`;
  }

  if (sortOrder) {
      query += `&sort=${sortOrder}`;
  }

  res = await axios.get(`${baseUrl}${query}`);
  return res.data;
};


export const getAllBestSellerProduct = async (limit) => {
  const res = await axios.get(
    `${process.env.REACT_APP_API_URL}/product/get-all-bestseller?limit=${limit}`
  );
  return res.data;
};

export const createProduct = async (data) => {
  const res = await axios.post(
    `${process.env.REACT_APP_API_URL}/product/create`,
    data
  );
  return res.data;
};

export const getDetailsProduct = async (id) => {
  const res = await axios.get(
    `${process.env.REACT_APP_API_URL}/product/get-details/${id}`
  );
  return res.data;
};

export const updateProduct = async (id, access_token, data) => {
  const res = await axiosJWT.put(
    `${process.env.REACT_APP_API_URL}/product/update/${id}`,
    data,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};

export const deleteProduct = async (id, access_token) => {
  const res = await axiosJWT.delete(
    `${process.env.REACT_APP_API_URL}/product/delete/${id}`,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};

export const deleteManyProduct = async (data, access_token) => {
  const res = await axiosJWT.post(
    `${process.env.REACT_APP_API_URL}/product/delete-many`,
    data,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};

export const getAllTypeProduct = async () => {
  const res = await axios.get(
    `${process.env.REACT_APP_API_URL}/product/get-all-type`
  );
  return res.data;
};
