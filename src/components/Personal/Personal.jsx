import { useState, useEffect, React } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import KeyIcon from '@mui/icons-material/Key';
import PersonIcon from '@mui/icons-material/Person';
import PostAddIcon from '@mui/icons-material/PostAdd';
import HomeIcon from '@mui/icons-material/Home';
import SchoolIcon from '@mui/icons-material/School';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import ListAltIcon from '@mui/icons-material/ListAlt';
import ChangePassword from './ChangePassword/ChangePassword';
import Header from '../Header/Header';
import PersonalInfo from './PersonalInfor/PersonalInfor';
import PersonalPost from './PersonalPost/PersonalPost';
import PersonalPostList from './PersonalPostList/PersonalPostList';
import AvatarComponent from '../Avatar/Avatar';
import './Personal.css';

const Personal = () => {
   const navigate = useNavigate();
   const location = useLocation();
   const [activeSection, setActiveSection] = useState('personal');
   const [isUpdating, setIsUpdating] = useState(false);
   const [showMessage, setShowMessage] = useState(false);
   const [messageType, setMessageType] = useState('');
   const [message, setMessage] = useState('');
   const [formData, setFormData] = useState({
      firstName: '',
      lastName: '',
      address: '',
      location: '',
      education: '',
      gender: false,
      phone: '',
      skill: '',
      description: '',
      email: '',
   });

   useEffect(() => {
      if (location.pathname === '/personal/change-password') {
         setActiveSection('password');
      } else if (location.pathname === '/personal/profile') {
         setActiveSection('personal');
      } else if (location.pathname === '/personal/create-post') {
         setActiveSection('createPost')
      } else if (location.pathname === '/personal/post-list') {
         setActiveSection('postList')
      } else {
         navigate('/personal/profile');
         setActiveSection('personal');
      }
   }, [location.pathname, navigate]);

   const handleSectionChange = (section) => {
      setActiveSection(section);
      if (section === 'password') {
         navigate('/personal/change-password');
      } else if (section === 'createPost') {
         navigate('/personal/create-post');
      } else if (section === 'postList') {
         navigate('/personal/post-list');
      }
      else {
         navigate('/personal/profile');
      }
   };

   return (
      <div>
         <Header />
         <div className="personal-container">
            {isUpdating && (
               <div className="overlay">
                  <div className="spinner"></div>
               </div>
            )}
            {showMessage && (
               <div className={`message-container ${messageType} ${showMessage ? 'show' : ''}`}>
                  {message}
               </div>
            )}
            <div className="container-item">
               <AvatarComponent
                  isUpdating={isUpdating}
                  setIsUpdating={setIsUpdating}
                  showMessage={showMessage}
                  setShowMessage={setShowMessage}
                  messageType={messageType}
                  setMessageType={setMessageType}
                  message={message}
                  setMessage={setMessage}
               />
               <div className="container-item--desc">
                  <p id='name'>{formData.firstName + ' ' + formData.lastName}</p>
                  <span id='address'>
                     <HomeIcon className='icon' /> <span>: {formData.address}</span>
                  </span>
                  <span id='education'>
                     <SchoolIcon className='icon' /> <span>: {formData.education}</span>
                  </span>
               </div>
            </div>

            <div className="container-content">
               <div className="container-item-left">
                  {activeSection === 'personal' && (
                     <PersonalInfo
                        isUpdating={isUpdating}
                        setIsUpdating={setIsUpdating}
                        showMessage={showMessage}
                        setShowMessage={setShowMessage}
                        messageType={messageType}
                        setMessageType={setMessageType}
                        message={message}
                        setMessage={setMessage}
                        formData={formData}
                        setFormData={setFormData}
                     />
                  )}
                  {activeSection === 'password' && (
                     <ChangePassword
                        isUpdating={isUpdating}
                        setIsUpdating={setIsUpdating}
                        showMessage={showMessage}
                        setShowMessage={setShowMessage}
                        messageType={messageType}
                        setMessageType={setMessageType}
                        message={message}
                        setMessage={setMessage}
                     />
                  )}
                  {activeSection === 'createPost' && (
                     <PersonalPost
                        isUpdating={isUpdating}
                        setIsUpdating={setIsUpdating}
                        showMessage={showMessage}
                        setShowMessage={setShowMessage}
                        messageType={messageType}
                        setMessageType={setMessageType}
                        message={message}
                        setMessage={setMessage}
                     />
                  )}
                  {activeSection === 'postList' && (
                     <PersonalPostList
                        isUpdating={isUpdating}
                        setIsUpdating={setIsUpdating}
                        showMessage={showMessage}
                        setShowMessage={setShowMessage}
                        messageType={messageType}
                        setMessageType={setMessageType}
                        message={message}
                        setMessage={setMessage}
                     />
                  )}
               </div>

               <div className="container-item-right">
                  <Link
                     to='profile'
                     onClick={() => handleSectionChange('personal')}
                     className={activeSection === 'personal' ? 'active-link' : ''}
                  >
                     <PersonIcon />
                     Thông tin cá nhân
                  </Link>
                  <Link
                     to='change-password'
                     onClick={() => handleSectionChange('password')}
                     className={activeSection === 'password' ? 'active-link' : ''}
                  >
                     <KeyIcon />
                     Đổi mật khẩu
                  </Link>
                  <Link
                     to='create-post'
                     onClick={() => handleSectionChange('createPost')}
                     className={activeSection === 'createPost' ? 'active-link' : ''}
                  >
                     <PostAddIcon />
                     Đăng bài
                  </Link>
                  <Link
                     to='post-list'
                     onClick={() => handleSectionChange('postList')}
                     className={activeSection === 'postList' ? 'active-link' : ''}
                  >
                     <ListAltIcon />
                     Xem tất cả bài đăng của bạn
                  </Link>
                  <Link

                  >
                     <BookmarkIcon />
                     Bài tuyển dụng đã lưu
                  </Link>
               </div>
            </div>
         </div>
      </div>
   );
};

export default Personal;
