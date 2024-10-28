import {
  Button,
  theme,
  Layout,
  Form,
  Input,
  Select,
  Image,
  Upload,
} from "antd";
import React, { useEffect, useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import { Content, Header } from "antd/es/layout/layout";
import LoadingComponent from "../../../components/LoadingComponent/LoadingCompoent";
import SiderComponent from "../../../components/SiderComponent/SiderComponent";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate, useParams } from "react-router-dom";
import * as BlogService from "../../../services/BlogService"; // Adjust path to BlogService

const EditBlog = () => {
  const { id } = useParams();
  const user = useSelector((state) => state?.user);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [marginLeft, setMarginLeft] = useState(200);
  const [collapsed, setCollapsed] = useState(false);
  const [form] = Form.useForm();
  const [editorValue, setEditorValue] = useState("");
  const [tagsOptions, setTagsOptions] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [bannerImage, setBannerImage] = useState(null);
  const navigate = useNavigate();

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
    setMarginLeft(collapsed ? 200 : 80);
  };

  useEffect(() => {
    const fetchBlogDetails = async () => {
      try {
        const response = await BlogService.getDetailBlogs(id); // Fetch blog details
        const blog = response?.data;
        form.setFieldsValue({
          title: blog.title,
          author: blog.author,
        });
        setEditorValue(blog.content);
        setSelectedTags(blog.tags || []);
        setBannerImage(blog.bannerImage);
      } catch (error) {
        console.error("Error fetching blog details:", error);
      }
    };

    const fetchTags = async () => {
      try {
        const response = await BlogService.getAllTags(); // Fetch all tags
        const tags = response?.data?.map((tag) => ({
          label: tag, // Direct tag name
          value: tag,
        }));
        setTagsOptions(tags);
      } catch (error) {
        console.error("Error loading tags:", error);
      }
    };

    fetchBlogDetails();
    fetchTags();
  }, [id, form]);

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
        bannerImage: bannerImage,
      };

      const response = await BlogService.updateBlogs(
        id,
        user?.access_token,
        formData
      );
      console.log("Blog updated successfully:", response);
      navigate("/AdminBlog");
    } catch (error) {
      console.error("Error updating blog:", error);
    }
  };

  const handleEditorChange = (value) => {
    setEditorValue(value);
  };

  const handleTagChange = (value) => {
    setSelectedTags(value);
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
              Chỉnh sửa bài viết
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
            <div className="container">
              <div className="row">
                <div className="col-md-8">
                  <div className="card">
                    <div className="card-header bg-success">Thông tin</div>
                    <div className="card-body">
                      <Form form={form} layout="vertical">
                        <Form.Item
                          label="Tiêu đề bài viết"
                          name="title"
                          required
                          tooltip="This is a required field"
                        >
                          <Input placeholder="Tiêu đề" />
                        </Form.Item>
                        <div className="row">
                          <div className="col-md-6">
                            <Form.Item
                              label="Tên tác giả"
                              name="author"
                              required
                              tooltip="This is a required field"
                            >
                              <Input placeholder="Tên tác giả" />
                            </Form.Item>
                          </div>
                          <div className="col-md-6">
                            <Form.Item
                              label="Chọn thẻ"
                              required
                              tooltip="This is a required field"
                            >
                              <Select
                                mode="multiple"
                                allowClear
                                style={{
                                  width: "100%",
                                }}
                                placeholder="Please select"
                                value={selectedTags}
                                onChange={handleTagChange}
                                options={tagsOptions}
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
                    <div className="card-header bg-warning">Ảnh banner</div>
                    <div className="card-body">
                      {bannerImage ? (
                        <Image
                          style={{ width: "350px", height: "125px" }}
                          src={bannerImage} // Hiển thị ảnh base64
                        />
                      ) : (
                        <p>No banner image</p>
                      )}
                      <div className="mt-3">
                        <Upload
                          beforeUpload={(file) => {
                            handleImageChange(file); // Gọi hàm để chuyển ảnh
                            return false; // Ngăn không cho upload trực tiếp lên server
                          }}
                        >
                          <Button
                            style={{ width: "100%" }}
                            icon={<UploadOutlined />}
                          >
                            Click to Upload
                          </Button>
                        </Upload>
                      </div>
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
                  <Form form={form} layout="vertical">
                    <Form.Item>
                      <Button type="primary" onClick={handleSubmit}>
                        Submit
                      </Button>
                    </Form.Item>
                  </Form>
                </div>
              </div>
            </div>
          </Content>
        </Layout>
      </Layout>
    </LoadingComponent>
  );
};

export default EditBlog;
