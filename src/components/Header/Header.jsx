import { useState, useEffect } from 'react';
import { Link, useNavigate, NavLink } from 'react-router-dom';
import React from 'react';
import Cookies from 'js-cookie';
import logo from '../../assets/logo/logo.png';
import defaultAvt from '../../assets/default-avt/default.png';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MessageIcon from '@mui/icons-material/Message';
import ProfileDropdown from '../ProfileDropMenu/ProfileDropdown';
import CompanyDropdown from '../CompanyDropdown/CompanyDropdown';
import './Header.css';

const Header = () => {
   const [role, setRole] = useState('');
   const navigate = useNavigate();

   useEffect(() => {
      const token = Cookies.get('token');
      const storedRole = Cookies.get('role');
      if (!token) {
         setRole('');
      } else if (storedRole) {
         setRole(storedRole);
      }
   }, [navigate]);

   return (
      <header className="header-container">
         <div className="logo-section">
            <Link to="/"><img src={logo} alt="TopCV Logo" className="logo" /></Link>
            <span className="slogan">Tiếp lợi thế - Nới thành công</span>
         </div>
         <nav className="navigation">
            <NavLink to="/" className={({ isActive }) => isActive ? 'choice' : ''}>Việc làm</NavLink>
            <NavLink to="/recruitment" className={({ isActive }) => isActive ? 'choice' : ''}>Tuyển dụng</NavLink>
            <NavLink to="/companies" className={({ isActive }) => isActive ? 'choice' : ''}>Công ty</NavLink>
            <NavLink to="/tools" className={({ isActive }) => isActive ? 'choice' : ''}>Công cụ</NavLink>
            <NavLink to="/career-guide" className={({ isActive }) => isActive ? 'choice' : ''}>Cẩm nang nghề nghiệp</NavLink>
         </nav>
         <div className="actions">
            {role ? (
               <>
                  {role === 'ROLE_PERSONAL' ? (
                     <span className="employer-section">
                        Bạn đang tìm việc? <Link to="/personal/create-post">Đăng bài ngay</Link>
                     </span>
                  ) : role === 'ROLE_COMPANY' ? (
                     <span className="employer-section">
                        Bạn đang tìm nhân lực? <Link to="/personal/post-job">Đăng bài ngay</Link>
                     </span>
                  ) : null}
                  <div className="icons">
                     <NotificationsIcon className="icon" />
                     <MessageIcon className="icon" />
                     <div className="profile">
                        {role === 'ROLE_PERSONAL' ? (
                           <ProfileDropdown defaultAvt={defaultAvt} />
                        ) : role === 'ROLE_COMPANY' ? (
                           <CompanyDropdown defaultAvt={defaultAvt} />
                        ) : null}
                     </div>
                  </div>
               </>
            ) : (
               <div className="auth-buttons">
                  <button className="btn-login" onClick={() => navigate('/login')}>Đăng nhập</button>
                  <button className="btn-register" onClick={() => navigate('/register')}>Đăng ký</button>
               </div>
            )}
         </div>
      </header>
   );
};

export default Header;
