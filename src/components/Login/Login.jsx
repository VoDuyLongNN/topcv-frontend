import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import './Login.css';

const Login = () => {
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [message, setMessage] = useState('');
   const [messageType, setMessageType] = useState('');
   const [responseData, setResponseData] = useState('');
   const [isLoading, setIsLoading] = useState(false);
   const [errors, setErrors] = useState({});
   const navigate = useNavigate();

   const validate = () => {
      const newErrors = {};

      const emailPattern = /^[a-zA-Z0-9_+&*-]+(?:\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,7}$/;
      if (!email) {
         newErrors.email = 'Email không được để trống';
      } else if (!emailPattern.test(email)) {
         newErrors.email = 'Email không đúng định dạng';
      }

      if (!password) {
         newErrors.password = 'Mật khẩu không được để trống';
      } else if (password.length < 8 || password.length > 30) {
         newErrors.password = 'Mật khẩu phải nằm trong khoảng 8 đến 30 ký tự';
      }

      return newErrors;
   };

   const handleSubmit = async (e) => {
      e.preventDefault();

      const validationErrors = validate();
      if (Object.keys(validationErrors).length > 0) {
         setErrors(validationErrors);
         setMessageType('error');
         setMessage('Vui lòng sửa các lỗi bên trên.');
         return;
      }

      setErrors({});

      const requestBody = {
         email,
         password,
      };

      try {
         setIsLoading(true);
         const response = await axios.post('http://localhost:8080/api/v1/auth/login', requestBody, {
            headers: {
               'Content-Type': 'application/json',
            },
         });

         setIsLoading(false);

         if (response.status === 200) {
            setMessageType('success');
            setMessage('Đăng nhập thành công!');
            setResponseData(response.data.data);
            Cookies.set('token', response.data.data.token, { expires: 1 });
            Cookies.set('refreshToken', response.data.data.refreshToken, { expires: 7 });

            const roles = response.data.data.user.roles;
            if (roles.length > 0) {
               const primaryRole = roles[0].roleName;
               Cookies.set('role', primaryRole, { expires: 1 });
            }
            navigate('/');
         } else {
            setMessageType('error');
            setMessage('Đã xảy ra lỗi: ' + response.data.message);
         }
      } catch (error) {
         setIsLoading(false);
         setMessageType('error');
         if (error.response && error.response.data && error.response.data.message) {
            setMessage('Đã xảy ra lỗi: ' + error.response.data.message);
         } else {
            setMessage('Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại sau.');
         }
      }
   };

   return (
      <div className="login-container">
         <h2>Đăng nhập</h2>
         <p>Chào mừng bạn đến với chúng tôi</p>
         {isLoading ? (
            <div className="loading-spinner">
               <p>Đang xử lý, vui lòng chờ...</p>
            </div>
         ) : (
            <form onSubmit={handleSubmit}>
               <div className={`form-group ${errors.email ? 'has-error' : ''}`}>
                  <label htmlFor="email">Email</label>
                  <div className="input-wrapper">
                     <MailOutlineIcon className="icon-form" />
                     <input
                        type="email"
                        id="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                     />
                  </div>
                  {errors.email && <p className="error-message">{errors.email}</p>}
               </div>
               <div className={`form-group ${errors.password ? 'has-error' : ''}`}>
                  <label htmlFor="password">Password</label>
                  <div className="input-wrapper">
                     <LockOutlinedIcon className="icon-form" />
                     <input
                        type="password"
                        id="password"
                        placeholder="Mật khẩu"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                     />
                  </div>
                  {errors.password && <p className="error-message">{errors.password}</p>}
               </div>
               <button type="submit" className="login-button">Đăng nhập</button>
            </form>
         )}
         {message && <p className={`message ${messageType}`}>{message}</p>}
         <div className="register-redirect">
            <span>Bạn chưa có tài khoản?</span>
            <span><Link to="/register">Đăng ký ngay</Link></span>
         </div>
      </div>
   );
};

export default Login;
