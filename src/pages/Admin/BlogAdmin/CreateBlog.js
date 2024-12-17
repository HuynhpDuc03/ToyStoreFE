import {
  Button,
  theme,
  Layout,
  Form,
  Input,
  Select,
  Image,
  Upload,
  message,
} from "antd";
import React, { useEffect, useState } from "react";

import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import { Content, Header } from "antd/es/layout/layout";
import * as BlogService from "../../../services/BlogService";
import LoadingComponent from "../../../components/LoadingComponent/LoadingCompoent";
import SiderComponent from "../../../components/SiderComponent/SiderComponent";

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";

const CreateBlog = () => {
  const user = useSelector((state) => state?.user); // Lấy token từ Redux store
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const navigate = useNavigate();
  const [marginLeft, setMarginLeft] = useState(200);
  const [collapsed, setCollapsed] = useState(false);
  const [form] = Form.useForm();
  const [editorValue, setEditorValue] = useState("");
  const [bannerImage, setBannerImage] = useState(null); // State để lưu ảnh banner
  const [tagsOptions, setTagsOptions] = useState([]); // State lưu danh sách các tags có sẵn
  const [selectedTags, setSelectedTags] = useState([]); // State lưu các tag đã chọn

  useEffect(() => {
    // Load các tags có sẵn khi component được render
    const fetchTags = async () => {
      try {
        const response = await BlogService.getAllTags(); // Gọi API lấy tags
        const tags = response?.data?.map((tag) => ({
          label: tag,
          value: tag,
        }));
        setTagsOptions(tags); // Lưu vào state tagsOptions
      } catch (error) {
        console.error("Lỗi khi load tags:", error);
      }
    };

    fetchTags();
  }, []);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
    setMarginLeft(collapsed ? 200 : 80);
  };

  const handleChangeTags = (value) => {
    setSelectedTags(value); // Cập nhật các tag được chọn
  };

  const handleEditorChange = (value) => {
    setEditorValue(value);
  };

  const handleImageChange = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setBannerImage(reader.result); // Lưu ảnh dưới dạng base64 vào state
    };
    reader.readAsDataURL(file); // Chuyển file sang base64
  };
  const handleSubmit = async () => {
    try {
      const formData = {
        title: form.getFieldValue("title"),
        author: form.getFieldValue("author"),
        content: editorValue,
        tags: selectedTags,
        bannerImage: bannerImage, // Ảnh dưới dạng base64
      };

      const response = await BlogService.createBlog(
        formData,
        user?.access_token
      );
      message.destroy()
      message.success("Tạo bài viết thành công");
      form.resetFields();
      setBannerImage(null);
      setEditorValue("");
      setSelectedTags([]);
      navigate("/AdminBlog");
    } catch (error) {
      message.destroy()
      message.error("Lỗi khi tạo bài viết");
    }
  };
  return (
    <LoadingComponent isLoading={false}>
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
              Tạo bài viết
            </h5>
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
              <div className="row">
                <div className="col-md-8">
                  <div className="card">
                    <div className="card-header bg-success">Thông tin</div>
                    <div className="card-body">
                      <Form form={form} layout="vertical">
                        <Form.Item
                          label="Tiêu đề bài viết"
                          required
                          tooltip="This is a required field"
                          name="title"
                        >
                          <Input size="large" placeholder="Tiêu đề" />
                        </Form.Item>
                        <div className="row">
                          <div className="col-md-6">
                            <Form.Item
                              label="Tên tác giả"
                              required
                              tooltip="This is a required field"
                              name="author"
                            >
                              <Input size="large" placeholder="Tên tác giả" />
                            </Form.Item>
                          </div>
                          <div className="col-md-6">
                            <Form.Item
                              label="Chọn thẻ"
                              required
                              tooltip="This is a required field"
                            >
                              <Select
                                mode="tags" // Cho phép nhập tag mới
                                allowClear
                                size="large"
                                style={{ width: "100%" }}
                                placeholder="Vui lòng chọn thẻ"
                                onChange={handleChangeTags}
                                options={tagsOptions} // Load các tags có sẵn từ API
                              />
                            </Form.Item>
                          </div>
                        </div>
                      </Form>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card ">
                    <div className="card-header bg-warning" style={{display:"flex",justifyContent:"space-between"}}><b>Ảnh banner</b>
                    <span style={{marginLeft:"auto"}}>
                        <Upload
                          beforeUpload={(file) => {
                            handleImageChange(file);  
                            return false;  
                          }}
                        >
                          <Button
                            style={{ width: "100%" }}
                            icon={<UploadOutlined />}
                            required="true"
                          >
                            Click to Upload
                          </Button>
                        </Upload>
                      </span>
                    </div>
                    <div className="card-body">
                      <Image
                        style={{ width: "50%", display:"block", margin:"0 auto" }}
                        src={
                          bannerImage
                            ? bannerImage
                            : "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                        }
                      />
                    
                    </div>
                  </div>
         
                </div>
              </div>

              <div className="row">
                <div className="col-md-12 mt-3">
                  <div className="card mb-3">
                    <div className="card-header bg-primary">Nội dung</div>
                    <div
                      className="card-body"
                      style={{ height: "400px", minHeight: "400px" }}
                    >
                      <ReactQuill
                        value={editorValue}
                        onChange={handleEditorChange}
                        
                        placeholder="Nhập nội dung ở đây..."
                        style={{ height: "100%", minHeight: "300px" }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-12 text-end">
                  <Button type="primary" onClick={handleSubmit}>
                    Submit
                  </Button>
                </div>
              </div>
            </div>
          </Content>
        </Layout>
      </Layout>
    </LoadingComponent>
  );
};

export default CreateBlog;
