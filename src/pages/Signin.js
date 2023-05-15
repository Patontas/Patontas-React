import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { Store } from '../Store';
import CheckOutSteps from '../components/CheckOutSteps';

const Signin = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);

    const { state, dispatch: ctxDispatch } = useContext(Store);
    const { userInfo } = state;

    const handleSubmit = async (e) => {
        e.preventDefault();
        await axios
            .post(
                'https://patontas-api.onrender.com/api/users/login',
                {
                    email,
                    password,
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
        <div className="container mx-auto flex flex-col gap-4 xl:gap-12 px-4">
            <Helmet>
                <title>Sign In</title>
            </Helmet>
            <CheckOutSteps step1 />
            <div className="container mx-auto  md:w-1/2 xl:w-1/3">
                <div className="w-full6">
                    <h2 className="text-center text-3xl pb-4 ">Sign In</h2>
                </div>
                <form
                    onSubmit={handleSubmit}
                    className="w-full flex flex-col gap-2 mb-4">
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
                    <div>
                        <button
                            type="submit"
                            className="w-full rounded-lg border hover:bg-blue-500 bg-yellow py-3 px-4 
                            text-black font-medium font-serif text-xl mt-4">
                            Sign In
                        </button>
                    </div>
                    <p className="mt-2 text-lg font-bold">
                        Dont have an Account?{' '}
                        <Link
                            to={'/signup'}
                            className="underline text-blue-600">
                            Sign Up
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Signin;
