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

   const handleInputChange = (e) => {
      const {name, value} = e.target;

      if(name === 'companyName') {
         if(value.length <= 0 || value.length > 30) {
            setErrors({...errors, companyName: 'Tên công ty không được bỏ trống, tối đa 30 kí tự.'});
            setIsSaveEnabled(false);
         } else {
            const newErrors = { ...errors };
            delete newErrors.companyName;
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
            </div>

            <div className={`container-item--form-col ${errors.industry ? 'has-error' : ''}`}>
               <label>Lĩnh vực hoạt động <span className='required'>(*)</span></label>
               <select
                  name="industry"
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  disabled={!isEditing}
               >
                  <option value="">Chọn ngành nghề</option>
                  {jobCategories.map((job) => (
                     <option key={job.id} value={job.id}>
                        {job.type}
                     </option>
                  ))}
               </select>
            </div>
         </div>

         <div className="container-item--form-row">
            <div className={`container-item--form-col ${errors.location ? 'has-error' : ''}`}>
               <label>Địa chỉ <span className='required'>(*)</span></label>
               <input
                  type="text"
                  name="location"
                  value={formData.location}
                  disabled={!isEditing}
               />
            </div>

            <div className={`container-item--form-col ${errors.establishment ? 'has-error' : ''}`}>
               <label>Năm thành lập <span className='required'>(*)</span></label>
               <input
                  type="date"
                  name="establishment"
                  value={formData.establishment}
                  disabled={!isEditing}
                  onChange={(e) => setFormData({ ...formData, establishment: e.target.value })}
               />
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
            <button id='btnCancel' className='btn-action' >Hủy bỏ</button>
            <button
               id='btnSave'
               className={`btn-action ${isSaveEnabled ? 'enabled' : ''}`}
               disabled={!isSaveEnabled}
            >
               Lưu
            </button>
         </div>
      </form>
   )
}

export default CompanyInfor;