import Cookies from 'js-cookie';

export const getRole = () => {
   return Cookies.get('role');
};