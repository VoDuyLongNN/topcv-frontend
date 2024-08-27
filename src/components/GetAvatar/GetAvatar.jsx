import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getToken } from '../../service/token';
import defaultAvt from '../../assets/default-avt/default.png';

const GetAvatar = () => {
   const [avatar, setAvatar] = useState(defaultAvt);
   const token = getToken();

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
   }, [token]);

   return <img src={avatar} alt="Profile" className="profile-pic" />;
};

export default GetAvatar;
