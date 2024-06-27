import { Link, useLocation, useNavigate } from "react-router-dom";
import * as ProductService from "../../services/ProductService";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useDebounce } from "../../hooks/useDebounce";
import { useQuery } from "@tanstack/react-query";
import { converPrice } from "../../utils";
import { Button, Modal, Rate, Select } from "antd";
import { searchProduct } from "../../redux/slides/productSlide";
import LoadingComponent from "../../components/LoadingComponent/LoadingCompoent";
import ProductDetailsContent from "./ProductDetailsModal";
import { ShoppingCartOutlined } from "@ant-design/icons";


const ProductType = () => {
  const { state } = useLocation();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const onSearch = (e) => {
    dispatch(searchProduct(e.target.value));
  };

  const Productsearch = useSelector((state) => state?.product?.search);
  const searchDebounce = useDebounce(Productsearch, 200);
  const handleNavigatetype = (type) => {
    navigate(
      `/products/${type
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        ?.replace(/ /g, "_")}`,
      { state: type }
    );
  };

  const [limit, setLimit] = useState(4); //mac dinh web 8sp
  const [typeProducts, setTypeProducts] = useState([]);
  const [sortOrder, setSortOrder] = useState();

  const fetchProductType = async (context) => {
    const limit = context?.queryKey && context?.queryKey[1];
    const type = context?.queryKey && context?.queryKey[2];
    const sort = context?.queryKey && context?.queryKey[3];
    const res = await ProductService.getProductType(type, limit, searchDebounce, sort);
    return res;
};


  const fetchAllTypeProduct = async () => {
    const res = await ProductService.getAllTypeProduct();
    if (res?.status === "OK") {
      setTypeProducts(res?.data);
    }
  };

  useEffect(() => {
    fetchAllTypeProduct();
  }, []);

  const { isLoading,data: products } = useQuery({
    queryKey: ["products", limit, state,sortOrder],
    queryFn: fetchProductType,
    retry: 3,
    retryDelay: 1000,
    keepPreviousData: true,
});


  const handlePriceRangersChange = (value) => {
    setSortOrder(value);
  };

  return (
    <LoadingComponent isLoading={isLoading}>
      {/* <!-- Breadcrumb Section Begin --> */}
      <section className="breadcrumb-option">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="breadcrumb__text">
                <h4>Shop</h4>
                <div className="breadcrumb__links">
                  <Link to="/">Home</Link>
                  <span>Shop</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* <!-- Breadcrumb Section End --> */}

      {/* <!-- Shop Section Begin --> */}
      <section className="shop spad">
        <div className="container">
          <div className="row">
            <div className="col-lg-3">
              <div className="shop__sidebar">
                <div className="shop__sidebar__search">
                  <form>
                    <input
                      type="text"
                      placeholder="Tìm kiếm"
                      onChange={onSearch}
                    />
                    <button type="submit">
                      <span className="icon_search"></span>
                    </button>
                  </form>
                </div>
                <div className="shop__sidebar__accordion">
                  <div className="accordion" id="accordionExample">
                    <div class="card">
                      <div class="card-heading">
                        <Link data-toggle="collapse" data-target="#collapseOne">
                          Danh Mục
                        </Link>
                      </div>
                      <div
                        id="collapseOne"
                        class="collapse show"
                        data-parent="#accordionExample"
                      >
                        <div class="card-body">
                          <div class="shop__sidebar__categories">
                            <ul class="nice-scroll">
                              {typeProducts.map((item) => {
                                return (
                                  <li>
                                    <Link
                                      onClick={(e) => {
                                        e.preventDefault();
                                        handleNavigatetype(item);
                                      }}
                                    >
                                      {item}
                                    </Link>
                                  </li>
                                );
                              })}
                              <li></li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-9">
              <div className="shop__product__option">
                <div className="row">
                  <div className="col-lg-6 col-md-6 col-sm-6">
                    <div className="shop__product__option__left">
                      <p>Tổng: {products?.data?.length} kết quả</p>
                    </div>
                  </div>
                  <div class="col-lg-6 col-md-6 col-sm-6">
                    <div class="shop__product__option__right">
                      <p>Xếp theo: {"     "}</p>
                      <Select 
                        defaultValue="lowtohigh"
                        dropdownStyle={{width:"120px"}}
                        
                        onChange={handlePriceRangersChange}
                        options={[
                          {
                            value: "lowtohigh",
                            label: "Giá tăng dần",
                          },
                          {
                            value: "hightolow",
                            label: "Giá giảm dần",
                          },
                          {
                            value: "name-asc",
                            label: "Tên A-Z",
                          },
                          {
                            value: "name-desc",
                            label: "Tên Z-A",
                          },
                          {
                            value: "bestSeller",
                            label: "Bán chạy",
                          },
                          {
                            value: "hotSale",
                            label: "Giảm giá",
                          },
                          {
                            value: "newArrivals",
                            label: "Hàng mới",
                          },
                        ]}
                      />
                     
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                {products?.data
                  ?.filter((pro) => {
                    if (searchDebounce === "") {
                      return pro;
                    } else if (
                      pro?.name
                        ?.toLowerCase()
                        ?.includes(searchDebounce?.toLowerCase())
                    ) {
                      return pro;
                    }
                  })
                  .map((product) => {
                    return (
                      <ProductwithType
                        key={product._id}
                        countInStock={product.countInStock}
                        description={product.description}
                        image={product.image[0]}
                        name={product.name}
                        price={product.price}
                        rating={product.rating}
                        type={product.type}
                        discount={product.discount}
                        id={product._id}
                        selled={product.selled}
                      />
                    );
                  })}
              </div>
              <div className="row">
                <div className="col-lg-12">
                  <div className="product__pagination">
                    <button
                      type="button"
                      style={{ width: "30%" }}
                      className="btn btn-primary"
                      disabled={
                        products?.total === products?.data?.length ||
                        products?.totalPage === 1
                      }
                      onClick={() => setLimit((prev) => prev + 4)}
                    >
                      Xem Thêm
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* <!-- Shop Section End --> */}
    </LoadingComponent>
  );
};
export default ProductType;

const ProductwithType = (props) => {
  const { image, name, price, rating, discount, id, selled, countInStock } = props;
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
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
          backgroundImage: `url(${require("../../img/product/" + image)})`,
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
            <strong style={{ color: "rgb(255, 123, 2)" }}>Liên hệ</strong>
          )}
        </div>
        <Rate disabled defaultValue={rating} style={{ fontSize: "12px" }} />{" "}
        <span style={{ fontSize: "12px" }}>
          Đã bán: {formatSelled(selled)}
        </span>
      </div>
      <Button icon={<ShoppingCartOutlined style={{fontSize:"18px"}}/>} onClick={() => setOpen(true)} type="default" className="primary-btn" style={{width:"50%", maxHeight:"100%"}}>
    
      </Button>
      <Modal
        title="Thông tin sản phẩm"
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        width={1200}
        style={{ top: 20 }}
      >
        <ProductDetailsContent
          id={id} 
         
        />
      </Modal>
    </div>
  </div>
  );
};
