import { Button, Empty, Pagination } from "antd";
import ProductComponent from "../../components/ProductComponent/ProductComponent";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState } from "react";

const ProductFavorite = () => {
  const { t } = useTranslation();
  const products = useSelector((state) => state.favorite.favoriteItems);
  const navigate = useNavigate();

  // Pagination state
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 12, // Number of products per page
  });

  // Calculate the products to display for the current page
  const startIndex = (pagination.currentPage - 1) * pagination.pageSize;
  const endIndex = startIndex + pagination.pageSize;
  const currentProducts = products.slice(startIndex, endIndex);

  // Handle page change
  const handlePageChange = (page, pageSize) => {
    setPagination({ currentPage: page, pageSize });
  };

  const handleClickNavigate = () => {
    navigate("/products");
  };

  return (
    <div>
      <section className="breadcrumb-option">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="breadcrumb__text">
                <h4>{t("shopPage.Wishlist")}</h4>
                <div className="breadcrumb__links">
                  <Link to="/">{t("header.home")}</Link>
                  <Link to="/product">{t("header.shop")}</Link>
                  <span>{t("shopPage.Wishlist")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="shop spad">
        <div className="container">
          <div className="row">
            <h3 style={{ textAlign: "center" }}>{t("shopPage.Favorite")}</h3>
            <div className="col-lg-12">
              <div className="row">
                {products.length === 0 ? (
                  <Empty
                    className="mt-5"
                    description={t("shopPage.noFavorites")}
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                  >
                    <Button type="primary" onClick={handleClickNavigate}>
                      {t("pageHome.readMore")}
                    </Button>
                  </Empty>
                ) : (
                  <>
                    {currentProducts.map((product) => (
                      <ProductComponent
                        key={product.product}
                        countInStock={product.countInStock}
                        image={product.image}
                        name={product.name}
                        price={product.price}
                        rating={product.rating}
                        discount={product.discount}
                        id={product.product}
                        selled={product.selled}
                      />
                    ))}
                  </>
                )}
              </div>
              {/* Pagination Component */}
              {products.length > pagination.pageSize && (
                <Pagination
                  current={pagination.currentPage}
                  pageSize={pagination.pageSize}
                  total={products.length}
                  align="center"
                  onChange={handlePageChange}
                  showSizeChanger
                  pageSizeOptions={["6", "12", "24"]}
                  showTotal={(total) => `${t("pagination.total")} ${total} ${t("pagination.items")}`}
                />
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductFavorite;
