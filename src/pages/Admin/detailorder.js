import React from 'react'
import { Link } from 'react-router-dom'

const detailorder = () => {
    return (
        <div className="container">
            <h3 className="text-center" style={{ fontWeight: 'bold', marginBottom: '15px' }}>CHI TIẾT ĐƠN HÀNG</h3>
            <table className="table table-bordered">
                <tbody>
                    <tr>
                        <th scope="row">Tên Đơn Hàng</th>
                        <td>Toys</td>
                    </tr>

                    <tr>
                        <th scope="row">Số Lượng</th>
                        <td>5</td>
                    </tr>

                    <tr>
                        <th scope="row">Giá Tiền</th>
                        <td>1200</td>
                    </tr>

                    <tr>
                        <th scope="row">Mã Sản Phẩm</th>
                        <td>0123</td>
                    </tr>

                    <tr>
                        <th scope="row">Địa Chỉ</th>
                        <td>10</td>
                    </tr>

                    <tr>
                        <th scope="row">Mã Khách Hàng</th>
                        <td>1</td>
                    </tr>

                    <tr>
                        <th scope="row">Họ và tên</th>
                        <td>ben</td>
                    </tr>

                    <tr>
                        <th scope="row">Số điện thoại</th>
                        <td>10%</td>
                    </tr>

                    <tr>
                        <th scope="row">Phương Thức Thanh Toán</th>
                        <td>PayPal</td>
                    </tr>

                    <tr>
                        <th scope="row">Giá Mặt Hàng</th>
                        <td>201012</td>
                    </tr>
                    <tr>
                        <th scope="row">Tổng Tiền</th>
                        <td>120000</td>
                    </tr>
                    <tr>
                        <th scope="row">Thanh Toán</th>
                        <td><input type="checkbox" name="NewArrival" value="Yes" className="form-check-input" style={{ marginLeft: '0px' }} checked='true' /></td>
                    </tr>
                    <tr>
                        <th scope="row">Ngày Thanh Toán</th>
                        <td>2024/04/30</td>
                    </tr>

                    <tr>
                        <th scope="row">Giao Hàng</th>
                        <td><input type="checkbox" name="NewArrival" value="Yes" className="form-check-input" style={{ marginLeft: '0px' }} checked='true' /></td>
                    </tr>

                    <tr>
                        <th scope="row">Ngày Giao</th>
                        <td>2024/04/30</td>
                    </tr>

                    <tr>
                        <th scope="row">Hình Ảnh</th>
                        <td>
                            <img src={require('../../img/banner/banner-1.jpg')} alt='' className='img-fluid' style={{ width: '100px' }} />
                        </td>
                    </tr>

                </tbody>
            </table>
            <div className="text-right" style={{ marginBottom: '15px' }}>
                <Link to='/AdminOrder'>
                    <button type="submit" className="btn btn-secondary">
                        Quay về trang đơn hàng
                    </button>
                </Link>
            </div>
        </div>
    )
}

export default detailorder