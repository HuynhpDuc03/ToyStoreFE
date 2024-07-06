import { Form, Button, Drawer } from "antd";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import InputComponent from "../../components/InputComponent/InputComponent";
import * as UserService from "../../services/UserService";
import { useMutationHooks } from "../../hooks/useMutationHook";
import { WrapperUploadFile } from "../../components/StyleAdmin/Style";
import * as message from "../../components/message/message";
import { useQuery } from "@tanstack/react-query";
import TableComponent from "../../components/TableComponent/TableComponent";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import ModalComponent from "../../components/ModalComponent/ModalComponent";

const UserAdmin = () => {

    const user = useSelector((state) => state?.user);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [rowSelected, setRowSelected] = useState("");
    const [OpenDrawer, setOpenDrawer] = useState(false);
    // eslint-disable-next-line no-unused-vars
    const [isLoadingUpdate, setIsLoaddingUpdate] = useState(false);
    const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
    const inittial = () => ({
        name: "",
        email: "",
        isAdmin: false,
        phone: "",
        address: "",
        city: "",
        district: "",
        ward: "",
    });

    const [stateUser, setStateUser] = useState(inittial());

    const [stateUserDetails, setStateUserDetails] = useState(inittial());

    const [form] = Form.useForm();


    const mutationUpdate = useMutationHooks((data) => {
        const { id, token, ...rests } = data;
        const res = UserService.UpdateUser(id, { ...rests }, token);
        return res;
    });

    const mutationDeleted = useMutationHooks((data) => {
        const { id, token } = data;
        const res = UserService.deleteUser(id, token);
        return res;
    });

    const fetchGetDetailsUser = async (rowSelected) => {
        const res = await UserService.getDetailsUser(rowSelected);
        if (res?.data) {
            setStateUserDetails({
                name: res?.data?.name,
                email: res?.data?.email,
                phone: res?.data?.phone,
                isAdmin: res?.data?.isAdmin,
                address: res?.data?.address,
                city: res?.data?.city,
                district: res?.data?.district,
                ward: res?.data?.ward,
            });
        }
        setIsLoaddingUpdate(false);
    };


    useEffect(() => {
        form.setFieldsValue(stateUserDetails);
    }, [form, stateUserDetails])

    useEffect(() => {
        if (rowSelected && OpenDrawer) {
            setIsLoaddingUpdate(true);
            fetchGetDetailsUser(rowSelected);
        }
    }, [rowSelected, OpenDrawer]);

    // console.log("stateproducts", stateProduct);
    // console.log("stateproductsDetails", stateProductDetail);

    const showDrawer = () => {
        setOpenDrawer(true);
    };

    const onClose = () => {
        setOpenDrawer(false);
    };

    const getAllUsers = async () => {
        const res = await UserService.getAllUSer();
        console.log('res', res)
        return res;
    };

    //const { data, isSuccess, isError } = mutation;
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

    const queryUser = useQuery({
        queryKey: ["users"],
        queryFn: getAllUsers,
    });

    const { isLoading: isLoadingUsers, data: users } = queryUser;
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
            title: "name",
            dataIndex: "name",
        },
        {
            title: "email",
            dataIndex: "email",
        },
        {
            title: "isAdmin",
            dataIndex: "isAdmin",
        },
        {
            title: "phone",
            dataIndex: "phone",
        },
        {
            title: "address",
            dataIndex: "address",
        },
        {
            title: "district",
            dataIndex: "phone",
        },
        {
            title: "city",
            dataIndex: "phone",
        },
        {
            title: "ward",
            dataIndex: "ward",
        },
        {
            title: "Chức năng",
            dataIndex: "Action",
            render: renderAction,
        },
    ];

    const dataTable =
        users?.data?.length &&
        users?.data?.map((user) => {
            return { ...user, key: user._id, isAdmin: user.isAdmin ? "True" : "False" };
        });



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
        setStateUserDetails({
            name: "",
            email: "",
            phone: "",
            isAdmin: false,
            address: "",
            city: "",
            district: "",
            ward: "",
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

    const handleDeleteUser = () => {
        mutationDeleted.mutate(
            { id: rowSelected, token: user?.access_token },
            {
                onSettled: () => {
                    queryUser.refetch();
                },
            }
        );
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setStateUser({
            name: "",
            email: "",
            isAdmin: false,
            phone: "",
            address: "",
            city: "",
            district: "",
            ward: "",
        });
        form.resetFields();
    };



    const hanleOnChange = (e) => {
        setStateUser({
            ...stateUser,
            [e.target.name]: e.target.value,
        });
    };

    const hanleOnChangeDetail = (e) => {
        setStateUserDetails({
            ...stateUserDetails,
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

    // const handleOnchangeAvatar = async ({ fileList }) => {
    //     const fileNames = fileList.map((file) => file.name);
    //     console.log("file names", fileNames);
    //     setStateUser({
    //         ...stateUser,
    //         image: fileNames,
    //     });
    // };

    // const handleOnchangeAvatarDetails = async ({ fileList }) => {
    //     const fileNames = fileList.map((file) => file.name);
    //     setStateProductDetail({
    //         ...stateProductDetail,
    //         image: fileNames,
    //     });
    // };

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

    const onUpdateUser = () => {
        mutationUpdate.mutate(
            { id: rowSelected, token: user?.access_token, ...stateUserDetails },
            {
                onSettled: () => {
                    queryUser.refetch();
                },
            }
        );
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-3">
                    <div
                        className="list-group"
                        style={{ fontWeight: "bold", textAlign: "center" }}
                    >
                        <Link
                            to="/Admin"
                            className="list-group-item list-group-item-action"
                        >
                            Quản lý Sản Phẩm
                        </Link>
                        <Link
                            to="/AdminOrder"
                            className="list-group-item list-group-item-action"
                        >
                            Quản Lý Đơn Hàng
                        </Link>
                        <Link
                            to="/AdminUser"
                            className="list-group-item list-group-item-action"
                        >
                            Quản Lý User
                        </Link>
                    </div>
                </div>
                <div className="col-md-9">
                    <section class="content">
                        <div class="row">
                            <div class="col-12">
                                <div class="card">
                                    <div class="card-header">
                                        <h3
                                            class="card-title"
                                            style={{
                                                textAlign: "center",
                                                fontWeight: "bold",
                                                textTransform: "uppercase",
                                                fontSize: 25,
                                            }}
                                        >
                                            Trang Quản Lý Sản Phẩm Và Đơn Hàng Của Người Dùng
                                        </h3>

                                        <button
                                            type="button"
                                            className="btn btn-success"
                                            style={{ float: "right", marginRight: 70 }}
                                            onClick={() => setIsModalOpen(true)}
                                        >
                                            Thêm
                                        </button>
                                        <div>

                                            <Drawer
                                                title="Chi tiết người dùng"
                                                onClose={onClose}
                                                open={OpenDrawer}
                                                width="90%"
                                            >
                                                <Form
                                                    name="basic"
                                                    labelCol={{ span: 2 }}
                                                    wrapperCol={{ span: 22 }}
                                                    onFinish={onUpdateUser}
                                                    autoComplete="on"
                                                    form={form}
                                                >
                                                    <Form.Item
                                                        label="name"
                                                        name="name"
                                                        rules={[
                                                            {
                                                                required: true,
                                                                message: "Hãy nhập tên sản phẩm!",
                                                            },
                                                        ]}
                                                    >
                                                        <InputComponent
                                                            value={stateUserDetails.name}
                                                            onChange={hanleOnChangeDetail}
                                                            name="name"
                                                        />
                                                    </Form.Item>

                                                    <Form.Item
                                                        label="email"
                                                        name="email"
                                                        rules={[
                                                            { required: true, message: "Hãy nhập mô tả!" },
                                                        ]}
                                                    >
                                                        <InputComponent
                                                            value={stateUserDetails.email}
                                                            onChange={hanleOnChangeDetail}
                                                            name="email"
                                                        />
                                                    </Form.Item>

                                                    <Form.Item
                                                        label="phone"
                                                        name="phone"
                                                        rules={[
                                                            { required: true, message: "Hãy nhập giá tiền!" },
                                                        ]}
                                                    >
                                                        <InputComponent
                                                            value={stateUserDetails.phone}
                                                            onChange={hanleOnChangeDetail}
                                                            name="phone"
                                                        />
                                                    </Form.Item>

                                                    <Form.Item
                                                        label="address"
                                                        name="address"
                                                        rules={[
                                                            { required: true, message: "Hãy nhập thể loại!" },
                                                        ]}
                                                    >
                                                        <InputComponent
                                                            value={stateUserDetails.address}
                                                            onChange={hanleOnChangeDetail}
                                                            name="address"
                                                        />
                                                    </Form.Item>

                                                    <Form.Item
                                                        label="city"
                                                        name="city"
                                                        rules={[
                                                            { required: true, message: "Hãy nhập đánh giá!" },
                                                        ]}
                                                    >
                                                        <InputComponent
                                                            value={stateUserDetails.city}
                                                            onChange={hanleOnChangeDetail}
                                                            name="city"
                                                        />
                                                    </Form.Item>

                                                    <Form.Item
                                                        label="district"
                                                        name="district"
                                                        rules={[
                                                            { required: true, message: "Hãy nhập giảm giá!" },
                                                        ]}
                                                    >
                                                        <InputComponent
                                                            value={stateUserDetails.district}
                                                            onChange={hanleOnChangeDetail}
                                                            name="district"
                                                        />
                                                    </Form.Item>

                                                    <Form.Item
                                                        label="ward"
                                                        name="ward"
                                                        rules={[
                                                            {
                                                                required: true,
                                                                message: "Hãy nhập số lượng hàng tồn",
                                                            },
                                                        ]}
                                                    >
                                                        <InputComponent
                                                            value={stateUserDetails.ward}
                                                            onChange={hanleOnChangeDetail}
                                                            name="ward"
                                                        />
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
                                                title="Xóa người dùng"
                                                open={isModalOpenDelete}
                                                onCancel={handleCancelDelete}
                                                onOk={handleDeleteUser}
                                            >
                                                <div>Bạn có chắc xóa tài khoản này không</div>
                                            </ModalComponent>
                                        </div>
                                    </div>

                                    <div class="card-body">
                                        {/* --Table-- */}

                                        <TableComponent
                                            columns={columns}
                                            isLoading={isLoadingUsers}
                                            data={dataTable}
                                            onRow={(record, rowIndex) => {
                                                return {
                                                    onClick: (event) => {
                                                        setRowSelected(record._id);
                                                    },
                                                };
                                            }}
                                        />

                                        {/* --End Table-- */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default UserAdmin