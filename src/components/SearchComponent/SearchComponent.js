import React, { useEffect, useRef, useState } from "react";
import { converPrice } from "../../utils";
import { Button, Input } from "antd";
import { Link } from "react-router-dom";
import { SearchOutlined } from "@ant-design/icons";
import { useDebounce } from "../../hooks/useDebounce";
import * as ProductService from "../../services/ProductService";
import { useTranslation } from "react-i18next";

const SearchComponent = () => {
  const { Search } = Input;
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const { t } = useTranslation();
  const searchRef = useRef(null);
  const searchDebounce = useDebounce(searchQuery, 200);

  const fetchSearchResults = async (query) => {
    if (query) {
      const res = await ProductService.searchProduct(query);
      setSearchResults(res.data);
    } else {
      setSearchResults([]);
    }
  };

  const handleViewAll = () => {};

  useEffect(() => {
    fetchSearchResults(searchDebounce);
  }, [searchDebounce]);

  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  // Xử lý việc hiển thị dropdown khi có kết quả tìm kiếm
  useEffect(() => {
    if (searchQuery.trim()) {
      setIsDropdownVisible(true);
    } else {
      setIsDropdownVisible(false);
    }
  }, [searchQuery]);

  const closeSearch = () => {
    setIsDropdownVisible(false);
  };

  // Khi nhấn vào ô tìm kiếm, nếu có ký tự tìm kiếm, hiển thị lại dropdown
  const handleFocus = () => {
    if (searchQuery.trim() && searchResults.length > 0) {
      setIsDropdownVisible(true);
    }
  };

  // Detect clicks outside the search box
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        closeSearch(); // Close the dropdown if click happens outside
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
          {/* <div className="view-all">
            <Button
              size="large"
              className="view-all-btn"
              onClick={handleViewAll}
            >
              View all {searchResults.length} products
            </Button>
          </div> */}
          <p className="sub-title-search">Sản phẩm gợi ý</p>

          {searchResults.slice(0, 6).map((item) => (
            <div key={item.id} className="search-result-item">
              <Link
                to={`/productsDetail/${item._id}`}
                onClick={() => setSearchQuery("")}
              >
                <div className="img-search">
                  <img
                    src={item.image[0]}
                    alt={item.name}
                    style={{ width: "100px" }}
                  />
                </div>
                <div className="search-item-price">
                  <p>{item.name}</p>
                  <p style={{ color: "rgb(255, 123, 2)" }}>
                    {converPrice(item.price)}
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
