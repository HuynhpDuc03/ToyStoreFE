import React from 'react';

const LoadingComponent = ({ isLoading, children }) => {
  if (isLoading) {
      return (
          <div id="preloder" >
              <div className="loader"></div>
          </div>
      );
  }
  return <>{children}</>;
};

export default LoadingComponent;