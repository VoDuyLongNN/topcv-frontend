import React, { useState, useEffect, useRef } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import axios from 'axios';
import Header from '../Header/Header';
import HomeIcon from '@mui/icons-material/Home';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import Skeleton from '@mui/material/Skeleton';
import { getToken } from '../../service/token';
import { getRole } from '../../service/getRole';
import { calculateAge } from '../../service/calculateAge';
import defaultAvt from '../../assets/default-avt/default.png';
import './ViewPostPersonal.css';

const ViewPostPersonal = () => {
   const { id } = useParams();
   const [post, setPost] = useState();
   const [isSaved, setIsSaved] = useState(false);
   const [userRole, setUserRole] = useState('');
   const [personalData, setPersonalData] = useState({
      personalId: '',
      avtUrl: defaultAvt,
      email: '',
      firstName: '',
      lastName: '',
      phone: '',
      birthDay: '',
      gender: '',
   });
   const token = getToken();

   useEffect(() => {
      const fetchPost = async () => {
         try {
            const response = await axios.post(
               'http://localhost:8080/public/personal-get-post-by-id',
               { id },
               {
                  headers: {
                     'Content-Type': 'application/json',
                  },
               }
            );

            if (response.data.status === 'OK') {
               setPost(response.data.data);

               const role = getRole();
               setUserRole(role);

               if (role === 'ROLE_COMPANY') {
                  const savedPostsResponse = await axios.get(`http://localhost:8080/company/get-saved-post`, {
                     headers: {
                        'Authorization': `Bearer ${token}`,
                     }
                  });

                  if (savedPostsResponse.data.status === 'OK') {
                     setIsSaved(savedPostsResponse.data.data.includes(parseInt(id, 10)));
                  }
               }
            }
         } catch (err) {
            console.log(err);
         }
      };

      const fetchPersonal = async () => {
         try {
            const response = await axios.get(`http://localhost:8080/public/get-personal-by-post-id/${id}`);

            if (response.data.status === 'OK') {
               setPersonalData(response.data.data);
            }
         } catch (err) {
            console.log(err.message);
         }
      };

      fetchPost();
      fetchPersonal();
   }, []);

   const handleSaveClick = async () => {
      const url = isSaved ? `http://localhost:8080/company/un-save-post` : `http://localhost:8080/company/save-post`;
      try {
         const response = await axios.post(url, { postId: id }, {
            headers: {
               'Authorization': `Bearer ${token}`,
               'Content-Type': 'application/json',
            },
         });

         if (response.data.status === 'OK') {
            setIsSaved(!isSaved);
         }
      } catch (error) {
         console.error('Error saving or unsaving post:', error);
      }
   };

   return (
      <div>
         <Header />
         <div className="post-desc-nav">
            <Breadcrumbs aria-label="breadcrumb" separator={<NavigateNextIcon fontSize="small" />}>
               <Link component={RouterLink} to="/" underline="hover" color="inherit">
                  Việc làm
               </Link>
               <span>{post ? post.title : <Skeleton width={200} />}</span>
            </Breadcrumbs>
         </div>
         <div className="post-desc-container">
            <div className="post-desc-header">
               <div className="post-desc-header-left">
                  <strong>Bài viết tìm việc</strong>
                  <h2>{post ? post.title : <Skeleton width="60%" />}</h2>
                  <div className="post-desc-icon">
                     <div className='post-desc-icon-item'>
                        <HomeIcon className='icon' />
                        <div className='value'>
                           <span>Địa điểm</span>
                           <span className='span-value'>{post ? post.province : <Skeleton width={100} />}</span>
                        </div>
                     </div>

                     <div className='post-desc-icon-item'>
                        <AccessTimeFilledIcon className='icon' />
                        <div className='value'>
                           <span>Thời gian làm việc</span>
                           <span className='span-value'>{post ? (post.workType === 'FULL_TIME' ? 'Full time' : 'Part time') : <Skeleton width={100} />}</span>
                        </div>
                     </div>
                  </div>

                  <div className="post-desc-header-create-date">
                     <span>
                        <span>Ngày đăng bài: </span>
                        {post ? new Date(post.createdAt).toLocaleDateString() : <Skeleton width={80} />}
                     </span>
                  </div>
               </div>

               <div className="post-desc-header-right">
                  <div className="avt">
                     <img src={personalData.avtUrl ? `http://localhost:8080/avatars/${personalData.avtUrl}` : defaultAvt} alt="" />
                  </div>
                  <div className="personal-desc">
                     <span className="name">{personalData.firstName && personalData.lastName
                        ? `${personalData.firstName} ${personalData.lastName}`
                        : 'Không xác định'}</span>
                     <span>
                        <strong>Giới tính: </strong>
                        <span>{personalData.gender === true
                           ? 'Nam'
                           : personalData.gender === false
                              ? 'Nữ'
                              : 'Không xác định'}</span>
                     </span>
                     <span>
                        <strong>Tuổi: </strong>
                        <span>{personalData.birthDay ? calculateAge(personalData.birthDay) : 'Không xác định'}</span>
                     </span>
                     <span>
                        <strong>SĐT: </strong>
                        <span>{personalData.phone ? personalData.phone : 'Không xác định'}</span>
                     </span>
                  </div>
               </div>
            </div>
            <div className="post-desc-details">
               <h3>Chi tiết bài viết</h3>
               <p><strong>Công việc: </strong> {post ? `${post.jobType} / ${post.jobName}` : <Skeleton width="80%" />}</p>
               <div>
                  <strong className='desc'>Mô tả:</strong>
                  <p className='desc'>{post ? post.description : <Skeleton width="100%" height={100} />}</p>
               </div>

               <p><strong>Email:</strong> {post ? post.email : <Skeleton width={200} />}</p>

               <div className="post-desc-btn">
                  {userRole === 'ROLE_COMPANY' && (
                     <>
                        <button>Liên hệ</button>
                        <button id='btnSave' onClick={handleSaveClick} style={{ color: isSaved ? 'gold' : '#bdbdbd', borderColor: isSaved ? 'gold' : '#bdbdbd' }}>
                           <BookmarkIcon />
                           <span>{isSaved ? 'Bỏ lưu' : 'Lưu'}</span>
                        </button>
                     </>
                  )}
               </div>
            </div>
         </div>
      </div>
   );
};

export default ViewPostPersonal;
