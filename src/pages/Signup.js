import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { Store } from '../Store';

const Signup = () => {
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPass, setConfirmPass] = useState('');

    const { state, dispatch: ctxDispatch } = useContext(Store);
    const { userInfo } = state;

    const handleSubmit = async (e) => {
        e.preventDefault();
        await axios
            .post(
                'api/users/register',
                {
                    name,
                    email,
                    password,
                    confirmPass,
                },
                { withCredentials: true }
            )
            .then((res) => {
                alert('User Login successfully');
                ctxDispatch({
                    type: 'USER_SIGNIN',
                    payload: res.data,
                });
                localStorage.setItem('userInfo', JSON.stringify(res.data));
                if (res.status === 201) {
                    navigate('/');
                }
            })
            .catch((err) => {
                alert(err.response.data.msg);
            });
    };

    useEffect(() => {
        if (userInfo) {
            navigate('/');
        }
    }, [navigate, userInfo]);

    return (
        <div className="container mx-auto md:w-1/2 xl:w-1/3 px-4">
            <Helmet>
                <title>Sign Up</title>
            </Helmet>
            <form
                onSubmit={handleSubmit}
                className="w-full flex flex-col gap-2 mb-4l">
                <h2 className="text-center text-3xl pb-4 ">Sign Up</h2>
                <div className="flex flex-col text-lg xl:text-xl gap-1">
                    <label htmlFor="name">Name</label>
                    <input
                        type="name"
                        name="name"
                        id="name"
                        onChange={(e) => setName(e.target.value)}
                        className="border rounded-lg bg-gray-50 px-3 py-1"
                    />
                </div>
                <div className="flex flex-col text-lg xl:text-xl gap-1">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        onChange={(e) => setEmail(e.target.value)}
                        className="border rounded-lg bg-gray-50 px-3 py-1"
                    />
                </div>
                <div className="flex flex-col text-lg xl:text-xl gap-1">
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
                <div>
                    <button
                        type="submit"
                        className="w-full rounded-lg border hover:bg-blue-500 bg-yellow py-3 px-4 
                        text-black font-medium font-serif text-xl mt-4">
                        Sign Up
                    </button>
                </div>
                <p className="mt-2 text-lg font-bold">
                    Already have an Account?{' '}
                    <Link to={'/signin'} className="underline text-blue-600">
                        Sign In
                    </Link>
                </p>
            </form>
        </div>
    );
};

export default Signup;
