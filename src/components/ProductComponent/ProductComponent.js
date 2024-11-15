import { Button, message, Modal, Rate } from "antd";
import { converPrice } from "../../utils";
import ButtonComponent from "../ButtonComponent/ButtonComponent";
import { ShoppingCartOutlined } from "@ant-design/icons";
import ButtonFavouriteComponent from "../ButtonFavouriteComponent/ButtonFavouriteComponent";
import ProductDetailsContent from "../../pages/ProductPage/ProductDetailsModal";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  addFavoriteProduct,
  removeFavoriteProduct,
} from "../../redux/slides/favoriteSlide";

const ProductComponent = (props) => {
  const { image, name, price, rating, discount, selled, id, countInStock } =
    props;
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const favoriteItems = useSelector((state) => state.favorite.favoriteItems);
  const isFavourite = favoriteItems.some((item) => item.product === id);

  const handleDetailsProduct = (id) => {
    navigate(`/productsDetail/${id}`);
  };

  const formatSelled = (selled) => {
    if (selled > 1000) {
      const formattedNumber = (selled / 1000).toFixed(1);
      return `${formattedNumber}k`;
    } else {
      return selled.toString();
    }
  };

  const handleFavoriteClick = () => {
    if (isFavourite) {
      dispatch(removeFavoriteProduct({ idProduct: id }));
      message.destroy()
      message.info("Đã xóa khỏi danh sách yêu thích", 1.5);
    } else {
      dispatch(
        addFavoriteProduct({
          favoriteItem: {
            name,
            image,
            price,
            product: id,
            discount,
            countInStock,
            rating,
            selled,
          },
        })
      );
      message.destroy()
      message.success("Đã thêm vào danh sách yêu thích", 1.5);
    }
  };

  const discountedPrice = price * (1 - discount / 100);
  return (
    <div
      className="col-lg-3 col-md-6 col-sm-6 border-shadow"
      style={{ marginTop: "5px", marginBottom: "5px" }}
    >
      <div style={{ marginBottom: "15px" }}>
        <div
          className="product__item__pic set-bg"
          style={{
            // backgroundImage: `url(${require("../../img/product/" + image)})`,
            backgroundImage: `url(${image})`,

            cursor: "pointer",
          }}
          onClick={() => handleDetailsProduct(id)}
        >
          <span className="label" style={{ color: "red" }}>
            YÊU THÍCH
          </span>
        </div>
        <div className="product__item__text">
          <h6
            style={{
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              overflow: "hidden",
            }}
          >
            {name}
          </h6>
          <div style={{ display: "flex", alignItems: "baseline" }}>
            {countInStock > 0 ? (
              <>
                <strong style={{ color: "rgb(255, 123, 2)", fontSize: "15px" }}>
                  {converPrice(discountedPrice)}
                </strong>
                {discount > 0 ? (
                  <>
                    <span
                      style={{
                        color: "rgba(0, 0, 0, .54)",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        fontSize: "12px",
                        maxWidth: "62px", // Adjust this value based on your needs
                        textDecoration: "line-through",
                        marginLeft: "3px",
                        marginRight: "2px",
                      }}
                    >
                      {converPrice(price)}
                    </span>
                    <span
                      style={{
                        fontSize: "14px",
                        color: "red",
                        backgroundColor: "#feeeea",
                      }}
                    >
                      -{discount}%
                    </span>
                  </>
                ) : (
                  <></>
                )}
              </>
            ) : (
              <strong style={{ color: "rgb(255, 123, 2)" }}>Liên hệ</strong>
            )}
          </div>
          <Rate disabled defaultValue={rating} style={{ fontSize: "12px" }} />{" "}
          <span style={{ fontSize: "12px" }}>
            Đã bán: {formatSelled(selled)}
          </span>
        </div>
        <div className="row">
          <div className="col-md-6">
            <Button
              type="primary"
              onClick={() => setOpen(true)}
              style={{ padding:"14px 30px" }}
            >
              <ShoppingCartOutlined
                style={{
                  display: "inline-flex",
                  fontSize: "16px",
                }}
              />
            </Button>
          </div>
          <div className="col-md-6">
            <ButtonFavouriteComponent
              onClick={handleFavoriteClick}
              isFavourite={isFavourite}
              style={{
                float: "right",
                display: "inline-flex",
                width: "32px",
                color: "#ff0000",
                background: "#fff",
                padding: "0px 0px 0px 5px",
              }}
            />
          </div>
        </div>
        <Modal
          title="Thông tin sản phẩm"
          open={open}
          onCancel={() => setOpen(false)}
          footer={null}
          width={1200}
          style={{ top: 20 }}
        >
          <ProductDetailsContent id={id} />
        </Modal>
      </div>
    </div>
  );
};

export default ProductComponent;
