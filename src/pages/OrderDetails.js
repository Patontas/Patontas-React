import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react';
import { Helmet } from 'react-helmet-async';
import { AiOutlineWhatsApp } from 'react-icons/ai';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Store } from '../Store';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import nequiLogo from '../nequi-2.svg';
import { getError } from '../utils';

const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true };

        case 'FETCH_SUCCESS':
            return { ...state, order: action.payload, loading: false };

        case 'FETCH_FAIL':
            return { ...state, error: action.payload, loading: false };

        default:
            return state;
    }
};

const OrderDetails = () => {
    const navigate = useNavigate();
    const params = useParams();
    const [{ loading, order, error }, dispatch] = useReducer(reducer, {
        loading: true,
        error: '',
        order: {},
    });

    const { id } = params;
    const { state } = useContext(Store);
    const { userInfo } = state;

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
        }
    }, [userInfo, id, navigate, order.isPaid]);

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
                                <strong>Method:</strong>{' '}
                                {order.paymentMethod.toUpperCase()}
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
                                <hr className="border border-yellow" />
                                {order.paymentMethod === 'nequi' ? (
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-2 mt-2">
                                            <img
                                                src={nequiLogo}
                                                alt="nequi"
                                                className="w-32 h-16 p-0 m-0"
                                            />
                                            <p>
                                                <strong>Cuenta: </strong>
                                                3023879940
                                            </p>
                                        </div>
                                        <div>
                                            <Link
                                                to={
                                                    'https://api.whatsapp.com/message/6SDPDVJHVXX7F1?autoload=1&app_absent=0'
                                                }
                                                target="_blank"
                                                className="flex items-center gap-2 mt-2">
                                                <AiOutlineWhatsApp
                                                    size={36}
                                                    color="#25D366"
                                                />
                                                <p>(+57) 3023879940</p>
                                            </Link>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="mt-4">
                                        <Link
                                            to={
                                                'https://api.whatsapp.com/message/6SDPDVJHVXX7F1?autoload=1&app_absent=0'
                                            }
                                            target="_blank"
                                            className="flex items-center gap-2 mt-2">
                                            <AiOutlineWhatsApp
                                                size={36}
                                                color="#25D366"
                                            />
                                            <p>(+57) 3023879940</p>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="p-6 border border-yellow rounded-lg">
                        {order.paymentMethod === 'nequi' ? (
                            <p>
                                <strong>Nota:</strong> Despues de realizar el
                                pago por favor enviar confirmacion y comprobante
                                por medio del whatsapp junto con el numero de
                                orden.
                            </p>
                        ) : (
                            <p>
                                <strong>Nota:</strong> Despues de realizar la
                                orden por favor enviar por medio del whatsapp la
                                confirmacíon junto con el numero de orden.
                            </p>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default OrderDetails;
