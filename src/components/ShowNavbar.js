import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const ShowNavbar = ({ children }) => {
    const location = useLocation();
    const [showChildren, setshowChildren] = useState(true);

    useEffect(() => {
        if (location.pathname === '/dashboard') {
            setshowChildren(false);
        } else {
            setshowChildren(true);
        }
    }, [location]);

    return <div>{showChildren && children}</div>;
};

export default ShowNavbar;
