import { Contant } from "./contant";

export const isJsonString = (data) => {
  try {
    JSON.parse(data);
  } catch (error) {
    return false;
  }
  return true;
};

export const getBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.onerror = (error) => {
      reject(error);
    };
  });
};


export const truncateDescription = (description, maxLength = 100) => {
  if (description.length <= maxLength) {
    return description;
  }
  return description.slice(0, maxLength) + "...";
};

export const converPrice = (price) => {
  try {
    const result = price?.toLocaleString().replaceAll(",", ".");
    return `${result} ₫`;
  } catch (error) {
    return null;
  }
};


export const formatDate = (dateString) => {
  const date = new Date(dateString);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const year = date.getFullYear();

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
 

  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

export const convertDataChart = (data, type, dateRange, t) => {
  try {
    const orderContant = Contant(t);

    if (!Array.isArray(data) || !type) return [];

    const now = new Date();
    const object = data.reduce((acc, opt) => {
      if (!opt.createdAt || !opt[type]) return acc;

      const date = new Date(opt.createdAt);

      let isInRange = false;
      if (dateRange === 'day' && date.getDate() === now.getDate() && date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()) {
        isInRange = true;
      } else if (dateRange === 'month' && date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()) {
        isInRange = true;
      } else if (dateRange === 'year' && date.getFullYear() === now.getFullYear()) {
        isInRange = true;
      } else if (!dateRange) {
        isInRange = true;
      }

      if (isInRange) {
        acc[opt[type]] = (acc[opt[type]] || 0) + 1;
      }

      return acc;
    }, {});

    return Object.keys(object).map((item) => ({
      name: orderContant.payment[item] || item, // fallback to item if no translation found
      value: object[item],
    }));
  } catch (e) {
    console.error("Error in convertDataChart:", e);
    return [];
  }
};
export const formatDateBlog = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export const renderOptions = (arr) => {
  let results = []
  if (arr) {
      results = arr?.map((opt) => {
          return {
              value: opt,
              label: opt
          }
      })
  }
  results.push({
      label: 'Thêm type',
      value: 'add_type'
  })
  return results
}
export const initFacebookSDK = () => {
  if (window.FB) {
    window.FB.XFBML.parse();
  }
  let locale = "vi_VN";
  window.fbAsyncInit = function () {
    window.FB.init({
      appId: process.env.REACT_APP_FB_ID, // You App ID
      cookie: true, // enable cookies to allow the server to access
      // the session
      xfbml: true, // parse social plugins on this page
      version: "v8.6", // use version 2.1
    });
  };
  // Load the SDK asynchronously
  (function (d, s, id) {
    console.log(s);
    var js,
      fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s);
    js.id = id;
    js.src = `//connect.facebook.net/${locale}/sdk.js`;
    fjs.parentNode.insertBefore(js, fjs);
  })(document, "script", "facebook-jssdk");
};
