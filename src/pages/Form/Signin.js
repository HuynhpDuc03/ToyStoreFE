
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as UserService from '../../../src/services/UserService'
import { useMutationHooks } from '../../hooks/useMutationHook'
import { Input, message } from "antd";
import { jwtDecode } from 'jwt-decode';
import { useDispatch } from 'react-redux'
import { updateUser } from '../../redux/userSlide';
import { LockOutlined, MailOutlined } from '@ant-design/icons';


const Signin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loginError, setLoginError] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const mutation = useMutationHooks((data) => UserService.loginUser(data));
  
    const { data, isSuccess, isError, error } = mutation;

    useEffect(() => {
        if (isSuccess && data?.status === "OK") {
            message
                .open({
                    type: "loading",
                    content: "Loading...",
                    duration: 0.75,
                })
                .then(() =>
                    setTimeout(() => {
                        message.success("Đăng nhập thành công", 1.5);
                        const redirectURL = localStorage.getItem("redirectURL");
                        if (redirectURL) {
                            localStorage.removeItem("redirectURL");
                            navigate(redirectURL);
                        } else {
                            navigate("/");
                        }
                    }, 750)
                );

            localStorage.setItem("access_token", JSON.stringify(data?.access_token));
            if (data?.access_token) {
                const decoded = jwtDecode(data?.access_token);
                if (decoded?.id) {
                    handleGetDetailUser(decoded?.id, data?.access_token);
                }
            }
        } else if (isError || (isSuccess && data?.status === "ERR")) {
            setLoginError(data?.message || error?.message || "Đăng nhập thất bại");
        }
    }, [isSuccess, isError, error, data, navigate]);
      



    const handleGetDetailUser = async (id, token) => {
      const res = await UserService.getDetailsUser(id, token);
      dispatch(updateUser({ ...res?.data, access_token: token }));
    };
  
    const handleOnchangeEmail = (e) => {
      setEmail(e.target.value);
    };
  
    const handleOnchangePassword = (e) => {
      setPassword(e.target.value);
    };
  
    const handleSignIn = (e) => {
      e.preventDefault();
      setLoginError(null);
      mutation.mutate({
        email,
        password,
      });
    };
  
    const handleNavigateSignUp = () => {
      navigate("/Register");
    };
  


    return (
        <div className='container mt-5 pt-5' style={{ marginBottom: 200}}>
            <div className='row'>
                <div className='col-12 col-sm-8 col-md-6 m-auto'>
                    <div className='card border-0 shadow'>
                        <div className='card-body'>
                            <div className='text-center'>
                              <h2 className='mb-3' style={{fontWeight:"bold"}}>Đăng Nhập</h2>
                                <svg
                                    className='mx-auto'
                                    xmlns='http://www.w3.org/2000/svg'
                                    width='50'
                                    height='50'
                                    fill='currentColor'
                                    class='bi bi-person-circle'
                                    viewBox='0 0 16 16'
                                >
                                    <path d='M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0' />
                                    <path
                                        fill-rule='evenodd'
                                        d='M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1'
                                    />
                                </svg>
                            </div>
                            <form>
                              <Input className='mt-3' type='email' size="large"  value={email}
                                    onChange={handleOnchangeEmail} placeholder="Email" prefix={<MailOutlined />} />
                                <br/>
                              <Input.Password className='mt-3'  size="large"  value={password}
                                    onChange={handleOnchangePassword} placeholder="Password" prefix={<LockOutlined />} />

                             
                                <div className='text-center mt-3'>
                                
                                {loginError && <span  className='nav-link' style={{ color: 'red' }}>Email hoặc Mật khẩu không đúng, Vui lòng thử lại!</span>}
                                    <button

                                        className='btn btn-primary'
                                        onClick={handleSignIn}
                                        disabled={!email.length || !password.length}
                                        style={{width:"50%"}}
                                    >
                                        Đăng Nhập
                                    </button>

                                    <hr width="100%" />
                                    <span
                                        className='nav-link'
                                    
                                    >
                                        Bạn chưa có tài khoản? <span style={{ cursor: 'pointer', fontWeight:"bold", textDecoration:"underline"}} onClick={handleNavigateSignUp}>Đăng ký tài khoản</span>
                                    </span>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signin;




