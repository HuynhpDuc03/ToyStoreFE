import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import * as BlogService from "../../services/BlogService";
import LoadingComponent from "../../components/LoadingComponent/LoadingCompoent";
import { useQuery } from "@tanstack/react-query";
import { formatDateBlog } from "../../utils";
import { Pagination } from "antd";

const BlogPage = () => {
  const { t } = useTranslation();
  
  const [pagination, setPagination] = useState({
    page: 1, // Set page to 1 for consistency with antd Pagination
    limit: 9,
    total: 1,
  });

  const fetchBlogAll = async (page, limit) => {
    const res = await BlogService.getAllBlogs(page, limit);
    console.log("res", res);
    setPagination((prevPagination) => ({
      ...prevPagination,
      total: res?.total, // Update total blog count
    }));
    return res;
  };

  const { isLoading, data: blogs } = useQuery({
    queryKey: ["blogs", pagination.page, pagination.limit],
    queryFn: () => fetchBlogAll(pagination.page, pagination.limit),
    keepPreviousData: true, // This will prevent loading between page changes
  });

  const onChangePage = (current, pageSize) => {
    setPagination({
      page: current, // Keep the page 1-based for antd Pagination
      limit: pageSize,
      total: pagination.total, // Maintain the total number of items
    });
  };

  return (
    <LoadingComponent isLoading={isLoading}>
      <section
        className="breadcrumb-blog set-bg"
        style={{
          backgroundImage: `url(${require("../../img/blog/banner-blog-2.png")})`,
        }}
      >
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <h2 style={{ color: "#000" }}>{t("header.ourBlog")}</h2>
            </div>
          </div>
        </div>
      </section>

      <section className="blog spad">
        <div className="container">
          <div className="row">
            {blogs?.data?.map((blog) => (
              <div className="col-lg-4 col-md-6 col-sm-6" key={blog._id}>
                {/* Add key prop */}
                <div className="blog__item">
                  <div
                    className="blog__item__pic set-bg"
                    style={{
                      backgroundImage: `url(${blog?.bannerImage})`,
                    }}
                  ></div>
                  <div className="blog__item__text">
                    <span>
                      <img src="img/icon/calendar.png" alt="" />{" "}
                      {formatDateBlog(blog?.createdAt)}
                    </span>
                    <h5>{blog?.title}</h5>
                    <a href={`/blogDetails/${blog._id}`}>
                      {t("pageHome.readMore")}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Pagination
            current={pagination.page} 
            pageSize={pagination.limit}
            total={pagination.total}
            onChange={onChangePage}
            align="center"
            showTotal={(total) => `${t("pagination.total")} ${total} ${t("pagination.items")}`}
          />
        </div>
      </section>
    </LoadingComponent>
  );
};

export default BlogPage;
