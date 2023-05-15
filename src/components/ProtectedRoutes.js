import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store } from '../Store';

const ProtectedRoutes = ({ children }) => {
    const navigate = useNavigate();

    const { state } = useContext(Store);
    const { userInfo } = state;

    return userInfo.user.isAdmin ? children : navigate('/signin');
};

export default ProtectedRoutes;
