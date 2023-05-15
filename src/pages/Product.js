import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router-dom';
import { Store } from '../Store';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { getError } from '../utils';

const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true };

        case 'FETCH_SUCCESS':
            return { ...state, product: action.payload, loading: false };

        case 'FETCH_FAIL':
            return { ...state, error: action.payload, loading: false };

        default:
            return state;
    }
};

const Product = () => {
    const params = useParams();
    const { slug } = params;

    const [{ loading, product, error }, dispatch] = useReducer(reducer, {
        loading: true,
        error: '',
        product: [],
    });

    useEffect(() => {
        const fetchData = async (req, res) => {
            dispatch({ type: 'FETCH_REQUEST' });
            try {
                const result = await axios.get(`/api/products/slug/${slug}`);
                dispatch({ type: 'FETCH_SUCCESS', payload: result.data.data });
            } catch (err) {
                dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
            }
        };
        fetchData();
    }, [slug]);

    const { state, dispatch: ctxDispatch } = useContext(Store);
    const { cart } = state;
    const addToCartHandler = async () => {
        const existItem = cart.cartItems.find((x) => x._id === product._id);
        const quantity = existItem ? existItem.quantity + 1 : 1;
        const { data } = await axios.get(`/api/products/${product._id}`);
        if (data.countInStock < quantity) {
            window.alert('Product out of stock');
            return;
        }
        ctxDispatch({
            type: 'CART_ADD_ITEM',
            payload: { ...product, quantity },
        });
    };

    return loading ? (
        <LoadingBox />
    ) : error ? (
        <MessageBox>{error}</MessageBox>
    ) : (
        <div className="container mx-auto  flex flex-col md:flex-row gap-4 p-4 justify-evenly">
            <div className="w-full xl:w-[40%] shadow-lg">
                <Link to={product.images} target="_blank">
                    <img
                        src={product.images}
                        alt={product.name}
                        className="w-full bg-cover"
                    />
                </Link>
            </div>
            <div className="w-full lg:w-[50%] xl:w-[30%]  flex flex-col xl:flex-row xl:justify-center gap-4 shadow-lg rounded-lg border border-yellow h-fit">
                <ul className="flex flex-col gap-2 p-4 w-full">
                    <li>
                        <Helmet>
                            <title>{product.name}</title>
                        </Helmet>
                        <h1 className="text-lg font-bold">{product.name}</h1>
                    </li>
                    <hr className="border border-yellow" />
                    <li className="my-2">
                        <p>
                            <strong>${product.price}</strong>
                        </p>
                    </li>
                    <hr className="border border-yellow" />
                    <li className="my-2">
                        <p>{product.description}</p>
                    </li>
                    <hr className="border border-yellow" />
                    <li className="flex gap-8 p-2 lg:px-0">
                        <p>Status:</p>
                        {product.countInStock > 0 ? (
                            <p className="rounded-lg bg-green-500 px-4 text-white font-bold text-lg">
                                In Stock
                            </p>
                        ) : (
                            <p className="rounded-lg bg-red-500 px-4 text-white font-bold text-lg">
                                Unavailable
                            </p>
                        )}
                    </li>
                    {product.countInStock > 0 && (
                        <div>
                            <hr className="border border-yellow" />
                            <li>
                                <button
                                    onClick={addToCartHandler}
                                    type="button"
                                    className="w-full md:w-1/2 rounded-lg border hover:bg-blue-500 bg-yellow py-3 px-4 
                                        text-white font-bold font-serif text-lg mt-4">
                                    Add to Cart
                                </button>
                            </li>
                        </div>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default Product;
