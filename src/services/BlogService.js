import { axiosJWT } from "./UserService";

export const getAllBlogs = async (page, limit) => {
  const res = await axiosJWT.get(
    `${process.env.REACT_APP_API_URL}/blog/getAll?limit=${limit}&page=${page}`
  );
  return res.data;
};



export const getAllTags = async () => {
  const res = await axiosJWT.get(
    `${process.env.REACT_APP_API_URL}/blog/getAllTags`
  );
  return res.data;
};
export const comments = async (id,data) => {
  const res = await axiosJWT.post(
    `${process.env.REACT_APP_API_URL}/blog/${id}/comments` ,data
  );
  return res.data;
};

export const getDetailBlogs = async (id) => {
  const res = await axiosJWT.get(
    `${process.env.REACT_APP_API_URL}/blog/getDetails/${id}`
  );
  return res.data;
};

export const updateBlogs = async (id, access_token, data) => {
  const res = await axiosJWT.put(
    `${process.env.REACT_APP_API_URL}/blog/update/${id}`,
    data,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};

export const deleteBlogs = async (id, access_token) => {
  const res = await axiosJWT.delete(
    `${process.env.REACT_APP_API_URL}/blog/delete/${id}`,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};

export const createBlog = async (data, access_token) => {
  const res = await axiosJWT.post(
    `${process.env.REACT_APP_API_URL}/blog/createBlog`,
    data,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};
