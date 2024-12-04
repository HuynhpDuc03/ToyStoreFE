import axios from "axios";
import { axiosJWT } from "./UserService";



export const getAllProduct = async (filters, page, limit) => {
  const { type, priceRange, sort } = filters;
  const res = await axios.get(
    `${process.env.REACT_APP_API_URL}/product/get-all`, {
      params: { type, priceRange, sort, page, limit } // Thêm page và limit vào params
    }
  );
  return res.data;
};

export const getAllProductAdmin = async ( page, limit) => {
  const res = await axios.get(
    `${process.env.REACT_APP_API_URL}/product/get-all-admin`, {
      params: { page, limit } // Thêm page và limit vào params
    }
  );
  return res.data;
};

// export const getAllProduct = async (search, limit, sort, priceFilter, page) => {
//   let res = {};
//   const baseUrl = `${process.env.REACT_APP_API_URL}/product/get-all`;

//   let query = `?limit=${limit}`;

//   if (search?.length > 0) {
//     query += `&filter=name=${search}`;
//   }

//   if (priceFilter) {
//     query += `&filter=price=${priceFilter}`;
//   }

//   if (sort) {
//     query += `&sort=${sort}`;
//   }

//   if (page) {
//     query += `&page=${page}`;
//   }
//   res = await axios.get(`${baseUrl}${query}`);
//   return res.data;
// };

export const searchProduct = async (search) => {
  let res = {};
  const baseUrl = `${process.env.REACT_APP_API_URL}/product/get-search`;
  let query = `?limit=6`;

  if (search?.length > 0) {
    query += `&query=${encodeURIComponent(search)}`; // Sử dụng `query` thay vì `name`
  }

  try {
    res = await axios.get(`${baseUrl}${query}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching search results:", error);
    return { data: [] }; // Trả về kết quả rỗng nếu xảy ra lỗi
  }
};

export const getProductRelated = async (data) => {
  const res = await axios.get(
    `${process.env.REACT_APP_API_URL}/product/get-ProductRelated`,
    { params: data }  // Chuyển data thành query params
  );
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

export const getProductType = async (
  type,
  limit,
  search,
  sortOrder,
  priceFilter
) => {
  let res = {};
  const baseUrl = `${process.env.REACT_APP_API_URL}/product/get-all`;

  let query = `?limit=${limit}`;

  if (type) {
    query += `&filter=type=${type}`;
  }

  if (search?.length > 0) {
    query += `&filter=name=${search}`;
  }

  if (priceFilter?.length > 0) {
    query += `&filter=price=${priceFilter.join(",")}`;
  }

  if (sortOrder) {
    query += `&sort=${sortOrder}`;
  }

  res = await axios.get(`${baseUrl}${query}`);
  return res.data;
};

export const getAllSpecialProducts = async (limit) => {
  const res = await axios.get(
    `${process.env.REACT_APP_API_URL}/product/get-SpecialProducts?limit=${limit}`
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

export const addReview = async (data, access_token) => {
  const res = await axiosJWT.post(
    `${process.env.REACT_APP_API_URL}/rating/addReview`,
    data,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};
 