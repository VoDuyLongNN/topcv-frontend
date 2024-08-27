import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import './Filter.css';

const Filter = ({ onSortChange, onProvinceChange, onJobTypeChange, onSearchChange }) => {
   const [criteria, setCriteria] = useState('');
   const [values, setValues] = useState([]);
   const [selectedValue, setSelectedValue] = useState('');
   const [searchQuery, setSearchQuery] = useState('');

   useEffect(() => {
      if (criteria === 'province') {
         axios.get('http://localhost:8080/province/get-all')
            .then(response => {
               const provinces = response.data.data;
               setValues(provinces.map(province => ({ name: province.name, code: province.code })));
            })
            .catch(error => console.error('Error fetching provinces:', error));
      } else if (criteria === 'jobType') {
         axios.get('http://localhost:8080/job-category/get-all')
            .then(response => {
               const jobTypes = response.data.data;
               setValues(jobTypes.map(jobType => ({ name: jobType.type, code: jobType.type })));
            })
            .catch(error => console.error('Error fetching jobTypes:', error));
      } else {
         setValues([]);
         setSelectedValue('');
         onProvinceChange('');
         onJobTypeChange('');
      }
   }, [criteria]);

   const handleCriteriaChange = (event) => {
      setCriteria(event.target.value);
      setSelectedValue('');
   };

   const handleValueChange = (event) => {
      const value = event.target.value;
      setSelectedValue(value);

      if (criteria === 'province') {
         onProvinceChange(value);
      } else if (criteria === 'jobType') {
         onJobTypeChange(value);
      }
   };

   const handleSortChange = (event) => {
      const sortDirection = event.target.value;
      onSortChange(sortDirection);
   };

   const handleSearchChange = (event) => {
      const query = event.target.value;
      setSearchQuery(query);
   };

   const handleSearchSubmit = () => {
      onSearchChange(searchQuery);
   };

   const handleKeyDown = (event) => {
      if (event.key === 'Enter') {
         handleSearchSubmit();
      }
   };

   return (
      <div className="filter">
         <div className="post-list-filter">
            <FilterListIcon />
            <select
               name="criteria"
               className="criteria"
               onChange={handleCriteriaChange}
               value={criteria}
            >
               <option value="">Tất cả</option>
               <option value="province">Địa điểm</option>
               <option value="jobType">Ngành nghề</option>
            </select>
            <select
               name="value"
               className="value"
               onChange={handleValueChange}
               value={selectedValue}
            >
               <option value="">Tất cả</option>
               {values.length > 0 ? (
                  values.map((item) => (
                     <option key={item.code} value={item.name}>{item.name}</option>
                  ))
               ) : (
                  <option value="">Không có giá trị</option>
               )}
            </select>

            <div className="post-search">
               <input
                  type="text"
                  placeholder='Tìm kiếm'
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onKeyDown={handleKeyDown}
               />
               <button onClick={handleSearchSubmit}>  
                  <SearchIcon className='icon' />
                  <span>Tìm kiếm</span>
               </button>
            </div>
         </div>

         <div className="post-list-filter sort">
            <SwapVertIcon />
            <span>Ngày đăng bài:</span>
            <select name="sortDirection" id="sortDirection" onChange={handleSortChange}>
               <option value="desc">Mới nhất</option>
               <option value="asc">Cũ nhất</option>
            </select>
         </div>
      </div>
   );
};

export default Filter;
