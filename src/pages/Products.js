import { ChevronDownIcon } from '@heroicons/react/20/solid';
import axios from 'axios';
import React, { useEffect, useReducer, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { GiHamburgerMenu } from 'react-icons/gi';
import { Link } from 'react-router-dom';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import ProductCard from '../components/ProductCard';
import { getError } from '../utils';

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

const Products = () => {
    const [filterProducts, setFilterProducts] = useState([]);
    const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
    const [priceFilter, setPriceFilter] = useState(false);
    const [priceSort, setPriceSort] = useState('default');
    const [priceMin, setPriceMin] = useState(0);
    const [priceMax, setPriceMax] = useState(1000000);

    const [{ loading, products, error }, dispatch] = useReducer(reducer, {
        loading: true,
        error: '',
        products: [],
    });

    const [catPath, setCatPath] = useState('All Categories');

    const para = useRef(null);

    const categories = ['aretes', 'collares'];

    useEffect(() => {
        const fetchData = async (req, res) => {
            dispatch({ type: 'FETCH_REQUEST' });
            try {
                const result = await axios.get('/api/products');
                dispatch({ type: 'FETCH_SUCCESS', payload: result.data.data });
                setFilterProducts(result.data.data);
            } catch (err) {
                dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return <LoadingBox />;
    } else if (error) {
        return <MessageBox>{error}</MessageBox>;
    }

    return (
        <div className="container mx-auto pb-20">
            <Helmet>
                <title>Cart</title>
            </Helmet>
            <h2 className="text-center text-3xl py-4 lg:py-10 ">
                All Products
            </h2>
            <div className="flex flex-col items-start  lg:flex-row lg:justify-between">
                <div className="w-full lg:hidden border-pink bg-pink shadow-lg  rounded-lg flex flex-col xl:gap-12 mb-4 p-2 py pt-2">
                    <p
                        ref={para}
                        className="select-none cursor-pointer capitalize font-semibold flex justify-between items-center "
                        onClick={() => {
                            setCategoryMenuOpen(!categoryMenuOpen);
                        }}>
                        <span>Filters</span>
                        <GiHamburgerMenu />
                    </p>
                    <div>
                        {categoryMenuOpen && (
                            <div>
                                <hr className="mb-8 mt-0" />
                                <div className="border-x border-b rounded-lg px-2 py-4 relative mb-2">
                                    <h3 className="absolute -top-2 font-bold">
                                        Categories
                                    </h3>
                                    <h3
                                        className="select-none cursor-pointer flex justify-between mt-2"
                                        onClick={() => {
                                            setFilterProducts(products);
                                            setCatPath('all categories');
                                        }}>
                                        <span
                                            className={
                                                catPath === 'all categories'
                                                    ? 'font-bold scale-105'
                                                    : 'font-semibold'
                                            }>
                                            All Products
                                        </span>
                                        <span>{`(${products.length})`}</span>
                                    </h3>
                                    {categories.map((cat, i) => (
                                        <div
                                            key={i}
                                            className="flex justify-between">
                                            <p
                                                ref={para}
                                                className={`select-none cursor-pointer capitalize ${
                                                    catPath === cat
                                                        ? 'font-bold scale-110'
                                                        : 'font-semibold'
                                                }`}
                                                key={i}
                                                onClick={() => {
                                                    const filters =
                                                        products.filter(
                                                            (product) =>
                                                                product.category ===
                                                                cat
                                                        );
                                                    setFilterProducts(filters);
                                                    setCatPath(categories[i]);
                                                }}>
                                                <span>{cat}</span>
                                            </p>

                                            <span>
                                                (
                                                {
                                                    products.filter(
                                                        (product) =>
                                                            product.category ===
                                                            cat
                                                    ).length
                                                }
                                                )
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                <div className="border rounded-lg mb-2">
                                    <button
                                        id="dropdownSearchButton"
                                        onClick={() =>
                                            setPriceFilter(!priceFilter)
                                        }
                                        className="inline-flex items-center px-4 py-2 text-sm font-bold text-left rounded-lg hover:scale-105"
                                        type="button">
                                        Price{' '}
                                        <ChevronDownIcon
                                            className="-mr-1 h-8 w-8 "
                                            aria-hidden="true"
                                        />
                                    </button>
                                    {priceFilter && (
                                        <div ClassName="z-10 hidden bg-white rounded-lg shadow w-60 dark:bg-gray-700">
                                            <ul className="h-48 px-3  pb-3 overflow-y-auto text-md">
                                                <li>
                                                    <div className="flex items-center p-2 rounded hover:scale-105">
                                                        <input
                                                            id="checkbox-item-1"
                                                            type="checkbox"
                                                            value="Lower to Higher"
                                                            checked={
                                                                priceSort ===
                                                                'Lower to Higher'
                                                            }
                                                            onChange={(e) => {
                                                                setPriceSort(
                                                                    e.target
                                                                        .value
                                                                );
                                                                const filter =
                                                                    products.sort(
                                                                        (
                                                                            a,
                                                                            b
                                                                        ) =>
                                                                            a.price -
                                                                            b.price
                                                                    );
                                                                setFilterProducts(
                                                                    filter
                                                                );
                                                                setCatPath(
                                                                    'Price:' +
                                                                        priceSort
                                                                );
                                                            }}
                                                            ClassName="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                                                        />
                                                        <label
                                                            for="checkbox-item-1"
                                                            ClassName="w-full ml-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300">
                                                            Lower to Higher
                                                        </label>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div className="flex items-center p-2 rounded hover:scale-105">
                                                        <input
                                                            id="checkbox-item-2"
                                                            type="checkbox"
                                                            value="Higher to Lower"
                                                            checked={
                                                                priceSort ===
                                                                'Higher to Lower'
                                                            }
                                                            onChange={(e) => {
                                                                setPriceSort(
                                                                    e.target
                                                                        .value
                                                                );
                                                                const filter =
                                                                    products.sort(
                                                                        (
                                                                            a,
                                                                            b
                                                                        ) =>
                                                                            b.price -
                                                                            a.price
                                                                    );
                                                                setFilterProducts(
                                                                    filter
                                                                );
                                                                setCatPath(
                                                                    'Price:' +
                                                                        priceSort
                                                                );
                                                            }}
                                                            ClassName="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                                                        />
                                                        <label
                                                            for="checkbox-item-2"
                                                            ClassName="w-full ml-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300">
                                                            Higher to Lower
                                                        </label>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div className="flex flex-col justify-between gap-2 mt-4 mb-2 w-1/3">
                                                        <div className="flex justify-between">
                                                            <label for="min">
                                                                Min:
                                                            </label>
                                                            <input
                                                                id="min"
                                                                type="text"
                                                                placeholder={
                                                                    priceMin
                                                                }
                                                                onChange={(
                                                                    e
                                                                ) => {
                                                                    setPriceMin(
                                                                        e.target
                                                                            .value
                                                                    );
                                                                }}
                                                                className="rounded-lg w-1/2 text-center"
                                                            />
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <label for="max">
                                                                Max:
                                                            </label>
                                                            <input
                                                                id="max"
                                                                type="text"
                                                                placeholder={
                                                                    priceMax
                                                                }
                                                                onChange={(
                                                                    e
                                                                ) => {
                                                                    setPriceMax(
                                                                        e.target
                                                                            .value
                                                                    );
                                                                }}
                                                                className="rounded-lg w-1/2 text-center"
                                                            />
                                                        </div>
                                                    </div>
                                                    <span>{`Poducts Found: ${
                                                        filterProducts.filter(
                                                            (product) =>
                                                                (product.price >=
                                                                    priceMin) &
                                                                (product.price <=
                                                                    priceMax)
                                                        ).length
                                                    }`}</span>
                                                </li>
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="hidden min-h-screen h-full w-[20%] border-pink bg-pink shadow-lg  rounded-lg lg:inline-flex flex-col gap-3 p-2 py pt-2">
                    <p ref={para}>
                        <strong>Filters</strong>
                    </p>
                    <div className="border-x border-b rounded-lg px-2 py-4 relative mb-2">
                        <h3 className="absolute -top-2 font-bold">
                            Categories
                        </h3>
                        <h3
                            className="select-none cursor-pointer flex justify-between"
                            onClick={() => {
                                setFilterProducts(products);
                                setCatPath('all categories');
                            }}>
                            <span
                                className={
                                    catPath === 'all categories'
                                        ? 'font-bold scale-105'
                                        : 'font-semibold'
                                }>
                                All Products
                            </span>
                            <span>{`(${products.length})`}</span>
                        </h3>
                        {categories.map((cat, i) => (
                            <div key={i} className="flex justify-between">
                                <p
                                    ref={para}
                                    className={`select-none cursor-pointer capitalize ${
                                        catPath === cat
                                            ? 'font-bold scale-110'
                                            : 'font-semibold'
                                    }`}
                                    key={i}
                                    onClick={() => {
                                        const filters = products.filter(
                                            (product) =>
                                                product.category === cat
                                        );
                                        setFilterProducts(filters);
                                        setCatPath(categories[i]);
                                    }}>
                                    <span>{cat}</span>
                                </p>
                                <span>
                                    (
                                    {
                                        products.filter(
                                            (product) =>
                                                product.category === cat
                                        ).length
                                    }
                                    )
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="border rounded-lg mb-2">
                        <button
                            id="dropdownSearchButton"
                            onClick={() => setPriceFilter(!priceFilter)}
                            className="inline-flex items-center px-4 py-2 text-sm font-bold text-left rounded-lg hover:scale-105"
                            type="button">
                            Price{' '}
                            <ChevronDownIcon
                                className="-mr-1 h-8 w-8  text-white"
                                aria-hidden="true"
                            />
                        </button>
                        {priceFilter && (
                            <div ClassName="z-10 hidden bg-white rounded-lg shadow w-60 dark:bg-gray-700">
                                <ul className="h-48 px-3  pb-3 overflow-y-auto text-md">
                                    <li>
                                        <div className="flex items-center p-2 rounded hover:scale-105">
                                            <input
                                                id="checkbox-item-1"
                                                type="checkbox"
                                                value="Lower to Higher"
                                                checked={
                                                    priceSort ===
                                                    'Lower to Higher'
                                                }
                                                onChange={(e) => {
                                                    setPriceSort(
                                                        e.target.value
                                                    );
                                                    const filter =
                                                        products.sort(
                                                            (a, b) =>
                                                                a.price -
                                                                b.price
                                                        );
                                                    setFilterProducts(filter);
                                                    setCatPath(
                                                        'Price:' + priceSort
                                                    );
                                                }}
                                                ClassName="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                                            />
                                            <label
                                                htmlFor="checkbox-item-1"
                                                ClassName="w-full ml-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300">
                                                Lower to Higher
                                            </label>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="flex items-center p-2 rounded hover:scale-105">
                                            <input
                                                id="checkbox-item-2"
                                                type="checkbox"
                                                value="Higher to Lower"
                                                checked={
                                                    priceSort ===
                                                    'Higher to Lower'
                                                }
                                                onChange={(e) => {
                                                    setPriceSort(
                                                        e.target.value
                                                    );
                                                    const filter =
                                                        products.sort(
                                                            (a, b) =>
                                                                b.price -
                                                                a.price
                                                        );
                                                    setFilterProducts(filter);
                                                    setCatPath(
                                                        'Price:' + priceSort
                                                    );
                                                }}
                                                ClassName="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                                            />
                                            <label
                                                htmlFor="checkbox-item-2"
                                                ClassName="w-full ml-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300">
                                                Higher to Lower
                                            </label>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="flex flex-col justify-between gap-2 mt-4 mb-2 w-1/3">
                                            <div className="flex justify-between">
                                                <label htmlFor="min">
                                                    Min:
                                                </label>
                                                <input
                                                    id="min"
                                                    type="text"
                                                    placeholder={priceMin}
                                                    onChange={(e) => {
                                                        setPriceMin(
                                                            e.target.value
                                                        );
                                                    }}
                                                    className="rounded-lg w-1/2 text-center"
                                                />
                                            </div>
                                            <div className="flex justify-between">
                                                <label for="max">Max:</label>
                                                <input
                                                    id="max"
                                                    type="text"
                                                    placeholder={priceMax}
                                                    onChange={(e) => {
                                                        setPriceMax(
                                                            e.target.value
                                                        );
                                                    }}
                                                    className="rounded-lg w-1/2 text-center"
                                                />
                                            </div>
                                        </div>
                                        <span>{`Poducts Found: ${
                                            filterProducts.filter(
                                                (product) =>
                                                    (product.price >=
                                                        priceMin) &
                                                    (product.price <= priceMax)
                                            ).length
                                        }`}</span>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

                <div className="lg:w-[70%] 2xl:w-[75%]">
                    <p className="text-gray-500 pb-4">
                        {<Link to="/">Home </Link>}/
                        <span className="text-sky-400 px-1">{catPath}</span>
                    </p>
                    <div className="w-full flex flex-wrap justify-evenly gap-5 md:gap-10 lg:grid grid-cols-2 md:grid-cols-3">
                        {filterProducts &&
                            filterProducts
                                .filter(
                                    (product) =>
                                        (product.price >= priceMin) &
                                        (product.price <= priceMax)
                                )
                                .map((product) => (
                                    <ProductCard
                                        key={product._id}
                                        product={product}
                                    />
                                ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Products;
