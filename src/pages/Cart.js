import React, { useContext } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { Store } from '../Store';
import ProductsCartTable from '../components/ProductsCartTable';

const Cart = () => {
    const navigate = useNavigate();
    const { state } = useContext(Store);
    const {
        userInfo,
        cart: { cartItems },
    } = state;

    const checkoutHandler = () => {
        if (userInfo) {
            navigate('/shippingAddress');
        } else {
            navigate('/signin');
        }
    };

    return (
        <div className="container mx-auto px-4">
            <Helmet>
                <title>Cart</title>
            </Helmet>
            <div className="w-full flex flex-col lg:flex-row gap-8">
                {cartItems.length === 0 ? (
                    <div className="w-full lg:w-[70%] rounded-lg bg-cyan-100 p-6">
                        <p className="text-2xl text-center underline text-blue-900">
                            Cart Is Empty.{'  '}
                            <Link
                                to="/products"
                                className="underline text-blue-700">
                                Go Shopping
                            </Link>
                        </p>
                    </div>
                ) : (
                    <div className="w-full lg:w-[70%]">
                        <ProductsCartTable />
                    </div>
                )}

                <div className="w-full lg:w-[30%] lg:mx-4 lg:px-6">
                    <div className="flex gap-4">
                        <h1 className="text-2xl font-bold">
                            SubTotal (
                            {cartItems.reduce((a, c) => a + c.quantity, 0)}{' '}
                            items) :
                        </h1>{' '}
                        <p className="text-2xl font-bold mb-8">
                            $
                            {cartItems.reduce(
                                (a, c) => a + c.quantity * c.price,
                                0
                            )}
                        </p>
                    </div>
                    {cartItems.length === 0 ? (
                        <button
                            onClick={checkoutHandler}
                            type="button"
                            disabled
                            className="rounded-lg borde bg-gray-300 p-2 w-full text-gray-500 font-bold text-lg">
                            Checkout
                        </button>
                    ) : (
                        <button
                            onClick={checkoutHandler}
                            type="button"
                            className="rounded-lg border hover:bg-blue-600 bg-yellow p-2 w-full text-white font-bold text-lg">
                            Checkout
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Cart;
