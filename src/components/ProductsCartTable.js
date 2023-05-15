import axios from 'axios';
import React, { useContext } from 'react';
import { FaMinusCircle, FaPlusCircle, FaTrash } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { Store } from '../Store';

const ProductsCartTable = () => {
    const { state, dispatch: ctxDispatch } = useContext(Store);

    const {
        cart: { cartItems },
    } = state;

    const updateCartHandler = async (item, quantity) => {
        const { data } = await axios.get(
            `https://patontas-api.onrender.com/api/products/${item._id}`
        );
        if (data.countInStock < quantity) {
            window.alert('Product out of stock');
            return;
        }
        ctxDispatch({
            type: 'CART_ADD_ITEM',
            payload: { ...item, quantity },
        });
    };

    const removeItem = async (item) => {
        ctxDispatch({
            type: 'CART_REMOVE_ITEM',
            payload: item,
        });
        console.log(cartItems);
    };

    return (
        <ul className="w-full flex flex-col">
            {cartItems.map((item) => (
                <li
                    key={item.slug}
                    className="flex items-center justify-between gap-8 px-2 pb-4">
                    <div className="w-1/4">
                        <Link to={`/product/slug/${item.slug}`}>
                            <img
                                src={item.images}
                                alt={item.name}
                                className=" max-w-full min-w-[96px] h-24 "
                            />
                        </Link>
                    </div>
                    <div className="text-xl text-center font-bold overflow-hidden w-2/4">
                        <Link to={`/product/slug/${item.slug}`}>
                            {item.name}
                        </Link>
                    </div>
                    <div className="flex flex-col md:flex-row items-center gap-2 px-4 w-1/4">
                        <div className="flex justify-center gap-2 text-2xl flex-grow w-[135px]">
                            <button
                                onClick={() =>
                                    updateCartHandler(item, item.quantity - 1)
                                }
                                type="button"
                                disabled={item.quantity === 1}>
                                {item.quantity === 1 ? (
                                    <FaMinusCircle color="#AAAAAA" size={24} />
                                ) : (
                                    <FaMinusCircle size={24} />
                                )}
                            </button>{' '}
                            <span>{item.quantity}</span>{' '}
                            <button
                                onClick={() =>
                                    updateCartHandler(item, item.quantity + 1)
                                }
                                type="button"
                                disabled={item.quantity === item.countInStock}>
                                {item.quantity === item.countInStock ? (
                                    <FaPlusCircle color="#AAAAAA" size={24} />
                                ) : (
                                    <FaPlusCircle size={24} />
                                )}
                            </button>
                        </div>
                        <div className="w-full text-center">
                            <p className="text-xl font-bold">${item.price}</p>
                        </div>
                        <div className="">
                            <button
                                onClick={() => removeItem(item)}
                                type="button">
                                <FaTrash size={32} />
                            </button>
                        </div>
                    </div>
                </li>
            ))}
        </ul>
    );
};

export default ProductsCartTable;
