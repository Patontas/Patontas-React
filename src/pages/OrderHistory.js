import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { Store } from '../Store';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { getError } from '../utils';

const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true };

        case 'FETCH_SUCCESS':
            return { ...state, orders: action.payload, loading: false };

        case 'FETCH_FAIL':
            return { ...state, error: action.payload, loading: false };

        default:
            return state;
    }
};

const OrderHistory = () => {
    const navigate = useNavigate();
    // eslint-disable-next-line no-unused-vars
    const [{ loading, orders, error }, dispatch] = useReducer(reducer, {
        loading: true,
        error: '',
        orders: [],
    });

    const { state } = useContext(Store);

    const { userInfo } = state;

    useEffect(() => {
        const fetchOrders = async () => {
            dispatch({ type: 'FETCH_REQUEST' });
            try {
                const res = await axios.get(
                    'https://patontas-api.onrender.com/api/orders/fetch-orders',
                    {
                        headers: {
                            authorization: `Bearer ${userInfo.token}`,
                        },
                    }
                );
                //console.log(res.data.orders);
                dispatch({ type: 'FETCH_SUCCESS', payload: res.data.orders });
            } catch (err) {
                dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
                navigate('/');
            }
        };
        fetchOrders();
    }, [userInfo, navigate]);

    return (
        <div className="container mx-auto p-4">
            <Helmet>
                <title>Order History</title>
            </Helmet>
            <h2 className="text-center text-3xl pb-4">Order History</h2>
            <div>
                {loading ? (
                    <LoadingBox />
                ) : error ? (
                    <MessageBox>{error}</MessageBox>
                ) : orders.length === 0 ? (
                    <MessageBox>
                        Dont Have Any Orders Yet.{' '}
                        <Link to={'/'} className="underline text-blue-600">
                            Go Shoping
                        </Link>
                    </MessageBox>
                ) : (
                    <div>
                        <table className="w-full hidden md:table text-sm text-left text-black">
                            <thead className="text-sm text-black uppercase bg-pink">
                                <tr>
                                    <th className="px-6 py-3" scope="col">
                                        ID
                                    </th>
                                    <th className="px-6 py-3" scope="col">
                                        DATE
                                    </th>
                                    <th className="px-6 py-3" scope="col">
                                        TOTAL
                                    </th>
                                    <th className="px-6 py-3" scope="col">
                                        PAID
                                    </th>
                                    <th className="px-6 py-3" scope="col">
                                        DELIVERED
                                    </th>
                                    <th className="px-6 py-3" scope="col">
                                        ACTIONS
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr
                                        key={order._id}
                                        className="border border-pink">
                                        <th
                                            className="px-6 py-3 truncate"
                                            scope="row">
                                            {order._id}
                                        </th>
                                        <td className="px-1 py-3">
                                            {order.createdAt.substring(0, 10)}
                                        </td>
                                        <td className="px-6 py-3">
                                            ${order.totalPrice}
                                        </td>
                                        {order.isPaid ? (
                                            <td className="px-2 py-3">
                                                <p
                                                    className="w-full border border-green-300 rounded-lg shadow-sm shadow-green-300
                                                 bg-green-200 p-1 font-bold text-green-800 text-center">
                                                    Order Paid
                                                </p>
                                            </td>
                                        ) : (
                                            <td className="px-2 py-3">
                                                <p
                                                    className="w-full border border-red-300 rounded-lg shadow-sm shadow-red-300
                                                 bg-red-200 p-1 font-bold text-red-800 text-center">
                                                    Waiting Payment
                                                </p>
                                            </td>
                                        )}
                                        {order.isDelivered ? (
                                            <td className="px-2 py-3">
                                                <p
                                                    className="w-full border border-green-300 rounded-lg shadow-sm shadow-green-300 
                                                bg-green-200 p-1 font-bold text-green-800 text-center">
                                                    Order Delivered
                                                </p>
                                            </td>
                                        ) : (
                                            <td className="px-2 py-3">
                                                <p
                                                    className="w-full border border-red-300 rounded-lg shadow-sm shadow-red-300 
                                                bg-red-200 p-1 font-bold text-red-800 text-center">
                                                    Not Delivered
                                                </p>
                                            </td>
                                        )}
                                        <td className="px-6 py-3">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    navigate(
                                                        `/order/${order._id}`
                                                    )
                                                }
                                                className="w-full rounded-lg border hover:bg-blue-500 bg-yellow p-2 
                                            text-black font-medium font-serif text-xl">
                                                Details
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="md:hidden border border-yellow rounded-lg">
                            <ul>
                                {orders.map((order) => (
                                    <li
                                        key={order._id}
                                        className="border-b border-pink flex items-center gap-3 p-1">
                                        <div className="w-full flex flex-col gap4">
                                            <p className="truncate">
                                                <strong>ID:</strong> {order._id}
                                            </p>
                                            <div className="w-full flex gap-4 items-center">
                                                <p>
                                                    <strong>Price:</strong> $
                                                    {order.totalPrice}
                                                </p>
                                                {order.isPaid ? (
                                                    <p
                                                        className="min-w-fit border border-green-300 rounded-lg shadow-sm shadow-green-300
                                                 bg-green-200 p-1 font-bold text-green-800 mt-2">
                                                        Order Paid
                                                    </p>
                                                ) : (
                                                    <p
                                                        className="border min-w-fit border-red-300 rounded-lg shadow-sm shadow-red-300
                                                 bg-red-200 p-1 font-bold text-red-800 mt-2">
                                                        Waiting Payment
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="w-1/4">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    navigate(
                                                        `/order/${order._id}`
                                                    )
                                                }
                                                className="w-full rounded-lg border hover:bg-blue-500 bg-yellow py-3 px-4 
                                            text-black font-medium font-serif ">
                                                Details
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderHistory;
