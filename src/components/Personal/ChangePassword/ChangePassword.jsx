import React, { useState, useEffect } from 'react';
import './ChangePassword.css';
import axios from 'axios';
import { getToken } from '../../../service/token';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const ChangePassword = ({
   setIsUpdating,
   setShowMessage,
   setMessageType,
   setMessage,
}) => {
   const [formData, setFormData] = useState({
      oldPass: '',
      newPass: '',
      reNewPass: '',
   });

   const [errors, setErrors] = useState({
      oldPass: '',
      newPass: '',
      reNewPass: '',
   });

   const [showPassword, setShowPassword] = useState({
      oldPass: false,
      newPass: false,
      reNewPass: false,
   });

   const [isSaveEnabled, setIsSaveEnabled] = useState(false);

   useEffect(() => {
      const hasErrors = Object.values(errors).some((error) => error !== '');
      setIsSaveEnabled(!hasErrors && formData.oldPass && formData.newPass && formData.reNewPass);
   }, [errors, formData]);

   const toggleShowPassword = (field) => {
      setShowPassword((prevState) => ({
         ...prevState,
         [field]: !prevState[field],
      }));
   };

   const validatePassword = (name, value, msg) => {
      const passwordRegex = /^.{8,30}$/;
      if (!passwordRegex.test(value)) {
         setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: msg,
         }));
      } else {
         setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: '',
         }));
      }
   };

   const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData({
         ...formData,
         [name]: value || '',
      });

      if (name === 'oldPass' || name === 'newPass') {
         validatePassword(name, value, 'Mật khẩu phải từ 8 đến 30 kí tự');
      }

      if (name === 'reNewPass') {
         if (value !== formData.newPass) {
            setErrors((prevErrors) => ({
               ...prevErrors,
               reNewPass: 'Mật khẩu nhập lại không khớp',
            }));
         } else {
            setErrors((prevErrors) => ({
               ...prevErrors,
               reNewPass: '',
            }));
         }
      }
   };

   const handleCancelClick = (e) => {
      e.preventDefault();
      window.location.reload();
   };

   const handleSaveClick = async (e) => {
      e.preventDefault();
      setIsUpdating(true);
      try {
         const token = getToken();
         const response = await axios.put('http://localhost:8080/user/change-password', {
            oldPassword: formData.oldPass,
            newPassword: formData.newPass,
            reNewPassword: formData.reNewPass
         }, {
            headers: {
               'Authorization': `Bearer ${token}`,
               'Content-Type': 'application/json'
            }
         });
         setIsUpdating(false);

         if (response.status === 200) {
            setMessage(response.data.message);
            setMessageType('success');
            setShowMessage(true);
         } else {
            setMessage(response.data.message);
            setMessageType('error');
            setShowMessage(true);
         }
      } catch (error) {
         setIsUpdating(false);
         setMessage(error.response.data.message);
         setMessageType('error');
         setShowMessage(true);
      }
      setTimeout(() => {
         setShowMessage(false);
      }, 3000);
   }

   return (
      <form action="" className="container-item--form form-change-password">
         <h2>Đổi mật khẩu</h2>
         <div className="container-item--form-row">
            <div className={`container-item--form-col ${errors.oldPass ? 'has-error' : ''}`}>
               <label>Mật khẩu cũ <span className='required'>(*)</span></label>
               <div className="password-wrapper">
                  <input
                     type={showPassword.oldPass ? "text" : "password"}
                     name="oldPass"
                     value={formData.oldPass}
                     onChange={handleInputChange}
                  />
                  <button type="button" className="toggle-password" onClick={() => toggleShowPassword('oldPass')}>
                     {showPassword.oldPass ? <VisibilityOffIcon className='icon'/> : <VisibilityIcon className='icon'/>}
                  </button>
               </div>
               {errors.oldPass && <p className="error-message">{errors.oldPass}</p>}
            </div>
         </div>
         <div className="container-item--form-row">
            <div className={`container-item--form-col ${errors.newPass ? 'has-error' : ''}`}>
               <label>Mật khẩu mới <span className='required'>(*)</span></label>
               <div className="password-wrapper">
                  <input
                     type={showPassword.newPass ? "text" : "password"}
                     name="newPass"
                     value={formData.newPass}
                     onChange={handleInputChange}
                  />
                  <button type="button" className="toggle-password" onClick={() => toggleShowPassword('newPass')}>
                     {showPassword.newPass ? <VisibilityOffIcon className='icon'/> : <VisibilityIcon className='icon'/>}
                  </button>
               </div>
               {errors.newPass && <p className="error-message">{errors.newPass}</p>}
            </div>
         </div>
         <div className="container-item--form-row">
            <div className={`container-item--form-col ${errors.reNewPass ? 'has-error' : ''}`}>
               <label>Nhập lại mật khẩu mới <span className='required'>(*)</span></label>
               <div className="password-wrapper">
                  <input
                     type={showPassword.reNewPass ? "text" : "password"}
                     name="reNewPass"
                     value={formData.reNewPass}
                     onChange={handleInputChange}
                  />
                  <button type="button" className="toggle-password" onClick={() => toggleShowPassword('reNewPass')}>
                     {showPassword.reNewPass ? <VisibilityOffIcon className='icon'/> : <VisibilityIcon className='icon'/>}
                  </button>
               </div>
               {errors.reNewPass && <p className="error-message">{errors.reNewPass}</p>}
            </div>
         </div>
         <div className="container-item--form-row" style={{ justifyContent: 'end' }}>
            <button id='btnCancel' className='btn-action' onClick={handleCancelClick}>Hủy bỏ</button>
            <button
               id='btnSave'
               className={`btn-action ${isSaveEnabled ? 'enabled' : ''}`}
               onClick={handleSaveClick}
               disabled={!isSaveEnabled}
            >
               Lưu
            </button>
         </div>
      </form>
   )
}

export default ChangePassword;
