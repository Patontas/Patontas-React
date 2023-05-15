import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Store } from '../Store';

const UserProfile = () => {
    const navigate = useNavigate();

    const { state, dispatch: ctxDispatch } = useContext(Store);
    const { userInfo } = state;

    const [name, setName] = useState(userInfo.user.name || '');
    const [email, setEmail] = useState(userInfo.user.email || '');
    const [password, setPassword] = useState('');
    const [confirmPass, setConfirmPass] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        await axios
            .put(
                'api/users/update',
                {
                    name,
                    email,
                    password,
                    confirmPass,
                },
                {
                    headers: {
                        authorization: `Bearer ${userInfo.token}`,
                    },
                }
            )
            .then((res) => {
                console.log(res);
                alert('User Updated Successfully');
                ctxDispatch({
                    type: 'USER_UPDATE',
                    payload: res.data,
                });
                localStorage.setItem('userInfo', JSON.stringify(res.data));
                if (res.status === 201) {
                    navigate(0);
                    navigate('/profile');
                }
            })
            .catch((err) => {
                alert(err.response.data.msg);
            });
    };

    useEffect(() => {
        if (!userInfo) {
            navigate('/signin');
        }
    }, [userInfo, navigate]);

    return (
        <div className="container mx-auto md:w-1/2 xl:w-1/3 p-4">
            <Helmet>
                <title>User Profile</title>
            </Helmet>
            <h2 className="text-center text-3xl pb-4 ">User Profile</h2>
            <form
                onSubmit={handleSubmit}
                className="w-full flex flex-col gap-2 mb-4">
                <div className="flex flex-col text-lg xl:text-xl gap-1">
                    <label htmlFor="name">Full Name</label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="border rounded-lg bg-gray-50 px-3 py-1"
                    />
                </div>
                <div className="flex flex-col  text-lg xl:text-xl gap-1">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border rounded-lg bg-gray-50 px-3 py-1"
                    />
                </div>
                <div className="flex flex-col  text-lg xl:text-xl gap-1">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        onChange={(e) => setPassword(e.target.value)}
                        className="border rounded-lg bg-gray-50 px-3 py-1"
                    />
                </div>
                <div className="flex flex-col text-lg xl:text-xl gap-1">
                    <label htmlFor="confirmPass">Confirm Password</label>
                    <input
                        type="password"
                        name="confirmPass"
                        id="confirmPass"
                        onChange={(e) => setConfirmPass(e.target.value)}
                        className="border rounded-lg bg-gray-50 px-3 py-1"
                    />
                </div>
                <button
                    type="submit"
                    className="rounded-lg border hover:bg-blue-500 bg-yellow py-3 px-8 
                         text-black font-medium font-serif text-2xl mt-4">
                    Update
                </button>
            </form>
        </div>
    );
};

export default UserProfile;
