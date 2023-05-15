import axios from 'axios';
import { useEffect, useReducer } from 'react';
import { getError } from '../utils';
import LoadingBox from './LoadingBox';
import MessageBox from './MessageBox';
import ProductCard from './ProductCard';

const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true };

        case 'FETCH_SUCCESS':
            return { ...state, products: action.payload, loading: false };

        case 'FETCH_FAIL':
            return { ...state, error: action.payload, loading: false };

        default:
            return state;
    }
};

const FeatureProducts = () => {
    const [{ loading, products, error }, dispatch] = useReducer(reducer, {
        loading: true,
        error: '',
        products: [],
    });

    let productSlice = 0;
    const slice = products.length * Math.random();
    if (slice > products.length - 3) {
        productSlice = slice - 2;
    } else {
        productSlice = slice;
    }

    useEffect(() => {
        const fetchData = async (req, res) => {
            dispatch({ type: 'FETCH_REQUEST' });
            try {
                const result = await axios.get(
                    'https://patontas-api.onrender.com/api/products'
                );
                dispatch({ type: 'FETCH_SUCCESS', payload: result.data.data });
            } catch (err) {
                dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
            }
        };
        fetchData();
    }, []);

    return (
        <section className="container mx-auto">
            <h2 className="text-4xl py-10 text-center font-medium text-gray-700">
                Feature Products
            </h2>
            <div>
                {loading ? (
                    <LoadingBox />
                ) : error ? (
                    <MessageBox>{error}</MessageBox>
                ) : (
                    <div className="flex flex-wrap justify-evenly gap-10">
                        {products &&
                            products
                                .slice(productSlice, productSlice + 3)
                                .map((product) => {
                                    return (
                                        <ProductCard
                                            key={product.slug}
                                            size={32}
                                            product={product}
                                        />
                                    );
                                })}
                    </div>
                )}
            </div>
        </section>
    );
};

export default FeatureProducts;
