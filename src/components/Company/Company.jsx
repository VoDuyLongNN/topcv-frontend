import { useState, useEffect, React } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Header from '../Header/Header';
import AvatarComponent from '../Avatar/Avatar';
import ApartmentIcon from '@mui/icons-material/Apartment';
import LanguageIcon from '@mui/icons-material/Language';
import KeyIcon from '@mui/icons-material/Key';
import PostAddIcon from '@mui/icons-material/PostAdd';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import ListAltIcon from '@mui/icons-material/ListAlt';
import CompanyInfor from './CompanyInfor/CompanyInfor';
import CompanyPost from './CompanyPost/CompanyPost';


const Company = () => {
   const navigate = useNavigate();
   const location = useLocation();
   const [activeSection, setActiveSection] = useState('personal');
   const [isUpdating, setIsUpdating] = useState(false);
   const [showMessage, setShowMessage] = useState(false);
   const [messageType, setMessageType] = useState('');
   const [message, setMessage] = useState('');
   const [formData, setFormData] = useState({
      companyId: '',
      companyName: '',
      avt: '',
      industry: '',
      location: '',
      establishment: '',
      website: '',
      description: '',
      createDate: '',
      updateTime: '',
      email: ''
   });

   useEffect(() => {
      if (location.pathname === '/company/profile') {
         setActiveSection('company');
      } else if (location.pathname === '/company/create-post') {
         setActiveSection('create-post');
      } else {
         navigate('/company/profile');
         setActiveSection('company');
      }
   }, [location.pathname, navigate]);

   const handleSectionChange = (section) => {
      setActiveSection(section)

      if (section === 'company') {
         navigate('/company/profile');
      } else if (section === 'create-post') {
         navigate('/company-create-post');
      } else {
         navigate('/company/profile');
      }
   }

   return (
      <div>
         <Header />
         <div className="personal-container">
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
                  <p id='name'>{formData.companyName}</p>
                  <span id='location'>
                     <ApartmentIcon className='icon' /> <span>: {formData.location}</span>
                  </span>
                  <span id='website'>
                     <LanguageIcon className='icon' /> <span>: {formData.website}</span>
                  </span>
               </div>
            </div>

            <div className="container-content">
               <div className="container-item-left">
                  {isUpdating && (
                     <div className="overlay">
                        <div className="spinner"></div>
                     </div>
                  )}
                  {activeSection === 'company' && (
                     <CompanyInfor
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

                  {activeSection === 'create-post' && (
                     <CompanyPost
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
               </div>

               <div className="container-item-right">
                  <Link
                     to='profile'
                     onClick={() => handleSectionChange('company')}
                     className={activeSection === 'company' ? 'active-link' : ''}
                  >
                     <ApartmentIcon />
                     Thông tin công ty
                  </Link>
                  <Link

                  >
                     <KeyIcon />
                     Đổi mật khẩu
                  </Link>
                  <Link
                     to='create-post'
                     onClick={() => handleSectionChange('create-post')}
                     className={activeSection === 'create-post' ? 'active-link' : ''}
                  >
                     <PostAddIcon />
                     Đăng bài
                  </Link>
                  <Link

                  >
                     <ListAltIcon />
                     Xem tất cả bài tuyển dụng của bạn
                  </Link>
                  <Link

                  >
                     <BookmarkIcon />
                     Bài tìm việc đã lưu
                  </Link>
               </div>
            </div>
         </div>
      </div>
   )
}

export default Company