import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { searchProduct } from "../../redux/slides/productSlide";
import { Pagination, Select } from "antd";
import ProductComponent from "../../components/ProductComponent/ProductComponent";
import CategoryComponent from "../../components/CategoryComponent/CategoryComponent";
import { useTranslation } from "react-i18next";
import * as ProductService from "../../services/ProductService";
import LoadingComponent from "../../components/LoadingComponent/LoadingCompoent";
import { useNavigate } from "react-router-dom";

const ProductPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [typeProducts, setTypeProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [limit, setLimit] = useState(12);
  const [page, setPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("lowtohigh");
  const [selectedPrices, setSelectedPrices] = useState([]);
  const [selectedType, setSelectedType] = useState(null);
  const navigate = useNavigate();
  const fetchAllTypeProduct = async () => {
    const res = await ProductService.getAllTypeProduct();
    if (res?.status === "OK") {
      setTypeProducts(res?.data);
    }
  };

  const fetchGetAllProduct = async (filters, page, limit) => {
    const res = await ProductService.getAllProduct(filters, page, limit); // Truyền page và limit
    setTotalProducts(res?.total);
    return res;
  };

  const filters = {
    type: selectedType,
    priceRange: selectedPrices,
    sort: sortOrder,
  };

  const { isLoading, data: products } = useQuery({
    queryKey: ["products", page, limit, filters],
    queryFn: () => fetchGetAllProduct(filters, page, limit),
    retry: 3,
    retryDelay: 1000,
    keepPreviousData: true,
  });

  useEffect(() => {
    fetchAllTypeProduct();
  }, []);

  const handleSortingChange = (value) => {
    setSortOrder(value);
    setPage(1); // Reset về trang đầu khi thay đổi sắp xếp
  };

  const handlePageChange = (newPage) => {
    setPage(newPage); // Cập nhật trang hiện tại
  };

  return (
    <div>
      <section className="shop spad">
        <div className="container">
          <div className="row">
            <div className="col-lg-3">
              <CategoryComponent
                onSearch={(e) => dispatch(searchProduct(e.target.value))}
                typeProducts={typeProducts}
                handleNavigatetype={(type) => {
                  setSelectedType(type); // Cập nhật trạng thái loại sản phẩm
                  setPage(1); // Reset về trang đầu khi thay đổi loại sản phẩm
                }}
                handlePriceFilterChange={setSelectedPrices}
                selectedPrices={selectedPrices}
                handleClearAllPrices={() => setSelectedPrices([])}
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
                  <div className="col-lg-6 col-md-6 col-sm-6">
                    <div className="shop__product__option__right">
                      <Select
                        defaultValue={sortOrder}
                        onChange={handleSortingChange}
                      >
                        <Select.Option value="lowtohigh">
                          {t("shopPage.lowToHigh")}
                        </Select.Option>
                        <Select.Option value="hightolow">
                          {t("shopPage.highToLow")}
                        </Select.Option>
                        <Select.Option value="name-asc">
                          {t("shopPage.nameatoz")}
                        </Select.Option>
                        <Select.Option value="name-desc">
                          {t("shopPage.nameztoa")}
                        </Select.Option>
                        <Select.Option value="bestSeller">
                          {t("pageHome.bestSeller")}
                        </Select.Option>
                        <Select.Option value="popular">
                          {t("pageHome.hotSale")}
                        </Select.Option>
                        <Select.Option value="newArrivals">
                          {t("pageHome.newArrivals")}
                        </Select.Option>
                      </Select>
                    </div>
                  </div>
                </div>
                {isLoading ? (
                  <LoadingComponent isLoading={isLoading} />
                ) : (
                  <div className="row">
                    {products?.data?.map((product) => (
                      <ProductComponent
                        key={product?._id}
                        countInStock={product?.countInStock}
                        image={product?.image}
                        name={product?.name}
                        price={product?.price}
                        rating={product?.rating}
                        discount={product?.discount}
                        selled={product?.selled}
                        id={product?._id}
                      />
                    ))}
                  </div>
                )}
                {products?.data?.length > 0 ? (
                  <Pagination
                  align="center"
                    current={page}
                    pageSize={limit}
                    total={totalProducts}
                    onChange={handlePageChange} // Gọi hàm xử lý khi thay đổi trang
                  />
                ) : (
                  <></>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductPage;
