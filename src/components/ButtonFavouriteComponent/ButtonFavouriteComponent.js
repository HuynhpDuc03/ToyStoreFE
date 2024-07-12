import React from 'react';
import { Button, ConfigProvider } from 'antd';
import { HeartFilled, HeartOutlined } from '@ant-design/icons';

const ButtonFavouriteComponent = ({ onClick, isFavourite, children, ...props }) => {
  return (
    <ConfigProvider
      theme={{
        components: {
          Button: {
            defaultBorderColor: "#ff0000 !important",
            defaultHoverBg: "#ff0000 !important",
            defaultHoverBorderColor: "#ff0000 !important",
            defaultHoverColor: "#fff !important",
          },
        },
      }}
    >
      <Button
        onClick={onClick}
        type="default"
        className="primary-btn"
        {...props}
      >
        {isFavourite ? (
          <HeartFilled style={{ display: "inline-flex", marginRight: "5px" }} />
        ) : (
          <HeartOutlined style={{ display: "inline-flex", marginRight: "5px" }} />
        )}
        {children}
      </Button>
    </ConfigProvider>
  );
};

export default ButtonFavouriteComponent;
