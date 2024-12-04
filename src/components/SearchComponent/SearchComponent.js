import React, { useEffect, useRef, useState } from "react";
import {  Input } from "antd";
import { Link } from "react-router-dom";
import { SearchOutlined } from "@ant-design/icons";
import { useDebounce } from "../../hooks/useDebounce";
import * as ProductService from "../../services/ProductService";
import { useTranslation } from "react-i18next";
import { converPrice } from "../../utils";

const SearchComponent = () => {
  const { Search } = Input;
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const { t } = useTranslation();
  const searchRef = useRef(null);
  const searchDebounce = useDebounce(searchQuery, 400);

  const fetchSearchResults = async (query) => {
    if (query.trim().length > 0) {
      const res = await ProductService.searchProduct(query);
      setSearchResults(res?.data || []); // Cập nhật kết quả tìm kiếm
    } else {
      setSearchResults([]); // Reset nếu không có từ khóa
    }
  };

  const handleFocus = () => {
    if (searchQuery.trim() && searchResults.length > 0) {
      setIsDropdownVisible(true);
    }
  };

  const closeSearch = () => {
    setIsDropdownVisible(false);
  };

  useEffect(() => {
    fetchSearchResults(searchDebounce); // Gọi API khi debounce thay đổi
  }, [searchDebounce]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        closeSearch();
      }
    };

    if (isDropdownVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownVisible]);

  return (
    <div style={{ padding: "30px 0" }} ref={searchRef}>
      <Search
        placeholder={t("header.search")}
        allowClear
        enterButton={<SearchOutlined />}
        size="large"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onFocus={handleFocus}
      />

      {isDropdownVisible && searchResults.length > 0 && (
        <div className="search-results">
          {searchResults.slice(0, 6).map((item) => (
            <div key={item?._id} className="search-result-item">
              <Link
                to={`/productsDetail/${item._id}`}
                onClick={() => setSearchQuery("")}
              >
                <div className="img-search">
                  <img
                    src={item?.image}
                    alt={item?.name}
                    style={{ width: "100px",height:"100px" }}
                  />
                </div>
                <div className="search-item-price">
                  <p>{item?.name}</p>
                  <p style={{ color: "rgb(255, 123, 2)" }}>
                    {converPrice(item?.price)}
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchComponent;
