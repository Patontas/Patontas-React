import React from 'react';

const CheckOutSteps = (props) => {
    return (
        <div className="container mx-auto flex justify-between w-full">
            <div
                className={
                    props.step1
                        ? ' border-b-4 border-yellow w-full text-yellow font-bold mr-1'
                        : 'border-b-4 border-gray-500 text-gray-500 font-bold w-full'
                }>
                <p className="px-4 text-xl">Sign In</p>
            </div>
            <div
                className={
                    props.step2
                        ? ' border-b-4 border-yellow w-full text-yellow font-bold mr-1'
                        : 'border-b-4 border-gray-500 text-gray-500 font-bold w-full'
                }>
                <p className="px-4 text-xl">Shipping and Payment</p>
            </div>
            <div
                className={
                    props.step3
                        ? ' border-b-4 border-yellow w-full text-yellow font-bold mr-1'
                        : 'border-b-4 border-gray-500 text-gray-500 font-bold w-full'
                }>
                <p className="px-4 text-xl">Place Order</p>
            </div>
        </div>
    );
};

export default CheckOutSteps;
