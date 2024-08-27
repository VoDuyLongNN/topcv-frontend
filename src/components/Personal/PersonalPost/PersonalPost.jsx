import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getToken } from '../../../service/token';

const PersonalPost = ({
   setIsUpdating,
   setShowMessage,
   setMessageType,
   setMessage,
}) => {
   const [formData, setFormData] = useState({
      title: '',
      province: '',
      workTime: '',
      jobCategory: '',
      jobSubCategory: '',
      description: '',
   });

   const [errors, setErrors] = useState({});
   const [provinces, setProvinces] = useState([]);
   const [jobCategories, setJobCategories] = useState([]);
   const [jobSubCategories, setJobSubCategories] = useState([]);
   const [isSaveEnabled, setIsSaveEnabled] = useState(false);
   const token = getToken();

   useEffect(() => {
      axios.get('http://localhost:8080/province/get-all', {
         headers: {
            'Authorization': `Bearer ${token}`,
         }
      })
         .then(response => {
            if (response.data.status === 'OK') {
               setProvinces(response.data.data);
            } else {
               console.error('Failed to fetch provinces');
            }
         })
         .catch(error => {
            console.error('There was an error fetching the provinces!', error);
         });

      axios.get('http://localhost:8080/job-category/get-all', {
         headers: {
            'Authorization': `Bearer ${token}`,
         }
      })
         .then(response => {
            if (response.data.status === 'OK') {
               setJobCategories(response.data.data);
            } else {
               console.error('Failed to fetch job categories');
            }
         })
         .catch(error => {
            console.error('There was an error fetching the job categories!', error);
         });
   }, [token]);

   const handleJobCategoryChange = (event) => {
      const jobCategoryId = event.target.value;
      setFormData({ ...formData, jobCategory: jobCategoryId });

      if (jobCategoryId) {
         axios.post('http://localhost:8080/job-subcategory/get-all',
            { jobCategoryId },
            {
               headers: {
                  'Authorization': `Bearer ${token}`,
               }
            })
            .then(response => {
               if (response.data.status === 'OK') {
                  setJobSubCategories(response.data.data);
               } else {
                  console.error('Failed to fetch job subcategories');
               }
            })
            .catch(error => {
               console.error('There was an error fetching the job subcategories!', error);
            });
      } else {
         setJobSubCategories([]);
      }
   };

   const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
      validateForm({ ...formData, [name]: value });
   };

   const validateForm = (data) => {
      let tempErrors = {};
      let formIsValid = true;

      if (!data.title) {
         formIsValid = false;
         tempErrors['title'] = 'Tiêu đề không được để trống';
      }

      if (!data.province) {
         formIsValid = false;
         tempErrors['province'] = 'Tỉnh thành không được để trống';
      }

      if (!data.workTime) {
         formIsValid = false;
         tempErrors['workTime'] = 'Thời gian làm việc không được để trống';
      }

      if (!data.jobCategory) {
         formIsValid = false;
         tempErrors['jobCategory'] = 'Ngành nghề không được để trống';
      }

      if (!data.jobSubCategory) {
         formIsValid = false;
         tempErrors['jobSubCategory'] = 'Ngành nghề cụ thể không được để trống';
      }

      if (!data.description) {
         formIsValid = false;
         tempErrors['description'] = 'Mô tả thêm không được để trống';
      }

      setErrors(tempErrors);
      setIsSaveEnabled(formIsValid);
   };

   const handleSaveClick = async (e) => {
      e.preventDefault();
      if (isSaveEnabled) {
         setIsUpdating(true);
         try {
            const response = await axios.post('http://localhost:8080/post-personal/create', {
               title: formData.title,
               province: formData.province,
               workType: formData.workTime,
               jobCategoryId: formData.jobCategory,
               jobSubCategoryId: formData.jobSubCategory,
               description: formData.description
            }, {
               headers: {
                  'Authorization': `Bearer ${token}`,
               }
            })
            setIsUpdating(false);

            if (response.status === 201) {
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
      } else {
         console.log('Form is invalid, cannot be submitted');
      }
   };

   const handleCancelClick = (e) => {
      e.preventDefault();
      window.location.reload();
   };

   return (
      <form className='container-item--form'>
         <h2>Đăng bài tìm việc</h2>
         <div className="container-item--form-row">
            <div className={`container-item--form-col ${errors.title ? 'has-error' : ''}`}>
               <label htmlFor="title">Tiêu đề <span className='required'>(*)</span></label>
               <input
                  type="text"
                  name="title"
                  id="title"
                  value={formData.title}
                  onChange={handleInputChange}
               />
               {errors.title && <p className="error-message">{errors.title}</p>}
            </div>
         </div>

         <div className="container-item--form-row">
            <div className={`container-item--form-col ${errors.province ? 'has-error' : ''}`}>
               <label htmlFor="province">Tỉnh thành<span className='required'>(*)</span></label>
               <select name="province" id="province" value={formData.province} onChange={handleInputChange}>
                  <option value="">Chọn tỉnh/thành</option>
                  {provinces.map((province) => (
                     <option key={province.code} value={province.code}>
                        {province.name}
                     </option>
                  ))}
               </select>
               {errors.province && <p className="error-message">{errors.province}</p>}
            </div>
         </div>

         <div className="container-item--form-row">
            <div className={`container-item--form-col ${errors.workTime ? 'has-error' : ''}`}>
               <label htmlFor="workTime">Thời gian làm việc <span className='required'>(*)</span></label>
               <select name="workTime" id="workTime" value={formData.workTime} onChange={handleInputChange}>
                  <option value="">Chọn thời gian làm việc</option>
                  <option value="FULL_TIME">Full time</option>
                  <option value="PART_TIME">Part time</option>
               </select>
               {errors.workTime && <p className="error-message">{errors.workTime}</p>}
            </div>
         </div>

         <div className="container-item--form-row">
            <div className={`container-item--form-col ${errors.jobCategory ? 'has-error' : ''}`}>
               <label htmlFor="jobCategory">Ngành nghề <span className='required'>(*)</span></label>
               <select name="jobCategory" id="jobCategory" value={formData.jobCategory} onChange={handleJobCategoryChange}>
                  <option value="">Chọn ngành nghề</option>
                  {jobCategories.map((jobCategory) => (
                     <option key={jobCategory.id} value={jobCategory.id}>
                        {jobCategory.type}
                     </option>
                  ))}
               </select>
               {errors.jobCategory && <p className="error-message">{errors.jobCategory}</p>}
            </div>
            <div className={`container-item--form-col ${errors.jobSubCategory ? 'has-error' : ''}`}>
               <label htmlFor="jobSubCategory">Ngành nghề cụ thể <span className='required'>(*)</span></label>
               <select name="jobSubCategory" id="jobSubCategory" value={formData.jobSubCategory} onChange={handleInputChange}>
                  <option value="">Chọn ngành nghề cụ thể</option>
                  {jobSubCategories.map((jobSubCategory) => (
                     <option key={jobSubCategory.id} value={jobSubCategory.id}>
                        {jobSubCategory.name}
                     </option>
                  ))}
               </select>
               {errors.jobSubCategory && <p className="error-message">{errors.jobSubCategory}</p>}
            </div>
         </div>

         <div className="container-item--form-row">
            <div className={`container-item--form-col ${errors.description ? 'has-error' : ''}`}>
               <label htmlFor="description">Mô tả thêm <span className='required'>(*)</span></label>
               <textarea
                  name="description"
                  id="description"
                  value={formData.description}
                  onChange={handleInputChange}
               ></textarea>
               {errors.description && <p className="error-message">{errors.description}</p>}
            </div>
         </div>

         <div className="container-item--form-row">
            <div className="container-item--form-col">
               <label htmlFor="cv">CV</label>
               <input type="file" name="cv" id="cv" />
            </div>
         </div>

         <div className="container-item--form-row" style={{ justifyContent: 'end' }}>
            <button
               id='btnCancel'
               className='btn-action'
               onClick={handleCancelClick}
            >
               Hủy bỏ
            </button>
            <button
               id='btnSave'
               className={`btn-action ${isSaveEnabled ? 'enabled' : ''}`}
               onClick={handleSaveClick}
               disabled={!isSaveEnabled}
            >
               Tạo
            </button>
         </div>
      </form>
   );
}

export default PersonalPost;
