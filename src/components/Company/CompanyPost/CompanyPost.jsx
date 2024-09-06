import React, { useEffect, useState } from "react";
import axios from "axios";
import './CompanyPost.css';
import { getToken } from "../../../service/token";

const CompanyPost = ({
   setIsUpdating,
   setShowMessage,
   setMessageType,
   setMessage,
}) => {
   const [jobCategories, setJobCategories] = useState([]);
   const [jobSubCategories, setSubCategories] = useState([]);
   const [provinces, setProvinces] = useState([]);
   const [districts, setDistricts] = useState([]);
   const [wards, setWards] = useState([]);
   const [salaries, setSalaries] = useState([]);
   const [experiences, setExperiences] = useState([]);
   const [selectedProvince, setSelectedProvince] = useState('');
   const [selectedDistrict, setSelectedDistrict] = useState('');
   const [selectedJobCategory, setSelectedJobCategory] = useState('');
   const [errors, setErrors] = useState({});
   const [isSaveEnabled, setIsSaveEnabled] = useState(false);
   const [formData, setFormData] = useState({
      title: '',
      province: '',
      district: '',
      ward: '',
      address: '',
      jobCategory: '',
      jobSubCategory: '',
      salary: '',
      experience: '',
      quantity: '',
      expired: '',
      description: '',
      requirements: '',
      benefit: '',
      workTime: ''
   });

   const token = getToken();

   useEffect(() => {
      axios.get("http://localhost:8080/public/province/get-all")
         .then(response => {
            if (response.data && response.data.data) {
               setProvinces(response.data.data);
            }
         })
         .catch(error => {
            console.error("Error fetching provinces:", error);
         });

      axios.get("http://localhost:8080/public/salary/get-all")
         .then(response => {
            if (response.data && response.data.data) {
               setSalaries(response.data.data);
            }
         })
         .catch(error => {
            console.error("Error fetching salaries:", error);
         });

      axios.get("http://localhost:8080/public/experience/get-all")
         .then(response => {
            if (response.data && response.data.data) {
               setExperiences(response.data.data);
            }
         })
         .catch(error => {
            console.error("Error fetching salaries:", error);
         });

      axios.get("http://localhost:8080/job-category/get-all")
         .then(response => {
            if (response.data && response.data.data) {
               setJobCategories(response.data.data);
            }
         })
         .catch(error => {
            console.error("Error fetching salaries:", error);
         })
   }, []);

   const handleProvinceChange = (event) => {
      const provinceCode = event.target.value;
      setSelectedProvince(provinceCode);
      setFormData({ ...formData, province: provinceCode });
      setErrors({ ...errors, province: '' });

      if (provinceCode) {
         axios.get(`http://localhost:8080/public/district/get-by-province/${provinceCode}`)
            .then(response => {
               if (response.data.data) {
                  setDistricts(response.data.data);
               }
            })
            .catch(error => {
               console.error("Error fetching districts:", error);
            });
      } else {
         setDistricts([]);
      }
   };

   const handleDistrictChange = (event) => {
      const districtCode = event.target.value;
      setSelectedDistrict(districtCode);
      setFormData({ ...formData, district: districtCode });
      setErrors({ ...errors, district: '' });

      if (districtCode) {
         axios.get(`http://localhost:8080/public/ward/get-by-district/${districtCode}`)
            .then(response => {
               if (response.data && response.data.data) {
                  setWards(response.data.data);
               }
            })
            .catch(error => {
               console.error("Error fetching wards:", error);
               setWards([]);
            });
      } else {
         setWards([]);
      }
   };

   const handleJobCategoryChange = (event) => {
      const JobCategoryValue = event.target.value;
      setSelectedJobCategory(JobCategoryValue);
      setFormData({ ...formData, jobCategory: JobCategoryValue });

      const jobCategory = {
         jobCategoryId: JobCategoryValue
      }

      if (JobCategoryValue) {
         axios.post("http://localhost:8080/job-subcategory/get-all", jobCategory, {
            headers: {
               'Authorization': `Bearer ${token}`,
               'Content-Type': 'application/json'
            }
         })
            .then(response => {
               if (response.data && response.data.data) {
                  setSubCategories(response.data.data);
               }
            })
            .catch(error => {
               console.log(error);
               setSubCategories([]);
            })
      } else {
         setSubCategories([]);
      }
   }

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

      if (!data.district) {
         formIsValid = false;
         tempErrors['district'] = 'Quận/Huyện không được để trống';
      }

      if (!data.ward) {
         formIsValid = false;
         tempErrors['ward'] = 'Phường/Xã không được để trống';
      }

      if (!data.location) {
         formIsValid = false;
         tempErrors['location'] = 'Địa chỉ không được để trống';
      }

      if (!data.jobCategory) {
         formIsValid = false;
         tempErrors['jobCategory'] = 'Ngành nghề không được để trống';
      }

      if (!data.jobSubCategory) {
         formIsValid = false;
         tempErrors['jobSubCategory'] = 'Ngành nghề cụ thể không được để trống';
      }

      if (!data.salary) {
         formIsValid = false;
         tempErrors['salary'] = 'Mức lương không được để trống';
      }

      if (!data.experience) {
         formIsValid = false;
         tempErrors['experience'] = 'Kinh nghiệm không được để trống';
      }

      if (!data.quantity) {
         formIsValid = false;
         tempErrors['quantity'] = 'Số lượng tuyển dụng không được để trống';
      }

      if (!data.expired) {
         formIsValid = false;
         tempErrors['expired'] = 'Thời hạn tuyển dụng không được để trống';
      }

      if (!data.details) {
         formIsValid = false;
         tempErrors['details'] = 'Mô tả không được để trống';
      }

      if (!data.requirements) {
         formIsValid = false;
         tempErrors['requirements'] = 'Yêu cầu không được để trống';
      }

      if (!data.benefit) {
         formIsValid = false;
         tempErrors['benefit'] = 'Quyền lợi không được để trống';
      }

      if (!data.workTime) {
         formIsValid = false;
         tempErrors['workTime'] = 'Thời gian làm việc không được để trống';
      }

      setErrors(tempErrors);
      setIsSaveEnabled(formIsValid);
   };

   const handleSaveClick = async (e) => {
      e.preventDefault();

      if (isSaveEnabled) {
         setIsUpdating(true);
         try {
            const response = await axios.post('http://localhost:8080/company/create', {
               title: formData.title,
               expired: formData.expired,
               details: formData.details,
               quantity: formData.quantity,
               requirements: formData.requirements,
               benefit: formData.benefit,
               location: formData.location,
               workTime: formData.workTime,
               salary: formData.salary,
               experience: formData.experience,
               jobCategory: formData.jobCategory,
               jobSubCategory: formData.jobSubCategory,
               province: formData.province,
               district: formData.district,
               ward: formData.ward
            }, {
               headers: {
                  'Authorization': `Bearer ${token}`,
               }
            })
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
      } else {
         console.log("Form is invalid.");
      }
   };


   return (
      <form action="" className="container-item--form">
         <h2>Đăng bài tuyển dụng</h2>
         <div className={`container-item--form-row col-1 ${errors.title ? 'has-error' : ''}`}>
            <div className="container-item--form-col">
               <label>Tiêu đề <span className='required'>(*)</span></label>
               <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
               />
               {errors.title && <p className="error-message">{errors.title}</p>}
            </div>
         </div>

         <h3>Địa chỉ làm việc</h3>
         <div className="container-item--form-row col-3">
            <div className={`container-item--form-col ${errors.province ? 'has-error' : ''}`}>
               <label>Tỉnh / Thành phố <span className='required'>(*)</span></label>
               <select name="province" id="province" value={formData.province} onChange={handleProvinceChange}>
                  <option value="">Chọn Tỉnh / Thành phố</option>
                  {provinces.map((province) => (
                     <option key={province.code} value={province.code}>
                        {province.fullName}
                     </option>
                  ))}
               </select>
               {errors.province && <p className="error-message">{errors.province}</p>}
            </div>

            <div className={`container-item--form-col ${errors.district ? 'has-error' : ''}`}>
               <label>Quận / Huyện <span className='required'>(*)</span></label>
               <select name="district" id="district" value={formData.district} onChange={handleDistrictChange}>
                  <option value="">Chọn Quận / Huyện</option>
                  {districts.map((district) => (
                     <option key={district.code} value={district.code}>
                        {district.fullName}
                     </option>
                  ))}
               </select>
               {errors.district && <p className="error-message">{errors.district}</p>}
            </div>

            <div className={`container-item--form-col ${errors.ward ? 'has-error' : ''}`}>
               <label htmlFor="ward">Phường / Xã <span className='required'>(*)</span></label>
               <select name="ward" id="ward" value={formData.ward} onChange={handleInputChange}>
                  <option value="">Chọn Phường / Xã</option>
                  {wards.map((ward) => (
                     <option key={ward.code} value={ward.code}>
                        {ward.fullName}
                     </option>
                  ))}
               </select>
               {errors.ward && <p className="error-message">{errors.ward}</p>}
            </div>
         </div>

         <div className="container-item--form-row">
            <div className={`container-item--form-col ${errors.location ? 'has-error' : ''}`}>
               <label>Địa chỉ cụ thể <span className='required'>(*)</span></label>
               <textarea
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
               />
               {errors.location && <p className="error-message">{errors.location}</p>}
            </div>
         </div>

         <h3>Vị trí tuyển dụng</h3>
         <div className="container-item--form-row">
            <div className={`container-item--form-col ${errors.jobCategory ? 'has-error' : ''}`}>
               <label>Ngành nghề <span className='required'>(*)</span></label>
               <select name="jobCategory" id="jobCategory" value={formData.jobCategory} onChange={handleJobCategoryChange}>
                  <option value="">Lựa chọn ngành nghề</option>
                  {jobCategories.map((category) => (
                     <option key={category.id} value={category.id}>
                        {category.type}
                     </option>
                  ))}
               </select>
               {errors.jobCategory && <p className="error-message">{errors.jobCategory}</p>}
            </div>

            <div className={`container-item--form-col ${errors.jobSubCategory ? 'has-error' : ''}`}>
               <label>Ngành nghề cụ thể<span className='required'>(*)</span></label>
               <select name="jobSubCategory" id="jobSubCategory" value={formData.jobSubCategory} onChange={handleInputChange}>
                  <option value="">Lựa chọn ngành nghề cụ thể</option>
                  {jobSubCategories.map((jobSubCategory) => (
                     <option key={jobSubCategory.id} value={jobSubCategory.id}>
                        {jobSubCategory.name}
                     </option>
                  ))}
               </select>
               {errors.jobSubCategory && <p className="error-message">{errors.jobSubCategory}</p>}
            </div>
         </div>

         <h3>Chi tiết tuyển dụng</h3>
         <div className="container-item--form-row">
            <div className={`container-item--form-col ${errors.salary ? 'has-error' : ''}`}>
               <label>Mức lương <span className='required'>(*)</span></label>
               <select name="salary" id="salary" value={formData.salary} onChange={handleInputChange}>
                  <option value="">Lựa chọn mức lương</option>
                  {salaries.map((salary) => (
                     <option key={salary.id} value={salary.id}>
                        {salary.name}
                     </option>
                  ))}
               </select>
               {errors.salary && <p className="error-message">{errors.salary}</p>}
            </div>

            <div className={`container-item--form-col ${errors.experience ? 'has-error' : ''}`}>
               <label>Kinh nghiệm <span className='required'>(*)</span></label>
               <select name="experience" id="experience" value={formData.experience} onChange={handleInputChange}>
                  <option value="">Lựa chọn mức kinh nghiệm</option>
                  {experiences.map((experience) => (
                     <option key={experience.id} value={experience.id}>
                        {experience.name}
                     </option>
                  ))}
               </select>
               {errors.experience && <p className="error-message">{errors.experience}</p>}
            </div>
         </div>

         <div className="container-item--form-row">
            <div className={`container-item--form-col ${errors.quantity ? 'has-error' : ''}`}>
               <label>Số lượng tuyển dụng <span className='required'>(*)</span></label>
               <input
                  id="quantity"
                  name="quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={handleInputChange}
               />
               {errors.quantity && <p className="error-message">{errors.quantity}</p>}
            </div>

            <div className={`container-item--form-col ${errors.expired ? 'has-error' : ''}`}>
               <label>Thời hạn tuyển dụng <span className='required'>(*)</span></label>
               <input
                  type="date"
                  name="expired"
                  id="expired"
                  value={formData.expired}
                  onChange={handleInputChange}
               />
               {errors.expired && <p className="error-message">{errors.expired}</p>}
            </div>
         </div>

         <div className="container-item--form-row">
            <div className={`container-item--form-col ${errors.details ? 'has-error' : ''}`}>
               <label>Mô tả công việc <span className='required'>(*)</span></label>
               <textarea
                  name="details"
                  id="details"
                  value={formData.details}
                  onChange={handleInputChange}
               >
               </textarea>
               {errors.details && <p className="error-message">{errors.details}</p>}
            </div>
         </div>

         <div className="container-item--form-row">
            <div className={`container-item--form-col ${errors.requirements ? 'has-error' : ''}`}>
               <label>Yêu cầu ứng viên <span className='required'>(*)</span></label>
               <textarea
                  name="requirements"
                  id="requirements"
                  value={formData.requirements}
                  onChange={handleInputChange}
               >
               </textarea>
               {errors.requirements && <p className="error-message">{errors.requirements}</p>}
            </div>
         </div>

         <div className="container-item--form-row">
            <div className={`container-item--form-col ${errors.benefit ? 'has-error' : ''}`}>
               <label>Quyền lợi <span className='required'>(*)</span></label>
               <textarea
                  name="benefit"
                  id="benefit"
                  value={formData.benefit}
                  onChange={handleInputChange}
               >
               </textarea>
               {errors.benefit && <p className="error-message">{errors.benefit}</p>}
            </div>
         </div>

         <div className="container-item--form-row">
            <div className={`container-item--form-col ${errors.workTime ? 'has-error' : ''}`}>
               <label>Thời gian làm việc <span className='required'>(*)</span></label>
               <textarea
                  name="workTime"
                  id="workTime"
                  value={formData.workTime}
                  onChange={handleInputChange}
               >
               </textarea>
               {errors.workTime && <p className="error-message">{errors.workTime}</p>}
            </div>
         </div>

         <div className="container-item--form-row" style={{ justifyContent: 'end' }}>
            <button
               id='btnCancel'
               className='btn-action'
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
   )
}

export default CompanyPost;