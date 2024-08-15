import { Button, Empty } from "antd";
import ProductComponent from "../../components/ProductComponent/ProductComponent";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const ProductFavorite = () => {
  const products = useSelector((state) => state.favorite.favoriteItems);
  const navigate = useNavigate();

  const handleClickNavigate = () => {
    navigate("/products")
  }

  return (
    <div>
      <section className="breadcrumb-option">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="breadcrumb__text">
                <h4>Wishlist</h4>
                <div className="breadcrumb__links">
                  <Link to="/">Home</Link>
                  <Link to="/product">Shop</Link>
                  <span>Wishlist</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="shop spad">
        <div className="container">
          <div className="row">
            <h3 style={{ textAlign: "center" }}>DANH MỤC YÊU THÍCH</h3>
            <div className="col-lg-12">
              <div className="row">
                {products.length === 0 ? (
                  <Empty className="mt-5" description={"Không có sản phẩm yêu thích!"} image={Empty.PRESENTED_IMAGE_SIMPLE}>
                    <Button type="primary" onClick={handleClickNavigate}>Thêm ngay</Button>
                  </Empty>
                ) : (
                  products.map((product) => (
                    <ProductComponent
                      key={product.product} // Sử dụng ID sản phẩm
                      countInStock={product.countInStock}
                      image={product.image}
                      name={product.name}
                      price={product.price}
                      rating={product.rating}
                      discount={product.discount}
                      id={product.product}
                      selled={product.selled}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductFavorite;
