// src/components/routes/ProtectedRoute.tsx

import { Navigate, Outlet } from 'react-router-dom';


const ProtectedRoute: React.FC = () => {
 
  
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');

  // Block route if there's no user or token
  if ( !token) {
    console.log('Access denied. User is not authenticated.' + token);
    return <Navigate to="/" replace />;
  }

  // Render child routes if authenticated
  return <Outlet />;
};

export default ProtectedRoute;
