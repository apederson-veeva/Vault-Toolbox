import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function ProtectedRoutes() {
    const { isLoggedIn } = useAuth();

    return isLoggedIn ? <Outlet /> : <Navigate to='/login' />;
}

export default ProtectedRoutes;
