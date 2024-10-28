import {
    Button,
    theme,
    Layout
  } from "antd";
  import React, { useEffect, useState } from "react";

  import * as BlogService from "../../../services/BlogService";
  import { useMutationHooks } from "../../../hooks/useMutationHook";

  import * as message from "../../../components/message/message";
  import { useQuery } from "@tanstack/react-query";
  import TableComponent from "../../../components/TableComponent/TableComponent";
  import {

    DeleteOutlined,

    EditOutlined,

    MenuFoldOutlined,
    MenuUnfoldOutlined,

    PlusCircleOutlined,
  } from "@ant-design/icons";
  import { useSelector } from "react-redux";
  import ModalComponent from "../../../components/ModalComponent/ModalComponent";
  import { Content, Header } from "antd/es/layout/layout";
  
import LoadingComponent from "../../../components/LoadingComponent/LoadingCompoent";
import SiderComponent from "../../../components/SiderComponent/SiderComponent";
import { useNavigate } from "react-router-dom";

  
const BlogAdmin = () => {
    const user = useSelector((state) => state?.user);

    const [rowSelected, setRowSelected] = useState("");
    // eslint-disable-next-line no-unused-vars
    const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);

    const mutationDeleted = useMutationHooks((data) => {
      const { id, token } = data;
      const res = BlogService.deleteBlogs(id, token);
      return res;
    });
  
  
    const getAllBlogs = async () => {
      const res = await BlogService.getAllBlogs();
      return res;
    };

    const {
      data: dataDeleted,
      isSuccess: isSuccessDeleted,
      isError: isErrorDeleted,
    } = mutationDeleted;
  
    const queryBlog = useQuery({
      queryKey: ["Blogs"],
      queryFn: getAllBlogs,
    });
 
    const { isLoading: isLoadingBlogs, data: Blogs } = queryBlog;
    const handleClickNavigate = (id) => {
      navigate(`/EditBlog/${id}`);
    };
    const renderAction = (id) => {
      return (
        <div>
          <EditOutlined
            onClick={() => handleClickNavigate(id)}
            style={{ color: "orange", fontSize: "30px", cursor: "pointer" }}
          />
          <DeleteOutlined
            onClick={() => setIsModalOpenDelete(true)}
            style={{ color: "red", fontSize: "30px", cursor: "pointer" }}
          />
        </div>
      );
    };
  
    const columns = [
      {
        title: "Tiêu đề",
        dataIndex: "title",
        width: "25%",
        responsive: ["lg"],
      },
      {
        title: "Tác giả",
        dataIndex: "author",
        width: "25%",
        responsive: ["md"],
      },
      {
        title: "Thẻ",
        dataIndex: "tags",
        width: "25%",
        responsive: ["lg"],
      },
      {
        title: "Chức năng",
        dataIndex: "Action",
        width: "25%",
        responsive: ["md"],
  
        render: (_, record) => renderAction(record.key),
      },
    ];
  
    const dataTable =
      Blogs?.data?.length &&
      Blogs?.data?.map((Blogs) => {
        return {
          ...Blogs,
          key: Blogs._id,
          tags: Blogs.tags.join(', ')
        };
      });
  
  
    useEffect(() => {
      if (isSuccessDeleted && dataDeleted?.status === "OK") {
        message.success("Xóa bài viết thành công !");
        handleCancelDelete();
      } else if (isErrorDeleted) {
        message.error("Có lỗi khi xóa bài viết !");
      }
    }, [isSuccessDeleted, isErrorDeleted]);
  
  
  
    const handleCancelDelete = () => {
      setIsModalOpenDelete(false);
    };
  
    const handleDeleteBlog = () => {
      mutationDeleted.mutate(
        { id: rowSelected, token: user?.access_token },
        {
          onSettled: () => {
            queryBlog.refetch();
          },
        }
      );
    };
  
    const {
      token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const [marginLeft, setMarginLeft] = useState(200);
    const [collapsed, setCollapsed] = useState(false);
  
    const toggleCollapsed = () => {
      setCollapsed(!collapsed);
      setMarginLeft(collapsed ? 200 : 80);
    };


  const navigate = useNavigate();

    return (
      <LoadingComponent isLoading={isLoadingBlogs}>
        <Layout>
          <SiderComponent collapsed={collapsed} user={user} selectKey={"6"} />
          <Layout
            style={{
              height: "100%",
              minHeight: "750px",
              marginLeft: marginLeft,
              transition: "margin-left 0.4s ease",
            }}
          >
            <Header
              style={{
                padding: 0,
                background: colorBgContainer,
              }}
            >
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => toggleCollapsed()}
                style={{
                  fontSize: "16px",
                  width: 64,
                  height: 64,
                }}
              />
              <h5 style={{ display: "inline-block", marginLeft: "20px" }}>
                QUẢN LÝ BÀI VIẾT
              </h5>
              <Button
                type="text"
                icon={
                  <PlusCircleOutlined
                    style={{ fontSize: "26px", color: "green" }}
                  />
                }
                className="btn btn-default"
                onClick={() => navigate("/CreateBlog")}
                style={{
                  width: 64,
                  height: 64,
                  float: "right",
                  marginRight: 80,
                }}
              />
            </Header>
  
            <Content
              style={{
                margin: "24px 16px",
                padding: 24,
                minHeight: 280,
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
              }}
            >
              <div>
    
                <ModalComponent
                  title="Xóa bài viết"
                  open={isModalOpenDelete}
                  onCancel={handleCancelDelete}
                  onOk={handleDeleteBlog}
                >
                  <div>Bạn có chắc bài viết này không</div>
                </ModalComponent>
              </div>
  
              <TableComponent
                columns={columns}
                isLoading={isLoadingBlogs}
                pagination={{
                  position: ["bottomCenter"],
                  pageSize: 7,
                }}
                data={dataTable}
                onRow={(record, rowIndex) => {
                  return {
                    onClick: (event) => {
                      setRowSelected(record._id);
                    },
                  };
                }}
              />
            </Content>
          </Layout>
        </Layout>
      </LoadingComponent>
  )
}

export default BlogAdmin