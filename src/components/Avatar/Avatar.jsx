import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import defaultAvt from '../../assets/default-avt/default.png';
import { getToken } from '../../service/token';
import EditIcon from '@mui/icons-material/Edit';
import './Avatar.css';

const AvatarComponent = ({
   setIsUpdating,
   setShowMessage,
   setMessageType,
   setMessage,
}) => {
   const [avatar, setAvatar] = useState(defaultAvt);
   const fileInputRef = useRef(null);
   const token = getToken();

   const handleAvatarChange = (event) => {
      const file = event.target.files[0];
      if (file) {
         const fileType = file.type;
         const validTypes = ['image/jpeg', 'image/png'];

         if (!validTypes.includes(fileType)) {
            alert('Only JPG and PNG images are allowed');
            return;
         }

         const formData = new FormData();
         formData.append('file', file);

         setIsUpdating(true);
         axios.post('http://localhost:8080/user/upload-avt', formData, {
            headers: {
               'Authorization': `Bearer ${token}`,
               'Content-Type': 'multipart/form-data'
            }
         })
            .then(response => {
               setIsUpdating(false);
               if (response.data.status === 'OK') {
                  setAvatar(`http://localhost:8080/avatars/${response.data.data.avtUrl}`);
                  setMessage(response.data.message);
                  setMessageType('success');
                  setShowMessage(true);
               }
            })
            .catch(error => {
               setIsUpdating(false);
               setMessage(error.response.data.message);
               setMessageType('error');
               setShowMessage(true);
            });
            setTimeout(() => {
               setShowMessage(false);
            }, 3000);
      }
   };

   useEffect(() => {
      axios.get('http://localhost:8080/user/get-avt', {
         headers: {
            'Authorization': `Bearer ${token}`
         }
      })
         .then(response => {
            if (response.data.status === 'OK' && response.data.data) {
               setAvatar(`http://localhost:8080/avatars/${response.data.data}`);
            }
         })
         .catch(error => {
            console.error('Error fetching avatar:', error);
         });
   }, []);

   const handleEditClick = () => {
      fileInputRef.current.click();
   };

   return (
      <div className="container-item--avt" style={{ position: 'relative', display: 'inline-block' }}>
         <img src={avatar} alt="User Avatar" style={{ width: '100%', height: 'auto' }} />

         <div
            className="edit-icon"
            onClick={handleEditClick}
         >
            <EditIcon />
         </div>

         <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            accept=".jpg,.jpeg,.png"
            onChange={handleAvatarChange}
         />
      </div>
   );
};

export default AvatarComponent;
