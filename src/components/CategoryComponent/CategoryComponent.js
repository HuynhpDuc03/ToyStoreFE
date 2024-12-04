import { Checkbox } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const CategoryComponent = ({
  typeProducts,
  handleNavigatetype,
  handlePriceFilterChange,
  selectedPrices,
  handleClearAllPrices,
}) => {
  const {t} = useTranslation();

  return (
    <div className="shop__sidebar">
 

      <div className="shop__sidebar__accordion">
      <div className="accordion" id="accordionExample">
          <div className="card">
            <div className="card-heading">
              <Link data-toggle="collapse" data-target="#collapseOne">
                {t('Category.Categories')} ({typeProducts?.length})
              </Link>
            </div>
            <div
              id="collapseOne"
              className="collapse show"
              data-parent="#accordionExample"
            >
              <div className="card-body">
                <div className="shop__sidebar__categories">
                  <ul className="nice-scroll category-list">
                    {typeProducts?.map((item, index) => {
                      return (
                        <li key={index} style={{textTransform:"capitalize"}}>
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
          <div className="card">
            <div className="card-heading">
              <Link data-toggle="collapse" data-target="#collapseTwo">
              {t('shopPage.price')}
              </Link>
            </div>
            <div
              id="collapseTwo"
              className="collapse show"
              data-parent="#accordionExample1"
            >
              <div className="card-body">
                <div className="shop__sidebar__categories">
                  <ul className="nice-scroll">
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
                        {t('shopPage.below')} 200.000 Đ
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
                        {t('shopPage.above')} 4.000.000 Đ
                      </Checkbox>
                    </li>
                  </ul>
                  {selectedPrices.length > 0 && (
                    <Link
                      onClick={handleClearAllPrices}
                      className="btn-delete-all-price"
                    >
                      {t('Category.removeAll')}
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
