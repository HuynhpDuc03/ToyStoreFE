import React from 'react';
import { Button, ConfigProvider } from 'antd';

const ButtonComponent = ({ onClick, children, ...props }) => {
  return (
    <ConfigProvider
      theme={{
        components: {
          Button: {
            defaultColor: `#000`,
            defaultHoverBg: `#fff`,
            defaultHoverBorderColor: "#000",
            defaultHoverColor: "#000",
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
        {children}
      </Button>
    </ConfigProvider>
  );
};

export default ButtonComponent;
