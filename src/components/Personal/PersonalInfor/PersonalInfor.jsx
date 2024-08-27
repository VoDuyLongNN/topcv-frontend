import { useEffect, useState } from 'react';
import { getToken } from '../../../service/token';
import { validatePhone } from '../../../service/validate';
import axios from 'axios';
import React from 'react';
import '../Personal.css';

const PersonalInfo = ({
   isUpdating,
   setIsUpdating,
   setShowMessage,
   setMessageType,
   setMessage,
   formData,
   setFormData
}) => {
   const [error, setError] = useState(null);
   const [isEditing, setIsEditing] = useState(false);
   const [errors, setErrors] = useState({});
   const [isSaveEnabled, setIsSaveEnabled] = useState(false);

   useEffect(() => {
      const fetchPersonalData = async () => {
         setIsUpdating(true);
         try {
            const token = getToken();
            const response = await axios.get('http://localhost:8080/personal', {
               headers: {
                  'Authorization': `Bearer ${token}`,
               },
            });
            setFormData({
               email: response.data.data.user.email || '',
               firstName: response.data.data.firstName || '',
               lastName: response.data.data.lastName || '',
               address: response.data.data.address || '',
               location: response.data.data.location || '',
               education: response.data.data.education || '',
               gender: response.data.data.gender === true ? true : false,
               phone: response.data.data.phone || '',
               skill: response.data.data.skill || '',
               description: response.data.data.description || '',
               birthDay: response.data.data.birthDay || '',
            });
            setIsUpdating(false);
         } catch (error) {
            setError('Error fetching personal data');
            setIsUpdating(false);
         }
      };

      fetchPersonalData();
   }, []);

   if (error) {
      return <p>{error}</p>;
   }

   const handleEditClick = (e) => {
      e.preventDefault();
      setIsEditing(true);
      setIsSaveEnabled(true);
   };

   const handleCancelClick = (e) => {
      e.preventDefault();
      window.location.reload();
   };

   const handleInputChange = (e) => {
      const { name, value } = e.target;

      if (name === 'phone') {
         if (!validatePhone(value)) {
            setErrors({ ...errors, phone: 'Số điện thoại không hợp lệ. Chỉ chấp nhận 10-11 số.' });
            setIsSaveEnabled(false);
         } else {
            const newErrors = { ...errors };
            delete newErrors.phone;
            setErrors(newErrors);
            setIsSaveEnabled(true);
         }
      }

      if (name === 'firstName') {
         if (value.length <= 0 || value.length > 30) {
            setErrors({ ...errors, firstName: 'Họ không được bỏ trống, tối đa 30 kí tự.' });
            setIsSaveEnabled(false);
         } else {
            const newErrors = { ...errors };
            delete newErrors.firstName;
            setErrors(newErrors);
            setIsSaveEnabled(true);
         }
      }

      if (name === 'lastName') {
         if (value.length <= 0 || value.length > 30) {
            setErrors({ ...errors, lastName: 'Tên không được bỏ trống, tối đa 30 kí tự.' });
            setIsSaveEnabled(false);
         } else {
            const newErrors = { ...errors };
            delete newErrors.lastName;
            setErrors(newErrors);
            setIsSaveEnabled(true);
         }
      }

      if (name === 'birthDay') {
         const selectedDate = new Date(value);
         const currentDate = new Date();

         if (!value || selectedDate > currentDate) {
            setErrors({ ...errors, birthDay: 'Ngày sinh không hợp lệ. Không được để trống hoặc là ngày trong tương lai.' });
            setIsSaveEnabled(false);
         } else {
            const newErrors = { ...errors };
            delete newErrors.birthDay;
            setErrors(newErrors);
            setIsSaveEnabled(true);
         }
      }

      setFormData({
         ...formData,
         [name]: value
      });
   };

   const handleGenderChange = (e) => {
      setFormData({
         ...formData,
         gender: e.target.value === 'male'
      });
   };

   const handleSaveClick = async (e) => {
      e.preventDefault();
      setIsUpdating(true);

      const personal = {
         firstName: formData.firstName,
         lastName: formData.lastName,
         address: formData.address,
         location: formData.location,
         education: formData.education,
         gender: formData.gender,
         phone: formData.phone,
         skill: formData.skill,
         desc: formData.description,
         birthDay: formData.birthDay,
      };

      try {
         const token = getToken();
         const response = await axios.put('http://localhost:8080/personal', personal, {
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
            setIsEditing(false);
            setIsSaveEnabled(false);
         } else {
            setMessage(response.data.message);
            setMessageType('error');
            setShowMessage(true);
         }
      } catch (err) {
         setIsUpdating(false);
         setMessage(err.response.data.message);
         setMessageType('error');
         setShowMessage(true);
      }
      setTimeout(() => {
         setShowMessage(false);
      }, 3000);
   };

   return (
      <form className='container-item--form'>
         <h2>Thông tin cá nhân</h2>
         <div className="container-item--form-row">
            <div className="container-item--form-col">
               <label>Email</label>
               <input
                  type="text"
                  name=""
                  value={formData.email}
                  disabled
               />
            </div>
         </div>
         <div className="container-item--form-row">
            <div className={`container-item--form-col ${errors.firstName ? 'has-error' : ''}`}>
               <label htmlFor="firstName">Họ <span className='required'>(*)</span></label>
               <input
                  type="text"
                  name="firstName"
                  id="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  required
               />
               {errors.firstName && <p className="error-message">{errors.firstName}</p>}
            </div>
            <div className={`container-item--form-col ${errors.lastName ? 'has-error' : ''}`}>
               <label htmlFor="lastName">Tên <span className='required'>(*)</span></label>
               <input
                  type="text"
                  name="lastName"
                  id="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  required
               />
               {errors.lastName && <p className="error-message">{errors.lastName}</p>}
            </div>
         </div>

         <div className="container-item--form-row">
            <div className={`container-item--form-col ${errors.birthDay ? 'has-error' : ''}`}>
               <label htmlFor="birthDay">Ngày sinh <span className='required'>(*)</span></label>
               <input
                  type="date"
                  name="birthDay"
                  id="birthDay"
                  value={formData.birthDay}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  required
               />
               {errors.birthDay && <p className="error-message">{errors.birthDay}</p>}
            </div>
            <div className={`container-item--form-col ${errors.phone ? 'has-error' : ''}`}>
               <label htmlFor="phone">Số điện thoại <span className='required'>(*)</span></label>
               <input
                  type="text"
                  name="phone"
                  id="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  required
               />
               {errors.phone && <p className="error-message">{errors.phone}</p>}
            </div>
         </div>

         <div className="container-item--form-row">
            <div className="container-item--form-col">
               <label htmlFor="address">Địa chỉ</label>
               <input
                  type="text"
                  name="address"
                  id="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  disabled={!isEditing}
               />
            </div>

            <div className="container-item--form-col">
               <label htmlFor="location">Nơi làm việc mong muốn</label>
               <input
                  type="text"
                  name="location"
                  id="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  disabled={!isEditing}
               />
            </div>
         </div>

         <div className="container-item--form-row">
            <div className="container-item--form-col">
               <label htmlFor="education">Trường đại học</label>
               <input
                  type="text"
                  name="education"
                  id="education"
                  value={formData.education}
                  onChange={handleInputChange}
                  disabled={!isEditing}
               />
            </div>
            <div className="container-item--form-col">
               <label>Giới tính</label>
               <div className='gender'>
                  <label>
                     <input
                        type="radio"
                        name="gender"
                        value="male"
                        checked={formData.gender === true}
                        onChange={handleGenderChange}
                        disabled={!isEditing}
                     />
                     Nam
                  </label>
               </div>
               <div className='gender'>
                  <label>
                     <input
                        type="radio"
                        name="gender"
                        value="female"
                        checked={formData.gender === false}
                        onChange={handleGenderChange}
                        disabled={!isEditing}
                     />
                     Nữ
                  </label>
               </div>
            </div>
         </div>

         <div className="container-item--form-row">
            <div className="container-item--form-col">
               <label htmlFor="skill">Kĩ năng</label>
               <textarea
                  name="skill"
                  id="skill"
                  value={formData.skill}
                  onChange={handleInputChange}
                  disabled={!isEditing}>
               </textarea>
            </div>
         </div>

         <div className="container-item--form-row">
            <div className="container-item--form-col">
               <label htmlFor="description">Mô tả thêm</label>
               <textarea
                  name="description"
                  id="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  disabled={!isEditing}>
               </textarea>
            </div>
         </div>
         <div className="container-item--form-row" style={{ justifyContent: 'end' }}>
            <button id='btnEdit' className='btn-action' onClick={handleEditClick}>Sửa</button>
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
      </form >
   );
};

export default PersonalInfo;
