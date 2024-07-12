import { Form, Button, Drawer, theme, Layout, Menu } from "antd";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import InputComponent from "../../components/InputComponent/InputComponent";
import * as ProductService from "../../services/ProductService";
import { useMutationHooks } from "../../hooks/useMutationHook";
import { WrapperUploadFile } from "../../components/StyleAdmin/Style";
import * as message from "../../components/message/message";
import { useQuery } from "@tanstack/react-query";
import TableComponent from "../../components/TableComponent/TableComponent";
import {
  DeleteOutlined,
  EditOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import ModalComponent from "../../components/ModalComponent/ModalComponent";
import { Content, Header } from "antd/es/layout/layout";

import { converPrice, truncateDescription } from "../../utils";
import SiderComponent from "../../components/SiderComponent/SiderComponent";
import TextArea from "antd/es/input/TextArea";
import LoadingComponent from "../../components/LoadingComponent/LoadingCompoent";

const Admin = () => {
  const user = useSelector((state) => state?.user);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rowSelected, setRowSelected] = useState("");
  const [OpenDrawer, setOpenDrawer] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [isLoadingUpdate, setIsLoaddingUpdate] = useState(false);
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const [loadingDrawer, setLoadingDrawer] = useState(true);

  const inittial = () => ({
    name: "",
    price: "",
    description: "",
    rating: "",
    image: [],
    type: "",
    discount: "",
    countInStock: "",
  });

  const [stateProduct, setStateProduct] = useState(inittial());

  const [stateProductDetail, setStateProductDetail] = useState(inittial());

  const [form] = Form.useForm();

  const mutation = useMutationHooks((data) => {
    const {
      name,
      price,
      description,
      rating,
      image,
      type,
      discount,
      countInStock,
    } = data;
    const res = ProductService.createProduct({
      name,
      price,
      description,
      rating,
      image,
      type,
      discount,
      countInStock,
    });
    return res;
  });

  const mutationUpdate = useMutationHooks((data) => {
    const { id, token, ...rests } = data;
    const res = ProductService.updateProduct(id, token, { ...rests });
    return res;
  });

  const mutationDeleted = useMutationHooks((data) => {
    const { id, token } = data;
    const res = ProductService.deleteProduct(id, token);
    return res;
  });

  const fetchGetDetailsProduct = async (rowSelected) => {
    const res = await ProductService.getDetailsProduct(rowSelected);
    if (res?.data) {
      setStateProductDetail({
        name: res?.data?.name,
        price: res?.data?.price,
        description: res?.data?.description,
        rating: res?.data?.rating,
        image: res?.data?.image,
        type: res?.data?.type,
        discount: res?.data?.discount,
        countInStock: res?.data?.countInStock,
      });
    }
    setIsLoaddingUpdate(false);
  };

  useEffect(() => {
    if (!isModalOpen) {
      form.setFieldsValue(stateProductDetail);
    } else {
      form.setFieldsValue(inittial());
    }
  }, [form, stateProductDetail, isModalOpen]);

  useEffect(() => {
    if (rowSelected && OpenDrawer) {
      setIsLoaddingUpdate(true);
      fetchGetDetailsProduct(rowSelected);
    }
  }, [rowSelected, OpenDrawer]);

  console.log("stateproducts", stateProduct);
  console.log("stateproductsDetails", stateProductDetail);

  const showDrawer = () => {
    setOpenDrawer(true);
    setLoadingDrawer(true);
    setTimeout(() => {
      setLoadingDrawer(false);
    }, 1000);
  };

  const onClose = () => {
    setOpenDrawer(false);
  };

  const getAllProducts = async () => {
    const res = await ProductService.getAllProduct();
    return res;
  };

  const { data, isSuccess, isError } = mutation;
  const {
    data: dataUpdated,
    isSuccess: isSuccessUpdated,
    isError: isErrorUpdated,
  } = mutationUpdate;
  const {
    data: dataDeleted,
    isSuccess: isSuccessDeleted,
    isError: isErrorDeleted,
  } = mutationDeleted;
  console.log("dataUpdated", dataUpdated);

  const queryProduct = useQuery({
    queryKey: ["products"],
    queryFn: getAllProducts,
  });

  const { isLoading: isLoadingProducts, data: products } = queryProduct;
  const renderAction = () => {
    return (
      <div>
        <EditOutlined
          onClick={showDrawer}
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
      title: "Tên sản phẩm",
      dataIndex: "name",
      width: "30%",
      responsive: ['lg']

    },
    {
      title: "Giá tiền",
      dataIndex: "price",
      width: "10%",
      responsive: ['md']

    },
    {
      title: "Mô tả",
      dataIndex: "description",
      width: "40%",
      responsive: ['lg']
    },
    {
      title: "Đánh giá",
      dataIndex: "rating",
      width: "10%",
      responsive: ['md']

    },
    {
      title: "Chức năng",
      dataIndex: "Action",
      width: "10%",
      responsive: ['md'],


      render: renderAction,
    },
  ];

  const dataTable =
    products?.data?.length &&
    products?.data?.map((products) => {
      return { ...products, key: products._id,price: converPrice(products.price),description:truncateDescription(products.description, 100)};
    });

  useEffect(() => {
    if (isSuccess && data?.status === "OK") {
      message.success();
      handleCancel();
    } else if (isError) {
      message.error();
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isSuccessDeleted && dataDeleted?.status === "OK") {
      message.success();
      handleCancelDelete();
    } else if (isErrorDeleted) {
      message.error();
    }
  }, [isSuccessDeleted]);

  const handleCloseDrawer = () => {
    setOpenDrawer(false);
    setStateProductDetail({
      name: "",
      price: "",
      description: "",
      rating: "",
      image: "",
      type: "",
      discount: "",
      countInStock: "",
    });
    form.resetFields();
  };

  useEffect(() => {
    if (isSuccessUpdated && dataUpdated?.status === "OK") {
      message.success();
      handleCloseDrawer();
    } else if (isErrorUpdated) {
      message.error();
    }
  }, [isSuccessUpdated]);

  const handleCancelDelete = () => {
    setIsModalOpenDelete(false);
  };

  const handleDeleteProduct = () => {
    mutationDeleted.mutate(
      { id: rowSelected, token: user?.access_token },
      {
        onSettled: () => {
          queryProduct.refetch();
        },
      }
    );
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setStateProduct({
      name: "",
      price: "",
      description: "",
      rating: "",
      image: "",
      type: "",
      discount: "",
      countInStock: "",
    });
    form.resetFields();
  };

  const onFinish = () => {
    mutation.mutate(stateProduct, {
      onSettled: () => {
        queryProduct.refetch();
      },
    });
  };

  const hanleOnChange = (e) => {
    setStateProduct({
      ...stateProduct,
      [e.target.name]: e.target.value,
    });
  };

  const hanleOnChangeDetail = (e) => {
    setStateProductDetail({
      ...stateProductDetail,
      [e.target.name]: e.target.value,
    });
  };

  //     const handleOnchangeAvatar = async (e) => {
  //         const file = e.target.files[0]
  //    // const file = fileList[0];
  //         // if (!file.url && !file.preview) {
  //         //     file.preview = await getBase64(file.originFileObj);
  //         // }
  //         console.log("file",file.preview)
  //         setStateProduct({
  //             ...stateProduct,
  //             image: file
  //         })
  //     }

  const handleOnchangeAvatar = async ({ fileList }) => {
    const fileNames = fileList.map((file) => file.name);
    console.log("file names", fileNames);
    setStateProduct({
      ...stateProduct,
      image: fileNames,
    });
  };

  const handleOnchangeAvatarDetails = async ({ fileList }) => {
    const fileNames = fileList.map((file) => file.name);
    setStateProductDetail({
      ...stateProductDetail,
      image: fileNames,
    });
  };

  // const handleOnchangeAvatarDetails = async ({ fileList }) => {
  //   const file = fileList[0];
  //   if (!file.url && !file.preview) {
  //       file.preview = await getBase64(file.originFileObj);
  //   }
  //   setStateProductDetail({
  //     ...stateProductDetail,
  //     image: file.preview,
  //   });
  // };

  const onUpdateProducts = () => {
    mutationUpdate.mutate(
      { id: rowSelected, token: user?.access_token, ...stateProductDetail },
      {
        onSettled: () => {
          queryProduct.refetch();
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
  return (
    <LoadingComponent isLoading={isLoadingProducts}>
    <Layout>
      <SiderComponent collapsed={collapsed} user={user} selectKey={"1"}/>
      <Layout  style={{
          height: "100%",
          minHeight: "750px",
          marginLeft: marginLeft,
          transition: "margin-left 0.4s ease"
        }}>
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
          <h5 style={{display:"inline-block",marginLeft:"20px"}}>QUẢN LÝ SẢN PHẨM</h5>
          <Button
            type="text"
            icon={<PlusCircleOutlined style={{fontSize:"26px", color:"green"}} />}
            className="btn btn-default"
            onClick={() => setIsModalOpen(true)}
            style={{
             
              width: 64,
              height: 64,
              float: "right", 
              marginRight: 80 
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
              forceRender
              title="Thêm sản phẩm"
              open={isModalOpen}
              onCancel={handleCancel}
              footer={null}
            >
              <Form
                name="basic"
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
                onFinish={onFinish}
                autoComplete="on"
                form={form}
              >
                <Form.Item
                  label="Tên sản phẩm"
                  name="name"
                  rules={[
                    {
                      required: true,
                      message: "Hãy nhập tên sản phẩm!",
                    },
                  ]}
                  wrapperCol={{ offset: 4, span: 16 }}
                >
                  <InputComponent
                    value={stateProduct.name}
                    onChange={hanleOnChange}
                    name="name"
                  />
                </Form.Item>

                <Form.Item
                  label="Mô tả"
                  name="description"
                  rules={[{ required: true, message: "Hãy nhập mô tả!" }]}
                  wrapperCol={{ offset: 4, span: 16 }}
                >
                  <InputComponent
                    value={stateProduct.description}
                    onChange={hanleOnChange}
                    name="description"
                  />
                </Form.Item>

                <Form.Item
                  label="Giá tiền"
                  name="price"
                  rules={[{ required: true, message: "Hãy nhập giá tiền!" }]}
                  wrapperCol={{ offset: 4, span: 16 }}
                >
                  <InputComponent
                    value={stateProduct.price}
                    onChange={hanleOnChange}
                    name="price"
                  />
                </Form.Item>

                <Form.Item
                  label="Thể loại"
                  name="type"
                  rules={[{ required: true, message: "Hãy nhập thể loại!" }]}
                  wrapperCol={{ offset: 4, span: 16 }}
                >
                  <InputComponent
                    value={stateProduct.type}
                    onChange={hanleOnChange}
                    name="type"
                  />
                </Form.Item>

                <Form.Item
                  label="Đánh giá"
                  name="rating"
                  rules={[{ required: true, message: "Hãy nhập đánh giá!" }]}
                  wrapperCol={{ offset: 4, span: 16 }}
                >
                  <InputComponent
                    value={stateProduct.rating}
                    onChange={hanleOnChange}
                    name="rating"
                  />
                </Form.Item>

                <Form.Item
                  label="Giảm giá"
                  name="discount"
                  rules={[{ required: true, message: "Hãy nhập giảm giá!" }]}
                  wrapperCol={{ offset: 4, span: 16 }}
                >
                  <InputComponent
                    value={stateProduct.discount}
                    onChange={hanleOnChange}
                    name="discount"
                  />
                </Form.Item>

                <Form.Item
                  label="Hàng tồn kho"
                  name="countInStock"
                  rules={[
                    {
                      required: true,
                      message: "Hãy nhập số lượng hàng tồn",
                    },
                  ]}
                  wrapperCol={{ offset: 4, span: 16 }}
                >
                  <InputComponent
                    value={stateProduct.countInStock}
                    onChange={hanleOnChange}
                    name="countInStock"
                  />
                </Form.Item>

                <Form.Item
                  label="Image"
                  name="image"
                  rules={[
                    {
                      required: true,
                      message: "Please input your count image!",
                    },
                  ]}
                >
                  <WrapperUploadFile
                    multiple
                    name="image"
                    listType="picture"
                    accept=".png, .jpeg, .jpg"
                    showUploadList={true}
                    onChange={handleOnchangeAvatar}
                  >
                    <Button>Select File</Button>
                    {/* {stateProduct?.image && (
                                <img
                                  src={require('../../img/product/' +  stateProduct?.image)}
                                  style={{
                                    height: "60px",
                                    width: "60px",
                                    borderRadius: "50%",
                                    objectFit: "cover",
                                    marginLeft: "10px",
                                  }}
                                  alt="avatar"
                                />
                              )} */}
                  </WrapperUploadFile>
                </Form.Item>
                <Form.Item wrapperCol={{ offset: 16, span: 16 }}>
                  <Button type="primary" htmlType="submit">
                    Submit
                  </Button>
                  <Button style={{ marginLeft: 8 }} onClick={handleCancel}>
                    Cancel
                  </Button>
                </Form.Item>
              </Form>
            </ModalComponent>
            
            <Drawer
              title="Cập nhật sản phẩm"
              onClose={onClose}
              open={OpenDrawer}
              loading={loadingDrawer}
              width="60%"
            >
              <Form
                name="basic"
                labelCol={{ span: 2 }}
                wrapperCol={{ span: 22 }}
                onFinish={onUpdateProducts}
                autoComplete="on"
                form={form}
              >
                <Form.Item
                  label="Tên sản phẩm"
                  name="name"
                  rules={[
                    {
                      required: true,
                      message: "Hãy nhập tên sản phẩm!",
                    },
                  ]}
                >
                  <InputComponent
                    value={stateProductDetail.name}
                    onChange={hanleOnChangeDetail}
                    name="name"
                  />
                </Form.Item>

                <Form.Item
                  label="Mô tả"
                  name="description"
                  rules={[{ required: true, message: "Hãy nhập mô tả!" }]}
                >
                  <TextArea rows={4} value={stateProductDetail.description}
                    onChange={hanleOnChangeDetail}
                    name="description"/>
                </Form.Item>

                <Form.Item
                  label="Giá tiền"
                  name="price"
                  rules={[{ required: true, message: "Hãy nhập giá tiền!" }]}
                >
                  <InputComponent
                    value={stateProductDetail.price}
                    onChange={hanleOnChangeDetail}
                    name="price"
                  />
                </Form.Item>

                <Form.Item
                  label="Thể loại"
                  name="type"
                  rules={[{ required: true, message: "Hãy nhập thể loại!" }]}
                >
                  <InputComponent
                    size={50}
                    value={stateProductDetail.type}
                    onChange={hanleOnChangeDetail}
                    name="type"
                  />
                </Form.Item>

                <Form.Item
                  label="Đánh giá"
                  name="rating"
                  rules={[{ required: true, message: "Hãy nhập đánh giá!" }]}
                >
                  <InputComponent
                    value={stateProductDetail.rating}
                    onChange={hanleOnChangeDetail}
                    name="rating"
                  />
                </Form.Item>

                <Form.Item
                  label="Giảm giá"
                  name="discount"
                  rules={[{ required: true, message: "Hãy nhập giảm giá!" }]}
                >
                  <InputComponent
                    value={stateProductDetail.discount}
                    onChange={hanleOnChangeDetail}
                    name="discount"
                  />
                </Form.Item>

                <Form.Item
                  label="tồn kho"
                  name="countInStock"
                  rules={[
                    {
                      required: true,
                      message: "Hãy nhập số lượng hàng tồn",
                    },
                  ]}
                >
                  <InputComponent
                    value={stateProductDetail.countInStock}
                    onChange={hanleOnChangeDetail}
                    name="countInStock"
                  />
                </Form.Item>

                <Form.Item
                  label="Image"
                  name="image"
                  rules={[
                    {
                      required: true,
                      message: "Please input your count image!",
                    },
                  ]}
                >
                  <WrapperUploadFile
                    multiple
                    name="image"
                    listType="picture"
                    accept=".png, .jpeg, .jpg"
                    showUploadList={true}
                    onChange={handleOnchangeAvatarDetails}
                  >
                    <Button>Select File</Button>
                    {stateProductDetail?.image?.length > 0 && (
                      <ul style={{ listStyle: "none" }}>
                        {stateProductDetail?.image?.map((fileName) => (
                          <li
                            key={fileName}
                            style={{
                              height: "66px",
                              width: "354px",
                              padding: "8px",
                              border: " 1px solid #d9d9d9",
                              borderRadius: "8px",

                              marginBottom: "8px",
                            }}
                          >
                            <img
                              src={require("../../img/product/" + fileName)}
                              style={{
                                height: "60px",
                                width: "60px",
                                borderRadius: "50%",
                                objectFit: "cover",
                                marginLeft: "10px",
                              }}
                              alt="avatar"
                            />{" "}
                            {fileName}
                          </li>
                        ))}
                      </ul>
                    )}
                  </WrapperUploadFile>
                </Form.Item>
                <Form.Item wrapperCol={{ offset: 20, span: 20 }}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{ width: "90%" }}
                  >
                    Apply
                  </Button>
                </Form.Item>
              </Form>
            </Drawer>

            <ModalComponent
              title="Xóa sản phẩm"
              open={isModalOpenDelete}
              onCancel={handleCancelDelete}
              onOk={handleDeleteProduct}
            >
              <div>Bạn có chắc xóa sản phẩm này không</div>
            </ModalComponent>
          </div>

          <TableComponent
            columns={columns}
            isLoading={isLoadingProducts}

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
  );
};

export default Admin;
