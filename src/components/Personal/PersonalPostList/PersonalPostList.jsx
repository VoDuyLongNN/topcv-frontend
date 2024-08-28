import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import HomeIcon from '@mui/icons-material/Home';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import { getToken } from '../../../service/token';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import './PersonalPostList.css';

const PersonalPostList = ({
   setIsUpdating,
   setShowMessage,
   setMessageType,
   setMessage,
}) => {
   const [posts, setPosts] = useState([]);
   const [currentPage, setCurrentPage] = useState(0);
   const [totalPages, setTotalPages] = useState(1);
   const [criteria, setCriteria] = useState('');
   const [values, setValues] = useState([]);
   const [selectedValue, setSelectedValue] = useState('');
   const [isOverlayVisible, setIsOverlayVisible] = useState(false);
   const [editingPostId, setEditingPostId] = useState(null);
   const [provinces, setProvinces] = useState([]);
   const [formData, setFormData] = useState({
      title: '',
      workType: '',
      description: '',
      province: '',
      jobCategory: '',
      jobSubCategory: '',
      phone: '',
      email: '',
      numberSaved: ''
   });

   const token = getToken();

   useEffect(() => {
      setIsUpdating(true);
      axios.get(`http://localhost:8080/post-personal/get-by-personal`, {
         params: {
            page: currentPage,
            size: 4,
            province: criteria === 'province' ? selectedValue : null,
            status: criteria === 'status' ? selectedValue : null,
            jobType: criteria === 'jobType' ? selectedValue : null,
         },
         headers: {
            'Authorization': `Bearer ${token}`,
         }
      })
         .then(response => {
            setIsUpdating(false);
            const data = response.data;
            setPosts(data.data);
            setTotalPages(data.totalPages);
         })
         .catch(error => console.error('Error fetching posts:', error));

      // get api provine
      axios.get('http://localhost:8080/public/province/get-all')
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
   }, [currentPage, selectedValue]);

   const handleNextPage = () => {
      if (currentPage < totalPages - 1) {
         setIsUpdating(true);
         setCurrentPage(currentPage + 1);
         setIsUpdating(false);
      }
   };

   const handlePreviousPage = () => {
      if (currentPage > 0) {
         setIsUpdating(true);
         setCurrentPage(currentPage - 1);
         setIsUpdating(false);
      }
   };

   const handleCriteriaChange = (event) => {
      const selectedCriteria = event.target.value;
      setCriteria(selectedCriteria);

      if (selectedCriteria === 'province') {
         axios.get('http://localhost:8080/public/province/get-all')
            .then(response => {
               const provinces = response.data.data;
               setValues(provinces.map(province => ({ name: province.name })));
            })
            .catch(error => console.error('Error fetching provinces:', error));
      } else if (selectedCriteria === 'status') {
         setValues([
            { name: 'ACTIVE' },
            { name: 'UNACTIVE' }
         ]);
      } else if (selectedCriteria === 'jobType') {
         axios.get('http://localhost:8080/job-category/get-all', {
            headers: {
               'Authorization': `Bearer ${token}`,
            }
         })
            .then(response => {
               const jobTypes = response.data.data;
               setValues(jobTypes.map(jobType => ({ name: jobType.type })));
            })
            .catch(error => console.error('Error fetching jobTypes:', error));
      }
      else {
         setValues([]);
      }
      setSelectedValue('');
   };

   const handleValueChange = (event) => {
      setSelectedValue(event.target.value);
      setCurrentPage(0);
   };

   const handleDelete = (postId) => {
      confirmAlert({
         title: 'Xác nhận xóa',
         message: 'Bạn có chắc chắn muốn xóa bài đăng này không?',
         buttons: [
            {
               className: 'yes',
               label: 'Xóa',
               onClick: () => {
                  axios.delete('http://localhost:8080/post-personal/delete', {
                     headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                     },
                     data: {
                        id: postId
                     }
                  })
                     .then(response => {
                        window.location.reload();
                     })
                     .catch(error => console.error('Error deleting post:', error));
               }
            },
            {
               label: 'Không',
            }
         ]
      });
   };

   const handleEdit = (postId) => {
      setEditingPostId(postId);
      setIsOverlayVisible(true);

      axios.get(`http://localhost:8080/post-personal/get/${postId}`, {
         headers: {
            'Authorization': `Bearer ${token}`,
         }
      })
         .then(response => {
            const post = response.data.data;
            setFormData({
               title: post.title,
               workType: post.workType,
               description: post.description,
               province: post.province,
               jobCategory: post.jobType,
               jobSubCategory: post.jobName,
               phone: post.phone,
               email: post.email
            });
         })
         .catch(error => console.error('Error fetching post data:', error));
   };

   const closeOverlay = () => {
      setIsOverlayVisible(false);
      setEditingPostId(null);
   };

   const handleSave = (e) => {
      e.preventDefault();
      setIsUpdating(true)
      axios.put('http://localhost:8080/post-personal/update', {
         id: editingPostId,
         title: formData.title,
         province: formData.province,
         workType: formData.workType,
         description: formData.description
      }, {
         headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
         }
      })
         .then(response => {
            setIsUpdating(false)
            if (response.data.status === 'OK') {
               setMessage(response.data.message);
               setMessageType('success');
               setShowMessage(true);
               setTimeout(() => {
                  window.location.reload();
               }, 2000);
            } else {
               setMessage(response.data.message);
               setMessageType('error');
               setShowMessage(true);
            }
         })
         .catch(error => {
            setIsUpdating(false);
            setMessage(error.response.data.message);
            setMessageType('error');
            setShowMessage(true);
         });
   }

   return (
      <div className="post-list-container">
         <h2>Danh sách bài đăng của bạn</h2>
         <div className="post-list-filter">
            <FilterListIcon />
            <select name="" id="" className='criteria' onChange={handleCriteriaChange}>
               <option value="">Tất cả</option>
               <option value="province">Địa điểm</option>
               <option value="status">Trạng thái</option>
               <option value="jobType">Ngành nghề</option>
            </select>
            <select name="" id="" className='value' onChange={handleValueChange} value={selectedValue}>
               <option value="">Lựa chọn</option>
               {values.length > 0 ? (
                  values.map((item) => (
                     <option key={item.name} value={item.code}>{item.name}</option>
                  ))
               ) : (
                  <option value="">Không có giá trị</option>
               )}
            </select>
         </div>
         {posts.map((post) => (
            <Link className="post-list-row" key={post.id}>
               <div className="post-list-col">
                  <div className="post-list-title">{post.title}</div>
                  <div className="post-list-address-time">
                     <div className="address">
                        <HomeIcon className='icon' />
                        <span>{post.province}</span>
                     </div>
                     <div className="time">
                        <AccessTimeFilledIcon className='icon' />
                        <span>{post.workType.replace('_', ' ')}</span>
                     </div>
                  </div>
                  <div className="post-list-job">
                     <span className='fixed'>Công việc:</span> <span>{post.jobType} / {post.jobName}</span>
                  </div>
                  <div className="post-list-desc">
                     {post.description}
                  </div>
                  <div className="post-list-status">
                     <span className={post.status.toLowerCase()}>{post.status}</span>
                  </div>
                  <div className="post-list-bottom">
                     <div className="post-list-date">
                        <div>
                           <span className='fix'>Ngày đăng bài: </span>
                           <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div>
                           <span className='fix'>Số lượt quan tâm: </span>
                           <span>{post.numberSaved}</span>
                        </div>
                     </div>
                     <div className="post-list-action">
                        <button id='post-list-edit' onClick={() => handleEdit(post.id)}>Sửa</button>
                        <button id='post-list-delete' onClick={() => handleDelete(post.id)}>Xóa</button>
                     </div>
                  </div>
               </div>
            </Link>
         ))}
         <div className="pagination">
            <button onClick={handlePreviousPage} disabled={currentPage === 0}>
               <KeyboardArrowLeftIcon />
            </button>
            <span>Trang {currentPage + 1} / {totalPages}</span>
            <button onClick={handleNextPage} disabled={currentPage >= totalPages - 1}>
               <ChevronRightIcon />
            </button>
         </div>

         {/* Overlay */}
         {isOverlayVisible && (
            <div className="post-list-overlay">
               <div className="post-list-overlay-content">
                  <h3>Sửa bài đăng</h3>
                  <p>ID bài đăng: {editingPostId}</p>
                  <CloseIcon
                     className='icon'
                     onClick={closeOverlay}
                  />
                  <form className='container-item--form'>
                     <div className="container-item--form-row">
                        <div className={`container-item--form-col`}>
                           <label htmlFor="title">Tiêu đề <span className='required'>(*)</span></label>
                           <input
                              type="text"
                              name="title"
                              id="title"
                              value={formData.title}
                              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                           />
                        </div>
                     </div>

                     <div className="container-item--form-row">
                        <div className={`container-item--form-col`}>
                           <label htmlFor="province">Tỉnh thành<span className='required'>(*)</span></label>
                           <select
                              name="province"
                              id="province"
                              value={formData.province}
                              onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                           >
                              <option value="">Chọn tỉnh/thành</option>
                              {provinces.map((province) => (
                                 <option key={province.code} value={province.code}>
                                    {province.name}
                                 </option>
                              ))}
                           </select>
                        </div>
                     </div>

                     <div className="container-item--form-row">
                        <div className={`container-item--form-col`}>
                           <label htmlFor="workTime">Thời gian làm việc <span className='required'>(*)</span></label>
                           <select
                              name="workTime"
                              id="workTime"
                              value={formData.workType}
                              onChange={(e) => setFormData({ ...formData, workType: e.target.value })}
                           >
                              <option value="">Chọn thời gian làm việc</option>
                              <option value="FULL_TIME">Full time</option>
                              <option value="PART_TIME">Part time</option>
                           </select>
                        </div>
                     </div>

                     <div className="container-item--form-row">
                        <div className={`container-item--form-col`}>
                           <label htmlFor="description">Mô tả thêm <span className='required'>(*)</span></label>
                           <textarea
                              name="description"
                              id="description"
                              value={formData.description}
                              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                           ></textarea>
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
                           onClick={closeOverlay}
                        >
                           Hủy bỏ
                        </button>
                        <button
                           id='btnSave'
                           className={'btn-action , enabled'}
                           onClick={handleSave}
                        >
                           Lưu
                        </button>
                     </div>
                  </form>
               </div>
            </div>
         )}

      </div>
   );
};

export default PersonalPostList;
