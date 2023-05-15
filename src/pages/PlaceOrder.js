import axios from 'axios';
import React, { useContext, useReducer } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { Store } from '../Store';
import CheckOutSteps from '../components/CheckOutSteps';
import ProductsCartTable from '../components/ProductsCartTable';
import { getError } from '../utils';

const reducer = (state, action) => {
    switch (action.type) {
        case 'CREATE_REQUEST':
            return { ...state, loading: true };

        case 'CREATE_SUCCESS':
            return { ...state, loading: false };

        case 'CREATE_FAIL':
            return { ...state, loading: false };

        default:
            return state;
    }
};

const PlaceOrder = () => {
    const navigate = useNavigate();
    // eslint-disable-next-line no-unused-vars
    const [{ loading, error }, dispatch] = useReducer(reducer, {
        loading: false,
        error: '',
    });
    const { state, dispatch: ctxDispatch } = useContext(Store);

    const { userInfo, cart } = state;

    const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100;
    cart.itemsPrice = round2(
        cart.cartItems.reduce((a, c) => a + c.quantity * c.price, 0)
    );

    cart.shippingPrice = cart.itemsPrice > 100000 ? round2(0) : round2(10000);
    cart.totalPrice = cart.itemsPrice + cart.shippingPrice;

    const placeOrderHandler = async () => {
        try {
            dispatch({ type: 'CREATE_REQUEST' });
            const result = await axios.post(
                'https://patontas-api.onrender.com/api/orders/create',
                {
                    orderItems: cart.cartItems,
                    shippingAddress: cart.shippingAddress,
                    paymentMethod: cart.paymentMethod,
                    itemsPrice: cart.itemsPrice,
                    shippingPrice: cart.shippingPrice,
                    totalPrice: cart.totalPrice,
                },
                {
                    headers: {
                        authorization: `Bearer ${userInfo.token}`,
                    },
                }
            );
            const order = result.data.order;
            ctxDispatch({ type: 'CART_CLEAR' });
            dispatch({ type: 'CREATE_SUCCESS' });
            localStorage.removeItem('cartItems');
            navigate(`/order/${order._id}`);
        } catch (error) {
            dispatch({ type: 'CREATE_FAIL' });
            alert(getError(error));
        }
    };

    return (
        <div className="container mx-auto p-4">
            <Helmet>
                <title>Order Preview</title>
            </Helmet>
            <CheckOutSteps step1 step2 step3 />
            <h2 className="text-center text-3xl py-4 ">Order Preview</h2>
            <div className="flex flex-col md:flex-row gap-4">
                <section className="w-full lg:w-[70%] flex flex-col gap-4">
                    <div className="flex flex-col gap-3 p-6  border border-yellow rounded-lg shadow">
                        <h1 className="text-2xl font-medium ">Shipping</h1>
                        <div>
                            <p className="text-lg">
                                <strong>Name:</strong> {userInfo.user.name}
                            </p>
                            <p>
                                <strong>Address:</strong>{' '}
                                {cart.shippingAddress.address}
                            </p>
                        </div>
                        <Link
                            to={'/shippingAddress'}
                            className="underline text-blue-600 text-lg mt-2 ">
                            Edit
                        </Link>
                    </div>
                    <div className="flex flex-col gap-3 p-6 border border-yellow rounded-lg shadow">
                        <h1 className="text-2xl font-medium ">Payment</h1>
                        <div>
                            <p className="text-lg">
                                <strong>Method:</strong> {cart.paymentMethod}
                            </p>
                        </div>
                        <Link
                            to={'/shippingAddress'}
                            className="underline text-blue-600 text-lg mt-2 ">
                            Edit
                        </Link>
                    </div>
                    <div className="flex flex-col gap-3 p-6 border border-yellow rounded-lg shadow">
                        <h1 className="text-2xl font-medium ">Items</h1>
                        <div className="w-full">
                            {cart.cartItems.length === 0 ? (
                                <div className="w-full rounded-lg h-fit bg-cyan-100 p-6">
                                    <p className="text-2xl text-cente line text-blue-900">
                                        Cart Is Empty.{'  '}
                                        <Link
                                            to="/"
                                            className="underline text-blue-700">
                                            Go Shopping
                                        </Link>
                                    </p>
                                </div>
                            ) : (
                                <div>
                                    <ProductsCartTable />
                                </div>
                            )}
                        </div>
                        <Link
                            to={'/cart'}
                            className="underline text-blue-600 text-lg mt-2 ">
                            Edit
                        </Link>
                    </div>
                </section>
                <section className="w-full lg:w-[30%] lg:mx-4 lg:px-6">
                    <div className="flex flex-col gap-2 p-6 border border-yellow rounded-lg">
                        <h1 className="text-2xl font-medium mb-2">
                            Order Summary
                        </h1>
                        <div className="flex justify-start px-4 text-2xl">
                            <div className="w-2/3">
                                <p>Items</p>
                            </div>
                            <p>${cart.itemsPrice}</p>
                        </div>
                        <hr className="border border-yellow" />
                        <div className="flex justify-start px-4 text-2xl">
                            <div className="w-2/3">
                                <p>Shipping</p>
                            </div>
                            <p>${cart.shippingPrice}</p>
                        </div>
                        <hr className="border border-yellow" />
                        <div className="flex justify-start px-4 text-2xl font-bold">
                            <div className="w-2/3">
                                <p>Order Total</p>
                            </div>
                            <p>${cart.totalPrice}</p>
                        </div>
                        <hr className="border border-yellow" />
                        <button
                            onClick={placeOrderHandler}
                            type="button"
                            className="rounded-lg border hover:bg-blue-600 bg-yellow p-2 w-full text-white font-bold text-lg">
                            Place Order
                        </button>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default PlaceOrder;
