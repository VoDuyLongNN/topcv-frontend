import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../service/logout';
import { Link } from 'react-router-dom';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import './ProfileDropdown.css';
import GetAvatar from '../GetAvatar/GetAvatar';

const ProfileDropdown = ({ defaultAvt }) => {
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
            <GetAvatar/>
            <ArrowDropDownIcon className="icon drop-down" />
         </div>
         {isOpen && (
            <div className="dropdown-menu">
               <div className="menu-item">
                  <span className="icon">&#9998;</span>
                  <span><Link to="/personal">Cài đặt thông tin cá nhân</Link></span>
               </div>
               <div className="menu-item">
                  <span className="icon">&#10145;</span>
                  <span>Nâng cấp tài khoản VIP</span>
               </div>
               <div className="menu-item">
                  <span className="icon">&#127873;</span>
                  <span>Kích hoạt quà tặng</span>
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

export default ProfileDropdown;
