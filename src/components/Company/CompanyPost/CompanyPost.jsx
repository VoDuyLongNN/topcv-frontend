import React, { useEffect, useState } from "react";
import axios from "axios";
import './CompanyPost.css';

const CompanyPost = () => {
   const [provinces, setProvinces] = useState([]);
   const [districts, setDistricts] = useState([]);
   const [wards, setWards] = useState([]);
   const [salaries, setSalaries] = useState([]);
   const [selectedProvince, setSelectedProvince] = useState('');
   const [selectedDistrict, setSelectedDistrict] = useState('');

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
   }, []);

   const handleProvinceChange = (event) => {
      const provinceCode = event.target.value;
      setSelectedProvince(provinceCode);

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

   return (
      <form action="" className="container-item--form">
         <h2>Đăng bài tuyển dụng</h2>
         <div className="container-item--form-row col-1">
            <div className="container-item--form-col">
               <label>Tiêu đề <span className='required'>(*)</span></label>
               <input
                  type="text"
                  name=""
               />
            </div>
         </div>

         <h3>Địa chỉ làm việc</h3>
         <div className="container-item--form-row col-3">
            <div className="container-item--form-col">
               <label>Tỉnh / Thành phố <span className='required'>(*)</span></label>
               <select name="province" id="province" onChange={handleProvinceChange}>
                  <option value="">Chọn Tỉnh / Thành phố</option>
                  {provinces.map((province) => (
                     <option key={province.code} value={province.code}>
                        {province.fullName}
                     </option>
                  ))}
               </select>
            </div>

            <div className="container-item--form-col">
               <label>Quận / Huyện <span className='required'>(*)</span></label>
               <select name="district" id="district" onChange={handleDistrictChange}>
                  <option value="">Chọn Quận / Huyện</option>
                  {districts.map((district) => (
                     <option key={district.code} value={district.code}>
                        {district.fullName}
                     </option>
                  ))}
               </select>
            </div>

            <div className="container-item--form-col">
               <label>Phường / Xã <span className='required'>(*)</span></label>
               <select name="ward" id="ward">
                  <option value="">Chọn Phường / Xã</option>
                  {wards.map((ward) => (
                     <option key={ward.code} value={ward.code}>
                        {ward.fullName}
                     </option>
                  ))}
               </select>
            </div>
         </div>

         <div className="container-item--form-row">
            <div className="container-item--form-col">
               <label>Địa chỉ cụ thể <span className='required'>(*)</span></label>
               <textarea
                  name=""
               />
            </div>
         </div>

         <h3>Vị trí tuyển dụng</h3>
         <div className="container-item--form-row">
            <div className="container-item--form-col">
               <label>Ngành nghề <span className='required'>(*)</span></label>
               <input
                  type="text"
                  name=""
               />
            </div>

            <div className="container-item--form-col">
               <label>Ngành nghề cụ thể<span className='required'>(*)</span></label>
               <input
                  type="text"
                  name=""
               />
            </div>
         </div>

         <h3>Chi tiết tuyển dụng</h3>
         <div className="container-item--form-row">
            <div className="container-item--form-col">
               <label>Mức lương <span className='required'>(*)</span></label>
               <select name="salary" id="salary">
                  <option value="">Lựa chọn mức lương</option>
                  {salaries.map((salary) => (
                     <option key={salary.id} value={salary.id}>
                        {salary.name}
                     </option>
                  ))}
               </select>
            </div>

            <div className="container-item--form-col">
               <label>Kinh nghiệm <span className='required'>(*)</span></label>
               <select name="" id="">
                  <option value="">Lựa chọn mức kinh nghiệm</option>
               </select>
            </div>
         </div>

         <div className="container-item--form-row">
            <div className="container-item--form-col">
               <label>Số lượng tuyển dụng <span className='required'>(*)</span></label>
               <input type="number" />
            </div>

            <div className="container-item--form-col">
               <label>Thời hạn tuyển dụng <span className='required'>(*)</span></label>
               <input type="date" name="" id="" />
            </div>
         </div>

         <div className="container-item--form-row">
            <div className="container-item--form-col">
               <label>Mô tả công việc <span className='required'>(*)</span></label>
               <textarea name="" id=""></textarea>
            </div>
         </div>

         <div className="container-item--form-row">
            <div className="container-item--form-col">
               <label>Yêu cầu ứng viên <span className='required'>(*)</span></label>
               <textarea name="" id=""></textarea>
            </div>
         </div>

         <div className="container-item--form-row">
            <div className="container-item--form-col">
               <label>Quyền lợi <span className='required'>(*)</span></label>
               <textarea name="" id=""></textarea>
            </div>
         </div>

         <div className="container-item--form-row">
            <div className="container-item--form-col">
               <label>Thời gian làm việc <span className='required'>(*)</span></label>
               <textarea name="" id=""></textarea>
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
               className={`btn-action`}
            >
               Tạo
            </button>
         </div>
      </form>
   )
}

export default CompanyPost;