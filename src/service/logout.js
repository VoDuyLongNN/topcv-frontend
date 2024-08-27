import axios from 'axios';
import Cookies from 'js-cookie';

export const logout = async (navigate) => {
   try {
      const token = Cookies.get('token');

      if (!token) {
         console.error('No token found in cookies');
         return;
      }

      const response = await axios.post('http://localhost:8080/api/v1/auth/logout', { token }, {
         headers: {
            'Content-Type': 'application/json',
         },
      });

      if (response.status === 200) {
         Cookies.remove('token');
         Cookies.remove('refreshToken');
         Cookies.remove('role');
         localStorage.clear();

         navigate('/');
         window.location.reload();
      } else {
         console.error('Logout failed:', response.data);
      }
   } catch (error) {
      console.error('An error occurred during logout:', error);
   }
};
