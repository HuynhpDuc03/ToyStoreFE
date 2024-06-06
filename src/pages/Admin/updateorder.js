import React from 'react'
import { Link } from 'react-router-dom'
const updateorder = () => {
    return (
        <div className="container">
            <form>
                <h3 className="text-center" style={{ fontWeight: 'bold', marginBottom: '15px' }}>CẬP NHẬT ĐƠN HÀNG</h3>
                <table className="table table-bordered">
                    <tbody>
                        <tr>
                            <th scope="row">Tên Đơn Hàng</th>
                            <td>
                                <input type="text" name="title" className="form-control" />
                            </td>
                        </tr>

                        <tr>
                            <th scope="row">Số Lượng</th>
                            <td>
                                <input type="text" name="Description" className="form-control" />
                            </td>
                        </tr>

                        <tr>
                            <th scope="row">Giá Tiền</th>
                            <td>
                                <input type="text" name="Price" className="form-control" />
                            </td>
                        </tr>

                        <tr>
                            <th scope="row">Mã Sản Phẩm</th>
                            <td>
                                <input type="text" name="Price" className="form-control" />
                            </td>
                        </tr>

                        <tr>
                            <th scope="row">Địa Chỉ</th>
                            <td>
                                <input type="text" name="Quantity" className="form-control" />
                            </td>
                        </tr>

                        <tr>
                            <th scope="row">Mã Khách Hàng</th>
                            <td>
                                <input type="text" name="Rate" className="form-control" />
                            </td>
                        </tr>

                        <tr>
                            <th scope="row">Họ và tên</th>
                            <td>
                                <input type="text" name="Discount" className="form-control" />
                            </td>
                        </tr>

                        <tr>
                            <th scope="row">Phương Thức Thanh Toán</th>
                            <td>
                                <input type="text" name="Discount" className="form-control" />
                            </td>
                        </tr>

                        <tr>
                            <th scope="row">Giá Mặt Hàng</th>
                            <td>
                                <input type="text" name="Discount" className="form-control" />
                            </td>
                        </tr>

                        <tr>
                            <th scope="row">Tổng Tiền</th>
                            <td>
                                <input type="text" name="Discount" className="form-control" />
                            </td>
                        </tr>

                        <tr>
                            <th scope="row">Thanh Toán</th>
                            <td><input type="checkbox" name="NewArrival" value="Yes" className="form-check-input" style={{ marginLeft: '0px' }} /></td>
                        </tr>

                        <tr>
                            <th scope="row">Ngày Thanh Toán</th>
                            <td>
                                <input type="text" name="Discount" className="form-control" />
                            </td>
                        </tr>

                        <tr>
                            <th scope="row">Giao Hàng</th>
                            <td><input type="checkbox" name="NewArrival" value="Yes" className="form-check-input" style={{ marginLeft: '0px' }} /></td>
                        </tr>

                        <tr>
                            <th scope="row">Ngày Giao</th>
                            <td>
                                <input type="text" name="Discount" className="form-control" />
                            </td>
                        </tr>

                        <tr>
                            <th scope="row">Hình Ảnh</th>
                            <td>
                                <div className="custom-file">
                                    <input type="file" id="fileInput" className="custom-file-input" />
                                    <label className="custom-file-label" htmlFor="fileInput">Chọn Hình Ảnh</label>
                                </div>
                            </td>
                        </tr>

                        <tr>
                            <td colSpan="2" className="text-center">
                                <button type="submit" className="btn btn-primary mr-2">
                                    Cập nhật đơn hàng
                                </button>
                                <Link to='/Admin'>
                                    <button type="submit" className="btn btn-secondary">
                                        Quay về trang Admin
                                    </button>
                                </Link>

                            </td>
                        </tr>
                    </tbody>
                </table>
            </form>
        </div>
    )
}

export default updateorder