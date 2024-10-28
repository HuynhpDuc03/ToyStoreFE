import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as ProductService from "../../services/ProductService";
import { useDispatch, useSelector } from "react-redux";
import { searchProduct } from "../../redux/slides/productSlide";
import { Select, Skeleton } from "antd";
import { useDebounce } from "../../hooks/useDebounce";
import LoadingComponent from "../../components/LoadingComponent/LoadingCompoent";
import ProductComponent from "../../components/ProductComponent/ProductComponent";
import CategoryComponent from "../../components/CategoryComponent/CategoryComponent";
import { useTranslation } from "react-i18next";

const ProductPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleNavigatetype = (type) => {
    navigate(
      `/products/${type
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        ?.replace(/ /g, "_")}`,
      { state: type }
    );
  };
  const onSearch = (e) => {
    dispatch(searchProduct(e.target.value));
  };

  const Productsearch = useSelector((state) => state?.product?.search);
  const searchDebounce = useDebounce(Productsearch, 400);
  const [limit, setLimit] = useState(8);
  const [typeProducts, setTypeProducts] = useState([]);
  const [sortOrder, setSortOrder] = useState();

  const [selectedPrices, setSelectedPrices] = useState([]);
  const [totalProducts, setTotalProducts] = useState([]);
  const fetchProductAll = async (context) => {
    const limit = context?.queryKey && context?.queryKey[1];
    const search = context?.queryKey && context?.queryKey[2];
    const sort = context?.queryKey && context?.queryKey[3];
    const price = context?.queryKey && context?.queryKey[4];
    const res = await ProductService.getAllProduct(search, limit, sort, price);
    setTotalProducts(res.total);
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

  const { isLoading, data: products } = useQuery({
    queryKey: ["products", limit, searchDebounce, sortOrder, selectedPrices],
    queryFn: fetchProductAll,
    retry: 3,
    retryDelay: 500,
    keepPreviousData: true,
  });

  const handleSortingChange = (value) => {
    setSortOrder(value);
  };

  const handlePriceFilterChange = (range) => {
    setSelectedPrices((prevSelectedPrices) => {
      if (prevSelectedPrices.includes(range)) {
        return prevSelectedPrices.filter((price) => price !== range);
      } else {
        return [...prevSelectedPrices, range];
      }
    });
  };

  const handleClearAllPrices = () => {
    setSelectedPrices([]);
  };

  return (
    <div>
      {/* <!-- Breadcrumb Section Begin --> */}
      <section className="breadcrumb-option">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="breadcrumb__text">
                <h4>{t("header.shop")}</h4>
                <div className="breadcrumb__links">
                  <Link to="/">{t("header.home")}</Link>
                  <span>{t("header.shop")}</span>
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
              <CategoryComponent
                onSearch={onSearch}
                typeProducts={typeProducts}
                handleNavigatetype={handleNavigatetype}
                handlePriceFilterChange={handlePriceFilterChange}
                selectedPrices={selectedPrices}
                handleClearAllPrices={handleClearAllPrices}
              />
            </div>
            <div className="col-lg-9">
              <div className="shop__product__option">
                <div className="row">
                  <div className="col-lg-6 col-md-6 col-sm-6">
                    <div className="shop__product__option__left">
                      <p>
                        {t("shopPage.total")} {totalProducts}{" "}
                        {t("shopPage.result")}
                      </p>
                    </div>
                  </div>
                  <div class="col-lg-6 col-md-6 col-sm-6">
                    <div class="shop__product__option__right">
                      <p>{t("shopPage.sort")}</p>
                      <Select
                        defaultValue="lowtohigh"
                        dropdownStyle={{ width: "140px" }}
                        onChange={handleSortingChange}
                        options={[
                          {
                            value: "lowtohigh",
                            label: t("shopPage.lowToHigh"),
                          },
                          {
                            value: "hightolow",
                            label: t("shopPage.highToLow"),
                          },
                          {
                            value: "name-asc",
                            label: t("shopPage.nameatoz"),
                          },
                          {
                            value: "name-desc",
                            label: t("shopPage.nameztoa"),
                          },
                          {
                            value: "bestSeller",
                            label: t("pageHome.bestSeller"),
                          },
                          {
                            value: "popular",
                            label: t("pageHome.hotSale"),
                          },
                          {
                            value: "newArrivals",
                            label: t("pageHome.newArrivals"),
                          },
                        ]}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {isLoading ? (
                <>
                  <Skeleton active paragraph={{ rows: 2 }} />
                  <Skeleton active paragraph={{ rows: 2 }} />
                  <Skeleton active paragraph={{ rows: 2 }} />
                  <Skeleton active paragraph={{ rows: 2 }} />
                  <Skeleton active paragraph={{ rows: 2 }} />
                </>
              ) : (
                <>
                  <div className="row">
                    {products?.data?.map((product) => {
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
                          selled={product.selled}
                          id={product._id}
                        />
                      );
                    })}
                  </div>
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="product__pagination">
                        <button
                          type="button"
                          style={{
                            width: "30%",
                          }}
                          className="btn btn-primary"
                          disabled={
                            products?.total === products?.data?.length ||
                            products?.totalPage === 1
                          }
                          onClick={() => setLimit((prev) => prev + 4)}
                        >
                          {t("pageHome.readMore")}
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
      {/* <!-- Shop Section End --> */}
    </div>
  );
};

export default ProductPage;
