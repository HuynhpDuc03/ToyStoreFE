import { Link, useLocation, useNavigate } from "react-router-dom";
import * as ProductService from "../../services/ProductService";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useDebounce } from "../../hooks/useDebounce";
import { useQuery } from "@tanstack/react-query";
import { searchProduct } from "../../redux/slides/productSlide";
import LoadingComponent from "../../components/LoadingComponent/LoadingCompoent";
import ProductComponent from "../../components/ProductComponent/ProductComponent";
import { Select } from "antd";


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
                      <ProductComponent
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
                      style={{ width: "30%", background:"#000", color: "#fff" }}
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

