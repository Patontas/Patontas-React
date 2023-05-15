import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Store } from '../Store';
import OrdersTable from '../components/OrdersTable';
import ProductForm from '../components/ProductForm';
import ProductsTable from '../components/ProductsTable';
import SideBar from '../components/SideBar';
import UserTable from '../components/UserTable';

const DashBoard = () => {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [content, setContent] = useState('home');
    const { state } = useContext(Store);
    const { userInfo } = state;

    const openChange = (op) => {
        setOpen(op);
    };

    const contentChange = (ct) => {
        setContent(ct);
    };

    useEffect(() => {
        if (!userInfo.user.isAdmin) {
            navigate('/');
        }
    }, [userInfo, navigate]);

    return (
        <div className="flex gap-0">
            <Helmet>
                <title>Admin DashBoard</title>
            </Helmet>
            <SideBar
                open={open}
                openChange={openChange}
                contentChange={contentChange}
            />
            <main className={`${open ? 'ml-72' : 'ml-28'} mr-8 w-full`}>
                {
                    {
                        home: (
                            <div>
                                <OrdersTable />
                            </div>
                        ),
                        users: (
                            <div>
                                <UserTable />
                            </div>
                        ),
                        productsList: (
                            <div>
                                <ProductsTable
                                    content={content}
                                    contentChange={contentChange}
                                />
                            </div>
                        ),
                        addProduct: (
                            <div>
                                <ProductForm
                                    product={{}}
                                    content={content}
                                    contentChange={contentChange}
                                />
                            </div>
                        ),
                    }[content]
                }
            </main>
        </div>
    );
};

export default DashBoard;
