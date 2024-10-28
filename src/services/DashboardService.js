import { axiosJWT } from "./UserService";

export const getRevenueByChartType = async (data, access_token) => {
    const res = await axiosJWT.post(
      `${process.env.REACT_APP_API_URL}/dashboard/get-chart-Revenue`,
      data,
      {
        headers: {
          token: `Bearer ${access_token}`,
        },
      }
    );
    return res.data;
  };

  export const getSummary = async (access_token) => {
    const res = await axiosJWT.get(
      `${process.env.REACT_APP_API_URL}/dashboard/get-summary`,
      {
        headers: {
          token: `Bearer ${access_token}`,
        },
      }
    );
    return res.data;
  };

  export const chartCategoryStock = async (access_token) => {
    const res = await axiosJWT.get(
      `${process.env.REACT_APP_API_URL}/dashboard/get-chartCategoryStock`,
      {
        headers: {
          token: `Bearer ${access_token}`,
        },
      }
    );
    return res.data;
  };

  export const getchartProductStock = async (access_token) => {
    const res = await axiosJWT.get(
      `${process.env.REACT_APP_API_URL}/dashboard/get-chartProductStock`,
      {
        headers: {
          token: `Bearer ${access_token}`,
        },
      }
    );
    return res.data;
  };


  export const getstockPercentage = async (access_token) => {
    const res = await axiosJWT.get(
      `${process.env.REACT_APP_API_URL}/dashboard/get-stockPercentage`,
      {
        headers: {
          token: `Bearer ${access_token}`,
        },
      }
    );
    return res.data;
  };


  
