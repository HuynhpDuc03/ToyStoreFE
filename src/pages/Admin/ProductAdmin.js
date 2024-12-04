import {
  Form,
  Button,
  Drawer,
  theme,
  Layout,
  Select,
  InputNumber,
  Col,
  Row,
  Table,
  message,
  Checkbox,
} from "antd";
import React, { useEffect, useState } from "react";
import InputComponent from "../../components/InputComponent/InputComponent";
import * as ProductService from "../../services/ProductService";
import { useMutationHooks } from "../../hooks/useMutationHook";
import { WrapperUploadFile } from "../../components/StyleAdmin/Style";
import { useQuery } from "@tanstack/react-query";
import {
  AuditOutlined,
  CheckOutlined,
  DeleteOutlined,
  DollarOutlined,
  EditOutlined,
  FileTextOutlined,
  InboxOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PercentageOutlined,
  PlusCircleOutlined,
  StarOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import ModalComponent from "../../components/ModalComponent/ModalComponent";
import { Content, Header } from "antd/es/layout/layout";

import { converPrice, renderOptions, truncateDescription } from "../../utils";
import SiderComponent from "../../components/SiderComponent/SiderComponent";
import TextArea from "antd/es/input/TextArea";
import LoadingComponent from "../../components/LoadingComponent/LoadingCompoent";
import imageCompression from "browser-image-compression";

const ProductAdmin = () => {
  const user = useSelector((state) => state?.user);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rowSelected, setRowSelected] = useState("");
  const [OpenDrawer, setOpenDrawer] = useState(false);

  const [isLoadingUpdate, setIsLoaddingUpdate] = useState(false);
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const [loadingDrawer, setLoadingDrawer] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(7);

  const inittial = () => ({
    name: "",
    price: "",
    description: "",
    rating: "",
    image: [],
    type: "",
    discount: "",
    countInStock: "",
    bestSeller: false,
    hotSale: false,
    newArrivals: false,
  });

  const [stateProduct, setStateProduct] = useState(inittial());

  const [stateProductDetail, setStateProductDetail] = useState(inittial());

  const [form] = Form.useForm();

  const mutationCreate = useMutationHooks((data) => {
    return ProductService.createProduct(data);
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
        name: res?.data?.product?.name,
        price: res?.data?.product?.price,
        description: res?.data?.product?.description,
        rating: res?.data?.product?.rating,
        image: res?.data?.product?.image,
        type: res?.data?.product?.type,
        discount: res?.data?.product?.discount,
        countInStock: res?.data?.product?.countInStock,
        bestSeller: res?.data?.product?.bestSeller,
        hotSale: res?.data?.product?.hotSale,
        newArrivals: res?.data?.product?.newArrivals,
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
    return ProductService.getAllProductAdmin(currentPage, pageSize);
  };

  const fetchAllTypeProduct = async () => {
    const res = await ProductService.getAllTypeProduct();
    return res;
  };
  const { data, isSuccess, isError } = mutationCreate;
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

  const queryProduct = useQuery({
    queryKey: ["products", { page: currentPage, limit: pageSize }],
    queryFn: getAllProducts,
    keepPreviousData: true,
  });
  const typeProduct = useQuery({
    queryKey: ["type-product"],
    queryFn: fetchAllTypeProduct,
  });
  const { isLoading: isLoadingProducts, data: products } = queryProduct;

  const handleTableChange = (pagination) => {
    setCurrentPage(pagination.current);
  };

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
      responsive: ["lg"],
    },
    {
      title: "Giá tiền",
      dataIndex: "price",
      width: "20%",
      responsive: ["md"],
    },
    {
      title: "Thể loại",
      dataIndex: "type",
      width: "20%",
      responsive: ["lg"],
    },
    {
      title: "Tồn kho",
      dataIndex: "countInStock",
      width: "10%",
      responsive: ["lg"],
    },
    {
      title: "Đánh giá",
      dataIndex: "rating",
      width: "10%",
      responsive: ["md"],
    },
    {
      title: "Chức năng",
      dataIndex: "Action",
      width: "10%",
      responsive: ["md"],

      render: renderAction,
    },
  ];

  const dataTable =
    products?.data?.length &&
    products?.data?.map((products) => {
      return {
        ...products,
        key: products._id,
        price: converPrice(products.price),
      };
    });

  useEffect(() => {
    if (isSuccess && data?.status === "OK") {
      message.destroy();
      message.success("Thêm sản phẩm mới thành công !");
      handleCancel();
    } else if (isError) {
      message.destroy();
      message.error("Có lỗi khi thêm sản phẩm !");
    }
  }, [isSuccess, isError]);

  useEffect(() => {
    if (isSuccessDeleted && dataDeleted?.status === "OK") {
      message.destroy();
      message.success("Xóa sản phẩm thành công !");
      handleCancelDelete();
    } else if (isErrorDeleted) {
      message.destroy();
      message.error("Có lỗi khi xóa sản phẩm !");
    }
  }, [isSuccessDeleted, isErrorDeleted]);

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
      message.destroy();
      message.success("Cập nhật thông tin thành công !");
      handleCloseDrawer();
    } else if (isErrorUpdated) {
      message.destroy();
      message.error("Đã xảy ra lỗi khi cập nhật thông tin !!!");
    }
  }, [isSuccessUpdated, isErrorUpdated]);

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

  const onFinish = () => {
    const params = {
      name: stateProduct.name,
      price: stateProduct.price,
      description: stateProduct.description,
      rating: stateProduct.rating,
      image: stateProduct.image,
      type:
        stateProduct.type === "add_type"
          ? stateProduct.newType
          : stateProduct.type,
      discount: stateProduct.discount,
      countInStock: stateProduct.countInStock,
    };
    mutationCreate.mutate(params, {
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

  const handleOnchangeAvatar = async ({ fileList }) => {
    try {
      // Resize và nén hình ảnh
      const compressedFiles = await Promise.all(
        fileList.map(async (file) => {
          const compressedFile = await imageCompression(file.originFileObj, {
            maxSizeMB: 0.5, // Giới hạn kích thước (1MB)
            maxWidthOrHeight: 600, // Giới hạn chiều rộng/cao tối đa
            useWebWorker: true, // Sử dụng Web Worker để cải thiện hiệu suất
          });

          // Chuyển file nén thành base64
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(compressedFile);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
          });
        })
      );

      setStateProduct({
        ...stateProduct,
        image: compressedFiles, // Base64 của ảnh đã resize/compress
      });
    } catch (error) {
      console.error("Error resizing image:", error);
    }
  };

  // const handleOnchangeAvatarDetails = async ({ fileList }) => {
  //   try {
  //     const compressedFiles = await Promise.all(
  //       fileList.map(async (file) => {
  //         const compressedFile = await imageCompression(file.originFileObj, {
  //           maxSizeMB: 0.5,
  //           maxWidthOrHeight: 600,
  //           useWebWorker: true,
  //         });

  //         return new Promise((resolve, reject) => {
  //           const reader = new FileReader();
  //           reader.readAsDataURL(compressedFile);
  //           reader.onload = () => resolve(reader.result);
  //           reader.onerror = (error) => reject(error);
  //         });
  //       })
  //     );

  //     setStateProductDetail({
  //       ...stateProductDetail,
  //       image: compressedFiles,
  //     });
  //   } catch (error) {
  //     console.error('Error resizing image:', error);
  //   }
  // };
  const handleOnchangeAvatarDetails = async ({ fileList }) => {
    try {
      const compressedFiles = await Promise.all(
        fileList.map(async (file) => {
          const compressedFile = await imageCompression(file.originFileObj, {
            maxSizeMB: 0.5, // Giới hạn kích thước (0.5MB)
            maxWidthOrHeight: 600, // Giới hạn chiều rộng/cao tối đa
            useWebWorker: true,
          });

          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(compressedFile);
            reader.onload = () => {
              resolve(reader.result);
            };
            reader.onerror = (error) => reject(error);
          });
        })
      );

      setStateProductDetail({
        ...stateProductDetail,
        image: compressedFiles, // Cập nhật hình ảnh đã nén
      });
    } catch (error) {
      console.error("Error resizing image:", error);
    }
  };

  // const handleOnchangeAvatar = async ({ fileList }) => {
  //   const base64Images = await Promise.all(
  //     fileList.map((file) => {
  //       return new Promise((resolve, reject) => {
  //         const reader = new FileReader();
  //         reader.readAsDataURL(file.originFileObj);
  //         reader.onload = () => {
  //           resolve(reader.result);
  //         };
  //         reader.onerror = (error) => {
  //           reject(error);
  //         };
  //       });
  //     })
  //   );
  //   setStateProduct({
  //     ...stateProduct,
  //     image: base64Images,
  //   });
  // };

  // const handleOnchangeAvatarDetails = async ({ fileList }) => {
  //   const base64Images = await Promise.all(
  //     fileList.map((file) => {
  //       return new Promise((resolve, reject) => {
  //         const reader = new FileReader();
  //         reader.readAsDataURL(file.originFileObj);
  //         reader.onload = () => {
  //           resolve(reader.result);
  //         };
  //         reader.onerror = (error) => {
  //           reject(error);
  //         };
  //       });
  //     })
  //   );
  //   setStateProductDetail({
  //     ...stateProductDetail,
  //     image: base64Images,
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

  const handleChangeSelect = (value) => {
    setStateProduct({
      ...stateProduct,
      type: value,
    });
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

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setStateProduct(inittial()); // Khởi tạo lại stateProduct
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setStateProduct(inittial()); // Khởi tạo lại stateProduct khi đóng modal
    form.resetFields(); // Đặt lại các trường trong form
  };

  useEffect(() => {
    if (!isModalOpen) {
      form.setFieldsValue(stateProductDetail);
    } else {
      form.resetFields(); // Đặt lại các trường trong form khi mở modal
    }
  }, [form, stateProductDetail, isModalOpen]);

  return (
    <LoadingComponent isLoading={isLoadingProducts}>
      <Layout>
        <SiderComponent collapsed={collapsed} user={user} selectKey={"2"} />
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
              QUẢN LÝ SẢN PHẨM
            </h5>
            <Button
              type="text"
              icon={
                <PlusCircleOutlined
                  style={{ fontSize: "26px", color: "green" }}
                />
              }
              className="btn btn-default"
              onClick={handleOpenModal}
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
                forceRender
                title="Thêm sản phẩm"
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
                style={{
                  top: 20,
                }}
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
                    wrapperCol={{ offset: 1, span: 19 }}
                  >
                    <InputComponent
                      prefix={<InboxOutlined />}
                      value={stateProduct.name}
                      onChange={hanleOnChange}
                      name="name"
                    />
                  </Form.Item>

                  <Form.Item
                    label="Mô tả"
                    name="description"
                    rules={[{ required: true, message: "Hãy nhập mô tả!" }]}
                    wrapperCol={{ offset: 1, span: 19 }}
                  >
                    <TextArea
                      prefix={<FileTextOutlined />}
                      rows={4}
                      value={stateProduct.description}
                      onChange={hanleOnChange}
                      name="description"
                    />
                  </Form.Item>

                  <Form.Item
                    label="Giá tiền"
                    name="price"
                    rules={[{ required: true, message: "Hãy nhập giá tiền!" }]}
                    wrapperCol={{ offset: 1, span: 19 }}
                  >
                    <InputNumber
                      min={1000}
                      step={1000}
                      prefix={<DollarOutlined />}
                      value={stateProduct.price}
                      formatter={(value) =>
                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }
                      parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                      onChange={(value) =>
                        hanleOnChange({ target: { name: "price", value } })
                      }
                      name="price"
                      style={{ width: "100%" }}
                    />
                  </Form.Item>

                  <Form.Item
                    label="Thể loại"
                    name="type"
                    rules={[{ required: true, message: "Hãy nhập thể loại!" }]}
                    wrapperCol={{ offset: 1, span: 19 }}
                  >
                    <Select
                      suffixIcon={<UnorderedListOutlined />}
                      name="type"
                      menuItemSelectedIcon={<CheckOutlined />}
                      value={stateProduct.type}
                      onChange={handleChangeSelect}
                      options={renderOptions(typeProduct?.data?.data)}
                    />
                  </Form.Item>
                  {stateProduct.type === "add_type" && (
                    <Form.Item
                      label="Thể loại"
                      name="new_type"
                      rules={[
                        { required: true, message: "Hãy nhập thể loại!" },
                      ]}
                      wrapperCol={{ offset: 1, span: 19 }}
                    >
                      <InputComponent
                        value={stateProduct.newType}
                        onChange={hanleOnChange}
                        name="newType"
                      />
                    </Form.Item>
                  )}
                  <Form.Item
                    label="Đánh giá"
                    name="rating"
                    rules={[{ required: true, message: "Hãy nhập đánh giá!" }]}
                    wrapperCol={{ offset: 1, span: 19 }}
                  >
                    <InputNumber
                      min={0}
                      max={5}
                      value={stateProduct.rating}
                      step={0.1}
                      prefix={<StarOutlined />}
                      onChange={(value) =>
                        hanleOnChange({ target: { name: "rating", value } })
                      }
                      defaultValue="0"
                      name="rating"
                      style={{ width: "100%" }}
                    />
                  </Form.Item>

                  <Form.Item
                    label="Giảm giá"
                    name="discount"
                    rules={[{ required: true, message: "Hãy nhập giảm giá!" }]}
                    wrapperCol={{ offset: 1, span: 19 }}
                  >
                    <InputNumber
                      min={0}
                      max={100}
                      step={5}
                      prefix={<PercentageOutlined />}
                      value={stateProduct.discount}
                      onChange={(value) =>
                        hanleOnChange({ target: { name: "discount", value } })
                      }
                      defaultValue="0"
                      name="discount"
                      style={{ width: "100%" }}
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
                    wrapperCol={{ offset: 1, span: 19 }}
                  >
                    <InputNumber
                      min={10}
                      step={10}
                      prefix={<AuditOutlined />}
                      value={stateProduct.countInStock}
                      defaultValue="100"
                      onChange={(value) =>
                        hanleOnChange({
                          target: { name: "countInStock", value },
                        })
                      }
                      name="countInStock"
                      style={{ width: "100%" }}
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
                width="70%"
              >
                <Form
                  name="basic"
                  labelCol={{ span: 3 }}
                  wrapperCol={{ span: 21 }}
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
                      prefix={<InboxOutlined />}
                      value={stateProductDetail.name}
                      onChange={hanleOnChangeDetail}
                      name="name"
                    />
                  </Form.Item>

                  <Form.Item
                    label="Thể loại"
                    name="type"
                    rules={[{ required: true, message: "Hãy nhập thể loại!" }]}
                  >
                    <InputComponent
                      size={50}
                      prefix={<UnorderedListOutlined />}
                      value={stateProductDetail.type}
                      onChange={hanleOnChangeDetail}
                      name="type"
                    />
                  </Form.Item>

                  <Form.Item
                    label="Mô tả"
                    name="description"
                    rules={[{ required: true, message: "Hãy nhập mô tả!" }]}
                  >
                    <TextArea
                      rows={4}
                      value={stateProductDetail.description}
                      onChange={hanleOnChangeDetail}
                      name="description"
                    />
                  </Form.Item>
                  <Row gutter={20}>
                    <Col span={6} offset={1}>
                      <Form.Item
                        label="Giá tiền"
                        labelCol={2}
                        name="price"
                        rules={[
                          { required: true, message: "Hãy nhập giá tiền!" },
                        ]}
                      >
                        <InputNumber
                          min={1}
                          prefix={<DollarOutlined />}
                          value={stateProductDetail.price}
                          onChange={(value) =>
                            hanleOnChangeDetail({
                              target: { name: "price", value },
                            })
                          }
                          name="price"
                          style={{ width: "100%", marginLeft: "12px" }}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item
                        label="Giảm giá"
                        name="discount"
                        labelCol={2}
                        rules={[
                          { required: true, message: "Hãy nhập giảm giá!" },
                        ]}
                      >
                        <InputNumber
                          min={0}
                          max={100}
                          prefix={<PercentageOutlined />}
                          value={stateProductDetail.discount}
                          onChange={(value) =>
                            hanleOnChangeDetail({
                              target: { name: "discount", value },
                            })
                          }
                          name="discount"
                          style={{ width: "100%" }}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col span={6} offset={1}>
                      <Form.Item
                        label="Best Seller"
                        name="bestSeller"
                        labelCol={2}
                        valuePropName="checked" // Để lấy giá trị checked của checkbox
                      >
                        <Checkbox
                          checked={stateProductDetail.bestSeller}
                          onChange={(e) =>
                            hanleOnChangeDetail({
                              target: {
                                name: "bestSeller",
                                value: e.target.checked,
                              },
                            })
                          }
                        />
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item
                        label="Hot Sale"
                        labelCol={2}
                        name="hotSale"
                        valuePropName="checked"
                      >
                        <Checkbox
                          checked={stateProductDetail.hotSale}
                          onChange={(e) =>
                            hanleOnChangeDetail({
                              target: {
                                name: "hotSale",
                                value: e.target.checked,
                              },
                            })
                          }
                        />
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item
                        label="New Arrivals"
                        labelCol={2}
                        name="newArrivals"
                        valuePropName="checked"
                      >
                        <Checkbox
                          checked={stateProductDetail.newArrivals}
                          onChange={(e) =>
                            hanleOnChangeDetail({
                              target: {
                                name: "newArrivals",
                                value: e.target.checked,
                              },
                            })
                          }
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={20}>
                    <Col span={6} offset={1}>
                      <Form.Item
                        label="Đánh giá"
                        name="rating"
                        labelCol={2}
                        rules={[
                          { required: true, message: "Hãy nhập đánh giá!" },
                        ]}
                      >
                        <InputNumber
                          min={0}
                          max={5}
                          step={0.1}
                          prefix={<StarOutlined />}
                          value={stateProductDetail.rating}
                          onChange={(value) =>
                            hanleOnChangeDetail({
                              target: { name: "rating", value },
                            })
                          }
                          name="rating"
                          style={{ width: "100%" }}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item
                        label="Tồn kho"
                        name="countInStock"
                        labelCol={2}
                        rules={[
                          {
                            required: true,
                            message: "Hãy nhập số lượng hàng tồn",
                          },
                        ]}
                      >
                        <InputNumber
                          min={0}
                          value={stateProductDetail.countInStock}
                          prefix={<AuditOutlined />}
                          onChange={(value) =>
                            hanleOnChangeDetail({
                              target: { name: "countInStock", value },
                            })
                          }
                          name="countInStock"
                          style={{ width: "100%" }}
                        />
                      </Form.Item>
                    </Col>
                  </Row>

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
                        <ul style={{ listStyle: "none", marginTop: "10px" }}>
                          {stateProductDetail?.image?.map(
                            (fileBase64, index) => (
                              <li
                                key={index}
                                style={{
                                  height: "66px",
                                  width: "354px",
                                  padding: "8px",
                                  border: "1px solid #d9d9d9",
                                  borderRadius: "8px",
                                  marginBottom: "8px",
                                }}
                              >
                                <img
                                  src={fileBase64}
                                  style={{
                                    height: "60px",
                                    width: "60px",
                                    borderRadius: "50%",
                                    objectFit: "cover",
                                    marginLeft: "10px",
                                  }}
                                  alt="avatar"
                                />
                              </li>
                            )
                          )}
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

            <Table
              columns={columns}
              dataSource={dataTable || []}
              loading={isLoadingProducts}
              rowKey="_id"
              pagination={{
                current: currentPage,
                pageSize: pageSize,
                total: products?.total || 0,
                position: ["bottomCenter"],
              }}
              onRow={(record, rowIndex) => {
                return {
                  onClick: (event) => {
                    setRowSelected(record._id);
                  },
                };
              }}
              onChange={handleTableChange}
            />
          </Content>
        </Layout>
      </Layout>
    </LoadingComponent>
  );
};

export default ProductAdmin;
