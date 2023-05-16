import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Store } from '../Store';
import CheckOutSteps from '../components/CheckOutSteps';

const ShippingAddress = () => {
    const navigate = useNavigate();
    const { state, dispatch: ctxDispatch } = useContext(Store);
    const {
        userInfo,
        cart: { shippingAddress, paymentMethod },
    } = state;

    const [name, setName] = useState(shippingAddress.name || '');
    const [address, setAddress] = useState(shippingAddress.address || '');
    const [city, setCity] = useState(shippingAddress.city || '');
    const [postalCode, setPostalCode] = useState(
        shippingAddress.postalCode || ''
    );
    const [country, setCountry] = useState(shippingAddress.country || '');

    const [paymentMethodName, setPaymentMethodName] = useState(
        paymentMethod || 'nequi'
    );

    const handleSubmit = (e) => {
        e.preventDefault();
        ctxDispatch({
            type: 'SAVE_SHIPPING_ADDRESS',
            payload: { name, address, city, postalCode, country },
        });
        ctxDispatch({
            type: 'SAVE_PAYMENT_METHOD',
            payload: paymentMethodName,
        });
        const direccion = { name, address, city, postalCode, country };
        localStorage.setItem('shippingAddress', JSON.stringify(direccion));
        localStorage.setItem('paymentMethod', paymentMethodName);
        navigate('/place-order');
    };

    useEffect(() => {
        if (!userInfo) {
            navigate('/signin');
        }
    }, [userInfo, navigate]);

    return (
        <div className="container mx-auto flex flex-col gap-4 xl:gap-8 p-4">
            <Helmet>
                <title>Shipping Address</title>
            </Helmet>
            <CheckOutSteps step1 step2 />
            <div className="container mx-auto md:w-1/2 xl:w-1/3">
                <h2 className="text-center text-3xl ">Shipping Address</h2>
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
                    <div className="flex flex-col text-lg xl:text-xl gap-1">
                        <label htmlFor="address">Address</label>
                        <input
                            type="text"
                            name="address"
                            id="address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="border rounded-lg bg-gray-50 px-3 py-1"
                        />
                    </div>
                    <div className="flex flex-col text-lg xl:text-xl gap-1">
                        <label htmlFor="city">City</label>
                        <input
                            type="text"
                            name="city"
                            id="city"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className="border rounded-lg bg-gray-50 px-3 py-1"
                        />
                    </div>
                    <div className="flex flex-col text-lg xl:text-xl gap-1">
                        <label htmlFor="postalCode">Postal Code</label>
                        <input
                            type="text"
                            name="postalCode"
                            id="postalCode"
                            value={postalCode}
                            onChange={(e) => setPostalCode(e.target.value)}
                            className="border rounded-lg bg-gray-50 px-3 py-1"
                        />
                    </div>
                    <div className="flex flex-col text-lg xl:text-xl gap-1">
                        <label htmlFor="country">Country</label>
                        <input
                            type="text"
                            name="country"
                            id="country"
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            className="border rounded-lg bg-gray-50 px-3 py-1"
                        />
                    </div>
                    <h2 className="text-center text-3xl py-4 ">
                        Payment Methods
                    </h2>
                    <div className="flex text-2xl gap-2">
                        <input
                            type="checkbox"
                            name="nequi"
                            id="nequi"
                            value="nequi"
                            checked={paymentMethodName === 'nequi'}
                            onChange={(e) =>
                                setPaymentMethodName(e.target.value)
                            }
                            className="border rounded-lg bg-gray-50 p-3"
                        />
                        <label htmlFor="nequi" className="my-2">
                            NEQUI
                        </label>
                    </div>
                    {city.toLowerCase() === 'valledupar' && (
                        <div className="flex text-2xl gap-2">
                            <input
                                type="checkbox"
                                name="efectivo"
                                id="efectivo"
                                value="efectivo"
                                checked={paymentMethodName === 'efectivo'}
                                onChange={(e) =>
                                    setPaymentMethodName(e.target.value)
                                }
                                className="border rounded-lg bg-gray-50 p-3"
                            />
                            <label htmlFor="efectivo" className="my-2">
                                Contra Entrega (Solo Valledupar)
                            </label>
                        </div>
                    )}
                    <button
                        type="submit"
                        className="rounded-lg border hover:bg-blue-500 bg-yellow py-3 px-8 
                        text-black font-medium font-serif text-2xl mt-4">
                        Countinue
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ShippingAddress;
