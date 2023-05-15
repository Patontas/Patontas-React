import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Store } from '../Store';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { getError } from '../utils';

const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true };

        case 'FETCH_SUCCESS':
            return { ...state, order: action.payload, loading: false };

        case 'FETCH_FAIL':
            return { ...state, error: action.payload, loading: false };

        case 'PAY_REQUEST':
            return { ...state, loadingPay: true };

        case 'PAY_SUCCESS':
            return { ...state, loadingPay: false, successPay: true };

        case 'PAY_FAIL':
            return { ...state, loadingPay: false };

        case 'PAY_RESET':
            return { ...state, loadingPay: false, successPay: false };

        default:
            return state;
    }
};

const OrderDetails = () => {
    const navigate = useNavigate();
    const params = useParams();
    const [{ loading, order, error, successPay, loadingPay }, dispatch] =
        useReducer(reducer, {
            loading: true,
            error: '',
            order: {},
            loadingPay: false,
            successPay: false,
        });

    const { id } = params;
    const { state } = useContext(Store);
    const { userInfo } = state;

    const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

    const createOrder = (data, actions) => {
        return actions.order
            .create({
                purchase_units: [{ amount: { value: order.totalPrice } }],
            })
            .then((orderId) => {
                return orderId;
            });
    };

    const onApprove = (data, actions) => {
        return actions.order.capture().then(async (details) => {
            try {
                dispatch({ type: 'PAY_REQUEST' });
                const { data } = await axios.put(
                    `https://patontas-api.onrender.com/api/orders/pay/${order._id}`,
                    details,
                    {
                        headers: {
                            authorization: `Bearer ${userInfo.token}`,
                        },
                    }
                );
                dispatch({ type: 'PAY_SUCCESS', payload: data });
                alert('Order Paid');
            } catch (error) {
                dispatch({ type: 'PAY_FAIL', payload: getError(error) });
                alert(getError(error));
            }
        });
    };

    const onError = (err) => alert(getError(error));

    useEffect(() => {
        const fetchOrder = async () => {
            dispatch({ type: 'FETCH_REQUEST' });
            try {
                const res = await axios.get(
                    `https://patontas-api.onrender.com/api/orders/fetch-order/${id}`,
                    {
                        headers: {
                            authorization: `Bearer ${userInfo.token}`,
                        },
                    }
                );
                dispatch({ type: 'FETCH_SUCCESS', payload: res.data.order });
            } catch (err) {
                dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
                navigate('/');
            }
        };
        fetchOrder();
        if (!order.isPaid) {
            const loadPayPalScript = async () => {
                const { data: clientId } = await axios.get(
                    `https://patontas-api.onrender.com/api/keys/paypal`,
                    {
                        headers: {
                            authorization: `Bearer ${userInfo.token}`,
                        },
                    }
                );
                paypalDispatch({
                    type: 'resetOptions',
                    value: {
                        'client-id': clientId,
                        currency: 'USD',
                    },
                });
            };
            paypalDispatch({
                type: 'setLoadingStatus',
                value: 'pending',
            });
            loadPayPalScript();
        }

        if (successPay) {
            paypalDispatch({ type: 'PAY_RESET' });
        }
    }, [userInfo, id, navigate, order.isPaid, paypalDispatch, successPay]);

    return loading ? (
        <LoadingBox />
    ) : error ? (
        <MessageBox>{error}</MessageBox>
    ) : (
        <div className="container mx-auto px-4">
            <Helmet>
                <title>Order Preview</title>
            </Helmet>
            <h2 className="text-center text-xl xl:text-3xl mx-5 py-4 truncate">
                Order: #<span>{order ? order._id : ''}</span>
            </h2>
            <div className="flex flex-col md:flex-row gap-8">
                <section className="w-full lg:w-[70%] flex flex-col gap-4 ">
                    <div className="flex flex-col gap-2 p-6 border border-yellow rounded-lg">
                        <h1 className="text-2xl font-medium ">Shipping</h1>
                        <div>
                            <p className="text-lg">
                                <strong>Name:</strong>{' '}
                                {order.shippingAddress.name}
                            </p>
                            <p>
                                <strong>Address:</strong>{' '}
                                {order.shippingAddress.address}
                            </p>
                        </div>
                        {order.isDelivered ? (
                            <div
                                className="border border-green-300 rounded-lg shadow-sm shadow-green-300 bg-green-200 p-4 font-bold 
                        text-green-800 mt-2">
                                Order Delivered
                            </div>
                        ) : (
                            <div
                                className="border border-red-300 rounded-lg shadow-sm shadow-red-300 bg-red-200 p-4 font-bold 
                        text-red-800 mt-2">
                                Not Delivered
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col gap-2 p-6 border border-yellow rounded-lg">
                        <h1 className="text-2xl font-medium ">Payment</h1>
                        <div>
                            <p className="text-lg">
                                <strong>Method:</strong> {order.paymentMethod}
                            </p>
                        </div>
                        {order.isPaid ? (
                            <div
                                className="border border-green-300 rounded-lg shadow-sm shadow-green-300 bg-green-200 p-4 font-bold 
                        text-green-800 mt-2">
                                Order Paid
                            </div>
                        ) : (
                            <div
                                className="border border-red-300 rounded-lg shadow-sm shadow-red-300 bg-red-200 p-4 font-bold 
                        text-red-800 mt-2">
                                Not Paid
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col gap-2 p-6 border border-yellow rounded-lg">
                        <h1 className="text-2xl font-medium ">Items</h1>
                        <div className="w-full">
                            <ul className=" flex flex-col w-full rounded-lg ">
                                {order.orderItems.map((item) => (
                                    <div
                                        key={item.slug}
                                        className="border-b last-of-type:border-none h-full">
                                        <li className="flex flex-col md:flex-row  items-center gap-4 p-4">
                                            <div className="flex-grow">
                                                <Link
                                                    to={`/product/slug/${item.slug}`}>
                                                    <img
                                                        src={item.images}
                                                        alt={item.name}
                                                        className=" max-w-full min-w-[96px] h-24 "
                                                    />
                                                </Link>
                                            </div>
                                            <div className="text-xl text-center font-bold flex-grow-3 w-full">
                                                <Link
                                                    to={`/product/slug/${item.slug}`}>
                                                    {item.name}
                                                </Link>
                                            </div>
                                            <div className="flex flex-col items-center gap-2 lg:flex-row w-full px-4">
                                                <div className="flex justify-center gap-2 text-2xl flex-grow w-[135px]">
                                                    <span>{item.quantity}</span>{' '}
                                                </div>
                                                <div className="flex-grow w-full text-center">
                                                    <p className="text-xl font-bold">
                                                        ${item.price}
                                                    </p>
                                                </div>
                                            </div>
                                        </li>
                                    </div>
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>
                <section className="w-full lg:w-[30%] flex flex-col gap-4 ">
                    <div className="flex flex-col gap-2 p-6 border border-yellow rounded-lg">
                        <h1 className="text-2xl font-medium mb-2">
                            Order Summary
                        </h1>
                        <div className="flex justify-start px-4 text-2xl">
                            <div className="w-2/3">
                                <p>Items</p>
                            </div>
                            <p>${order.itemsPrice}</p>
                        </div>
                        <hr className="border border-yellow" />
                        <div className="flex justify-start px-4 text-2xl">
                            <div className="w-2/3">
                                <p>Shipping</p>
                            </div>
                            <p>${order.shippingPrice}</p>
                        </div>
                        <hr className="border border-yellow" />
                        <div className="flex justify-start px-4 text-2xl font-bold">
                            <div className="w-2/3">
                                <p>Order Total</p>
                            </div>
                            <p>${order.totalPrice}</p>
                        </div>
                        {!order.isPaid && (
                            <div>
                                {!isPending && (
                                    <div className="mb-4">
                                        <hr className="border border-yellow" />
                                        {order.paymentMethod === 'PayPal' ? (
                                            <PayPalButtons
                                                createOrder={createOrder}
                                                onApprove={onApprove}
                                                onError={onError}
                                            />
                                        ) : (
                                            <button
                                                type="button"
                                                className="rounded-lg border hover:bg-blue-600 bg-yellow p-2 w-full text-white font-bold text-lg">
                                                Stripe Payment
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                        {loadingPay && <LoadingBox></LoadingBox>}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default OrderDetails;
