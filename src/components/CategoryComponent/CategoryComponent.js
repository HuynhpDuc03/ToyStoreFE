import { Checkbox } from "antd";
import React from "react";
import { Link } from "react-router-dom";

const CategoryComponent = ({
  onSearch,
  typeProducts,
  handleNavigatetype,
  handlePriceFilterChange,
  selectedPrices,
  handleClearAllPrices,
}) => {
  return (
    <div className="shop__sidebar">
      <div className="shop__sidebar__search">
        <form>
          <input type="text" placeholder="Tìm kiếm" onChange={onSearch} />
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
                Danh Mục ({typeProducts.length})
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
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <hr />
        <div className="accordion" id="accordionExample1">
          <div class="card">
            <div class="card-heading">
              <Link data-toggle="collapse" data-target="#collapseTwo">
                Giá
              </Link>
            </div>
            <div
              id="collapseTwo"
              class="collapse show"
              data-parent="#accordionExample1"
            >
              <div class="card-body">
                <div class="shop__sidebar__categories">
                  <ul class="nice-scroll">
                    <li>
                      <Checkbox
                        onChange={() => handlePriceFilterChange("0-200000")}
                        checked={selectedPrices.includes("0-200000")}
                        className="slidebar-checkbox"
                        style={{
                          fontSize: "15px",
                          lineHeight: "32px",
                          transition: "all,0.3s",
                        }}
                      >
                        Dưới 200.000 Đ
                      </Checkbox>
                    </li>
                    <li>
                      <Checkbox
                        onChange={() =>
                          handlePriceFilterChange("200000-500000")
                        }
                        checked={selectedPrices.includes("200000-500000")}
                        className="slidebar-checkbox"
                        style={{
                          fontSize: "15px",
                          lineHeight: "32px",
                          transition: "all,0.3s",
                        }}
                      >
                        200.000 Đ - 500.000 Đ
                      </Checkbox>
                    </li>
                    <li>
                      <Checkbox
                        onChange={() =>
                          handlePriceFilterChange("500000-1000000")
                        }
                        checked={selectedPrices.includes("500000-1000000")}
                        className="slidebar-checkbox"
                        style={{
                          fontSize: "15px",
                          lineHeight: "32px",
                          transition: "all,0.3s",
                        }}
                      >
                        500.000 Đ - 1.000.000 Đ
                      </Checkbox>
                    </li>
                    <li>
                      <Checkbox
                        onChange={() =>
                          handlePriceFilterChange("1000000-2000000")
                        }
                        checked={selectedPrices.includes("1000000-2000000")}
                        className="slidebar-checkbox"
                        style={{
                          fontSize: "15px",
                          lineHeight: "32px",
                          transition: "all,0.3s",
                        }}
                      >
                        1.000.000 Đ - 2.000.000 Đ
                      </Checkbox>
                    </li>
                    <li>
                      <Checkbox
                        onChange={() =>
                          handlePriceFilterChange("2000000-4000000")
                        }
                        checked={selectedPrices.includes("2000000-4000000")}
                        className="slidebar-checkbox"
                        style={{
                          fontSize: "15px",
                          lineHeight: "32px",
                          transition: "all,0.3s",
                        }}
                      >
                        2.000.000 Đ - 4.000.000 Đ
                      </Checkbox>
                    </li>
                    <li>
                      <Checkbox
                        onChange={() =>
                          handlePriceFilterChange("4000000-Infinity")
                        }
                        checked={selectedPrices.includes("4000000-Infinity")}
                        className="slidebar-checkbox"
                        style={{
                          fontSize: "15px",
                          lineHeight: "32px",
                          transition: "all,0.3s",
                        }}
                      >
                        Trên 4.000.000 Đ
                      </Checkbox>
                    </li>
                  </ul>
                  {selectedPrices.length > 0 && (
                    <Link
                      onClick={handleClearAllPrices}
                      className="btn-delete-all-price"
                    >
                      Xóa tất cả
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <hr />
      </div>
    </div>
  );
};
export default CategoryComponent;
