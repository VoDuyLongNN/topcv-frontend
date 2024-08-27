import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Job.css';
import Filter from '../Filter/Filter';
import SliderComponent from '../Slider/Slider';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Tooltip from '@mui/material/Tooltip';
import Skeleton from '@mui/material/Skeleton';
import Counter from '../Counter/Counter';
import { getRole } from '../../service/getRole';
import { getToken } from '../../service/token';

const Job = () => {
   const [posts, setPosts] = useState([]);
   const [currentPage, setCurrentPage] = useState(0);
   const [totalPages, setTotalPages] = useState(1);
   const [totalPosts, setTotalPosts] = useState(0);
   const [province, setProvince] = useState();
   const [jobType, setJobType] = useState();
   const [sortDir, setSortDir] = useState('desc');
   const [pageSize, setPageSize] = useState(6);
   const [searchQuery, setSearchQuery] = useState('');
   const [isUpdating, setIsUpdating] = useState(false);
   const [savedPostIds, setSavedPostIds] = useState([]);

   const token = getToken();

   useEffect(() => {
      fetchPosts(currentPage);
      fetchCountPost();
      if (getRole() === 'ROLE_COMPANY') {
         fetchSavedPosts();
      }
   }, [currentPage, sortDir, province, jobType, searchQuery]);

   const fetchSavedPosts = async () => {
      try {
         const response = await axios.get(`http://localhost:8080/company/get-saved-post`, {
            headers: {
               'Authorization': `Bearer ${token}`,
            }
         });

         if (response.data.status === 'OK') {
            setSavedPostIds(response.data.data);
         }
      } catch (error) {
         console.error('Error fetching saved posts:', error);
      }
   }

   const fetchCountPost = async () => {
      try {
         const response = await axios.get('http://localhost:8080/public/get-total-personal-post');

         if (response.data.status === 'OK') {
            setTotalPosts(response.data.data)
         }
      } catch (error) {
         console.error('Error fetching posts:', error);
      }
   }

   const fetchPosts = async (page) => {
      try {
         setIsUpdating(true);
         setPosts([]);
         const response = await axios.get('http://localhost:8080/public/get-all-active', {
            params: {
               page: page,
               size: pageSize,
               sortDir: sortDir,
               province: province || undefined,
               jobType: jobType || undefined,
               searchQuery: searchQuery || undefined
            },
         });

         if (response.data.status === 'OK') {
            setIsUpdating(false);
            setPosts(response.data.data);
            setTotalPages(response.data.totalPages);
         }
      } catch (error) {
         setIsUpdating(false);
         console.error('Error fetching posts:', error);
      }
   };

   const handleNextPage = () => {
      if (currentPage < totalPages - 1) {
         setCurrentPage(currentPage + 1);
      }
   };

   const handlePreviousPage = () => {
      if (currentPage > 0) {
         setCurrentPage(currentPage - 1);
      }
   };

   const handleSortChange = (sortDirection) => {
      setSortDir(sortDirection);
      setCurrentPage(0);
   };

   const handleProvinceChange = (province) => {
      setProvince(province);
      setJobType('');
      setCurrentPage(0);
   };

   const handleJobTypeChange = (jobType) => {
      setJobType(jobType);
      setProvince('');
      setCurrentPage(0);
   };

   const handleSearchChange = (query) => {
      setSearchQuery(query);
      setCurrentPage(0);
   };

   const handleBookmarkClick = async (postId) => {
      setIsUpdating(true);
      const isSaved = savedPostIds.map(String).includes(String(postId));

      const url = isSaved ? `http://localhost:8080/company/un-save-post` : `http://localhost:8080/company/save-post`;

      try {
         const response = await axios.post(url, { postId }, {
            headers: {
               'Authorization': `Bearer ${token}`,
               'Content-Type': 'application/json'
            }
         });

         if (response.data.status === 'OK') {
            setSavedPostIds((prevIds) => {
               if (isSaved) {
                  return prevIds.filter(id => String(id) !== String(postId));
               } else {
                  return [...prevIds, postId];
               }
            });
         }
      } catch (error) {
         console.error('Error saving or unsaving post:', error);
      } finally {
         setIsUpdating(false);
      }
   };

   return (
      <div className="job-containter">
         <div className="job-banner">
            <h2>Tìm việc làm nhanh 24h, việc làm mới nhất trên toàn quốc.</h2>
            <p>Tiếp cận tin tuyển dụng việc làm mỗi ngày từ hàng nghìn doanh nghiệp uy tín tại Việt Nam</p>
            <SliderComponent />
         </div>
         <div className="job-personal-post">
            <h3>Các bài tìm việc tiềm năng</h3>
            <h5>Với hơn : <Counter number={totalPosts} />+ bài viết</h5>
            <div className="personal-post-filter">
               <Filter
                  onSortChange={handleSortChange}
                  onProvinceChange={handleProvinceChange}
                  onJobTypeChange={handleJobTypeChange}
                  onSearchChange={handleSearchChange}
               />
            </div>

            {isUpdating ? (
               <div className="post-list">
                  {Array.from(new Array(pageSize)).map((_, index) => (
                     <div className="post-item" key={index}>
                        <Skeleton variant="rectangular" height={30} width="80%" />
                        <Skeleton variant="text" width="60%" />
                        <Skeleton variant="text" width="90%" />
                        <Skeleton variant="text" width="80%" />
                        <Skeleton variant="rectangular" height={30} width="40%" />
                     </div>
                  ))}
               </div>
            ) : (
               <div className="post-list">
                  {posts.map((post) => (
                     <div className="post-item" key={post.id}>
                        <div className="post-item-top">
                           <Tooltip title={post.title} placement="top-start">
                              <a
                                 className='post-item-title'
                                 href={`/post-personal/${post.id}`}
                                 target="_blank"
                                 rel="noopener noreferrer"
                              >
                                 {post.title}
                              </a>
                           </Tooltip>

                           <div className="post-top-address">
                              <span className='address'>
                                 {post.province}
                              </span>
                              <span className='job-type'>
                                 {post.workType.replace('_', ' ')}
                              </span>
                           </div>
                        </div>

                        <div className="post-item-job-type">
                           <span className='fix'>Công việc: </span>
                           <span className='value'>{post.jobType} / {post.jobName}</span>
                        </div>

                        <div className="post-item-job-desc">
                           {post.description}
                        </div>

                        <div className="post-item-save">
                           <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                           {getRole() === 'ROLE_COMPANY' && (
                              <Tooltip title={savedPostIds.map(String).includes(String(post.id)) ? 'Bỏ lưu bài viết' : 'Lưu bài viết'}>
                                 <BookmarkIcon
                                    className='post-item-icon'
                                    style={{ color: savedPostIds.map(String).includes(String(post.id)) ? 'gold' : '#bdbdbd' }}
                                    onClick={() => handleBookmarkClick(post.id)}
                                 />
                              </Tooltip>
                           )}
                        </div>
                     </div>
                  ))}
               </div>
            )}

            <div className="pagination">
               <button onClick={handlePreviousPage} disabled={currentPage === 0}>
                  <KeyboardArrowLeftIcon />
               </button>
               <span>Trang {currentPage + 1} / {totalPages}</span>
               <button onClick={handleNextPage} disabled={currentPage >= totalPages - 1}>
                  <ChevronRightIcon />
               </button>
            </div>
         </div>
      </div>
   );
};

export default Job;
