import axios from 'axios';
import React, { useContext } from 'react';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { Store } from '../Store';

const ProductCard = (data) => {
    const product = data.product;

    const { state, dispatch: ctxDispatch } = useContext(Store);
    const { cart } = state;
    const addToCartHandler = async () => {
        const existItem = cart.cartItems.find((x) => x._id === product._id);
        const quantity = existItem ? existItem.quantity + 1 : 1;
        const { data } = await axios.get(
            `https://patontas-api.onrender.com/api/products/${product._id}`
        );
        if (data.countInStock < quantity) {
            window.alert('Product out of stock');
            return;
        }
        ctxDispatch({
            type: 'CART_ADD_ITEM',
            payload: { ...product, quantity },
        });
    };

    return (
        <div className="flex flex-col w-fit border border-pink rounded-lg shadow-md hover:shadow-xl hover:scale-105 duration-300  text-sm bg-pink overflow-hidden">
            <div className="object-center flex items-center justify-center">
                <Link
                    className="object-cover"
                    to={`/product/slug/${product.slug}`}>
                    <img
                        className="w-full xs:max-w-[150px] md:max-w-[200px] lg:max-w-[250px] xl:max-w-[300px] rounded-lg"
                        src={product.images}
                        alt={product.name}
                    />
                </Link>
            </div>
            <div className="py-4 px-2 lg:px-4 text-center font-bold">
                <Link to={`/product/slug/${product.slug}`}>
                    <p className="text-lg xl:text-xl">{product.name}</p>
                </Link>
                <p className="mt-1 text-lg">
                    <strong>${product.price}</strong>
                </p>
                {product.countInStock === 0 ? (
                    <button
                        onClick={addToCartHandler}
                        type="button"
                        disabled
                        className="rounded-lg bg-[#faa784] mt-1 p-1 w-fullfont-bold text-sm">
                        Out of Stock
                    </button>
                ) : (
                    <button
                        onClick={addToCartHandler}
                        type="button"
                        className="rounded-lg hover:bg-[#faa784] p-1">
                        <AiOutlineShoppingCart size={28} color="black" />
                    </button>
                )}
            </div>
        </div>
    );
};

export default ProductCard;
