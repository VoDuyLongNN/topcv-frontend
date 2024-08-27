import React, { useState } from 'react';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import './CompanyDropdown.css';
import { useNavigate, Link } from 'react-router-dom';
import { logout } from '../../service/logout';

const CompanyDropdown = ({ defaultAvt }) => {
   const [isOpen, setIsOpen] = useState(false);
   const navigate = useNavigate();

   const handleMouseEnter = () => {
      setIsOpen(true);
   };

   const handleMouseLeave = () => {
      setIsOpen(false);
   };

   return (
      <div className="profile-dropdown" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
         <div className="profile">
            <img src={defaultAvt} alt="Profile" className="profile-pic" />
            <ArrowDropDownIcon className="icon drop-down" />
         </div>
         {isOpen && (
            <div className="dropdown-menu">
               <div className="menu-item">
                  <span className="icon">&#9998;</span>
                  <span><Link to="/company">Chỉnh sửa thông tin doanh nghiệp</Link></span>
               </div>
               <div className="menu-item">
                  <span className="icon">&#10145;</span>
                  <span>Danh sách bài tìm việc đã lưu</span>
               </div>
               <div className="menu-item">
                  <span className="icon">&#127873;</span>
                  <span>Danh sách bài viết đã đăng</span>
               </div>
               <div className="menu-item" onClick={() => logout(navigate)}>
                  <span className="icon">&#x1F6AA;</span>
                  <span>Đăng xuất</span>
               </div>
            </div>
         )}
      </div>
   );
};

export default CompanyDropdown;
