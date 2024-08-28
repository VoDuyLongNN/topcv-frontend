import { useEffect, useState } from 'react';
import { getToken } from '../../../service/token';
import axios from 'axios';

const CompanyInfor = ({
   isUpdating,
   setIsUpdating,
   setShowMessage,
   setMessageType,
   setMessage,
   formData,
   setFormData
}) => {
   const [error, setError] = useState(null);
   const [errors, setErrors] = useState({});
   const [isEditing, setIsEditing] = useState(false);
   const [isSaveEnabled, setIsSaveEnabled] = useState(false);
   const [jobCategories, setJobCategories] = useState([]);

   useEffect(() => {
      const fetchCompanyData = async () => {
         setIsUpdating(true);

         try {
            const token = getToken();

            const response = await axios.get('http://localhost:8080/company/get', {
               headers: {
                  'Authorization': `Bearer ${token}`,
               },
            });

            setFormData({
               companyId: response.data.data.companyId || '',
               companyName: response.data.data.companyName || '',
               avt: response.data.data.avt || '',
               industry: response.data.data.industry || '',
               location: response.data.data.location || '',
               establishment: response.data.data.establishment || '',
               website: response.data.data.website || '',
               description: response.data.data.description || '',
               createDate: response.data.data.createDate || '',
               updateTime: response.data.data.updateTime || '',
               email: response.data.data.email || ''
            })

            setIsUpdating(false);
         } catch (error) {
            setError('Error fetching personal data');
            setIsUpdating(false);
         }
      }

      const fetchJobCategories = async () => {
         try {
            const response = await axios.get('http://localhost:8080/job-category/get-all');
            setJobCategories(response.data.data);
         } catch (error) {
            console.log('Error fetching job categories', error);
         }
      };

      fetchCompanyData();
      fetchJobCategories();
   }, [])

   const handleEditClick = (e) => {
      e.preventDefault();
      setIsEditing(true);
      setIsSaveEnabled(true);
   };

   const handleCancelClick = (e) => {
      e.preventDefault();
      window.location.reload();
   };

   const handleSaveClick = async (e) => {
      e.preventDefault();
      setIsUpdating(true);

      const company = {
         companyName: formData.companyName,
         industry: formData.industry,
         location: formData.location,
         establishment: formData.establishment,
         website: formData.website,
         description: formData.description
      };

      try {
         const token = getToken();
         const response = await axios.put('http://localhost:8080/company/update', company, {
            headers: {
               'Authorization': `Bearer ${token}`,
               'Content-Type': 'application/json'
            }
         });

         setIsUpdating(false);

         if (response.status === 200) {
            setMessage("Cập nhập thành công!");
            setMessageType('success');
            setShowMessage(true)
            setIsEditing(false);
            setIsSaveEnabled(false);
         } else {
            setMessage(`Cập nhập thất bại, ${response.data.message}`);
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
   }

   const handleInputChange = (e) => {
      const { name, value } = e.target;

      if (name === 'companyName') {
         if (value.length <= 0 || value.length > 30) {
            setErrors({ ...errors, companyName: 'Tên công ty không được bỏ trống, tối đa 30 kí tự.' });
            setIsSaveEnabled(false);
         } else {
            const newErrors = { ...errors };
            delete newErrors.companyName;
            setErrors(newErrors);
            setIsSaveEnabled(true);
         }
      }

      if (name === 'location') {
         if (value.length <= 0 || value.length > 30) {
            setErrors({ ...errors, location: 'Địa chỉ không được bỏ trống, tối đa 30 kí tự.' });
            setIsSaveEnabled(false);
         } else {
            const newErrors = { ...errors };
            delete newErrors.location;
            setErrors(newErrors);
            setIsSaveEnabled(true);
         }
      }

      if (name === 'establishment') {
         const selectedDate = new Date(value);
         const currentDate = new Date();

         if (!value || selectedDate > currentDate) {
            setErrors({ ...errors, establishment: 'Ngày sinh không hợp lệ. Không được để trống hoặc là ngày trong tương lai.' });
            setIsSaveEnabled(false);
         } else {
            const newErrors = { ...errors };
            delete newErrors.establishment;
            setErrors(newErrors);
            setIsSaveEnabled(true);
         }
      }

      if (name === 'industry') {
         if (value === '') {
            setErrors({ ...errors, industry: 'Bạn phải chọn một ngành nghề.' });
            setIsSaveEnabled(false);
         } else {
            const newErrors = { ...errors };
            delete newErrors.industry;
            setErrors(newErrors);
            setIsSaveEnabled(true);
         }
      }

      setFormData({
         ...formData,
         [name]: value
      });
   }

   return (
      <form className="container-item--form">
         <h2>Thông tin công ty</h2>
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
            <div className={`container-item--form-col ${errors.companyName ? 'has-error' : ''}`}>
               <label>Tên công ty <span className='required'>(*)</span></label>
               <input
                  type="text"
                  name="companyName"
                  id="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
               />
               {errors.companyName && <p className="error-message">{errors.companyName}</p>}
            </div>

            <div className={`container-item--form-col ${errors.industry ? 'has-error' : ''}`}>
               <label>Lĩnh vực hoạt động <span className='required'>(*)</span></label>
               <select
                  name="industry"
                  id="industry"
                  value={formData.industry}
                  onChange={handleInputChange}
                  disabled={!isEditing}
               >
                  <option value="">Chọn ngành nghề</option>
                  {jobCategories.map((job) => (
                     <option key={job.id} value={job.id}>
                        {job.type}
                     </option>
                  ))}
               </select>
               {errors.industry && <p className="error-message">{errors.industry}</p>}
            </div>
         </div>

         <div className="container-item--form-row">
            <div className={`container-item--form-col ${errors.location ? 'has-error' : ''}`}>
               <label>Địa chỉ <span className='required'>(*)</span></label>
               <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  disabled={!isEditing}
               />
               {errors.location && <p className="error-message">{errors.location}</p>}
            </div>

            <div className={`container-item--form-col ${errors.establishment ? 'has-error' : ''}`}>
               <label>Năm thành lập <span className='required'>(*)</span></label>
               <input
                  type="date"
                  name="establishment"
                  id="establishment"
                  value={formData.establishment}
                  onChange={handleInputChange}
                  disabled={!isEditing}
               />
               {errors.establishment && <p className="error-message">{errors.establishment}</p>}
            </div>
         </div>

         <div className="container-item--form-row">
            <div className="container-item--form-col">
               <label>Trang web</label>
               <input
                  type="text"
                  name="website"
                  value={formData.website}
                  disabled={!isEditing}
               />
            </div>
         </div>

         <div className="container-item--form-row">
            <div className="container-item--form-col">
               <label>Mô tả</label>
               <textarea
                  type="text"
                  name="description"
                  value={formData.description}
                  disabled={!isEditing}
               />
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
      </form>
   )
}

export default CompanyInfor;