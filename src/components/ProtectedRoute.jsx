import React from 'react';
import { Navigate } from 'react-router-dom';
import { getRole } from '../service/getRole';

const ProtectedRoute = ({ children, allowedRole }) => {
   const role = getRole();

   if (role !== allowedRole) {
      return <Navigate to="/" />;
   }

   return children;
};

export default ProtectedRoute;
