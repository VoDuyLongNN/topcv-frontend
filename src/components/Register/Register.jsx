import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import './Register.css';

const Register = () => {
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [role, setRole] = useState('personal');
   const [message, setMessage] = useState('');
   const [messageType, setMessageType] = useState('');
   const [errors, setErrors] = useState({});
   const [isLoading, setIsLoading] = useState(false);
   const [isRedirecting, setIsRedirecting] = useState(false);

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
         roleName: role,
      };

      try {
         setIsLoading(true);
         const response = await axios.post('http://localhost:8080/api/v1/auth/register', requestBody, {
            headers: {
               'Content-Type': 'application/json',
            },
         });

         setIsLoading(false);

         if (response.data.status === 'OK') {
            setMessageType('success');
            setMessage('Tạo tài khoản thành công!');
            setIsRedirecting(true);
            setTimeout(() => {
               navigate('/login');
            }, 2000);
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
            setMessage('Đã xảy ra lỗi khi đăng ký. Vui lòng thử lại.');
         }
      }
   };

   return (
      <div className="register-container">
         <h2>Chào mừng bạn đến với chúng tôi</h2>
         <p>Cùng xây dựng một hồ sơ nổi bật hoặc các bài tuyển dụng lý tưởng</p>
         {isLoading ? (
            <div className=".loading-spinner-register">
               <p>Đang xử lý, vui lòng chờ...</p>
            </div>
         ) : isRedirecting ? (
            <div className="redirecting-spinner-register">
               <p>Đang chuyển đến trang đăng nhập...</p>
               <div className="spinner-register"></div>
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
               <div className="form-group">
                  <label htmlFor="role">Role</label>
                  <div className="input-wrapper">
                     <AccountCircleIcon className="icon-form" />
                     <select id="role" value={role} onChange={(e) => setRole(e.target.value)}>
                        <option value="personal">Người tìm việc</option>
                        <option value="company">Nhà tuyển dụng</option>
                     </select>
                  </div>
               </div>
               <button type="submit" className="register-button">Đăng ký</button>
            </form>
         )}
         {message && <p className={`message ${messageType}`}>{message}</p>}
         <div className="already-account">
            <span>Bạn đã có tài khoản?</span>
            <span><Link to="/login">Đăng nhập</Link></span>
         </div>
      </div>
   );
};

export default Register;
