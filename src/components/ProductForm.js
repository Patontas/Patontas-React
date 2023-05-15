import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Store } from '../Store';

const ProductForm = (props) => {
    const { state } = useContext(Store);
    const { userInfo } = state;

    // eslint-disable-next-line
    const [product, setProduct] = useState(props.product);
    const [action, setAction] = useState('');
    // eslint-disable-next-line
    const [content, setContent] = useState(props.content);

    const [name, setName] = useState(product.name || '');
    const [price, setPrice] = useState(product.price || 0);
    const [slug, setSlug] = useState(product.slug || '');
    const [countInStock, setCountInStock] = useState(product.countInStock || 0);
    const [category, setCategory] = useState(product.category || '');
    const [description, setDescription] = useState('');
    // eslint-disable-next-line
    const [image, setImage] = useState(null);

    useEffect(() => {
        if (!props.product.name) {
            setAction('save');
        } else {
            setAction('update');
        }
    }, [props]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = document.getElementById('form');
        const formData = new FormData(form);
        if (action === 'save') {
            await axios
                .post('/api/products/save', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        authorization: `Bearer ${userInfo.token}`,
                    },
                })
                .then((res) => {
                    alert(res.data.msg);
                })
                .catch((err) => {
                    alert(err.message);
                });
            setContent('productsList');
            props.contentChange('productsList');
        } else if (action === 'update') {
            await axios
                .put(`/api/products/update/${product._id}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        authorization: `Bearer ${userInfo.token}`,
                    },
                })
                .then((res) => {
                    alert(res.data.msg);
                })
                .catch((err) => {
                    alert(err.message);
                });

            setContent('productsList');
            props.ctChange('productsList');
        }
    };

    return (
        <div className="w-full">
            <h2 className="text-center text-3xl ">Product Form</h2>
            <form
                id="form"
                onSubmit={handleSubmit}
                className="w-full flex flex-col gap-2 my-4">
                <div className="flex items-center justify-start gap-6">
                    <div className="w-2/6 flex flex-col text-lg xl:text-xl gap-1">
                        <label htmlFor="name">Product Name</label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="border rounded-lg bg-gray-50 px-3 py-1"
                        />
                    </div>
                    <div className="w-2/6 flex flex-col text-lg xl:text-xl gap-1">
                        <label htmlFor="price">Price</label>
                        <input
                            type="number"
                            name="price"
                            id="price"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="border rounded-lg bg-gray-50 px-3 py-1"
                        />
                    </div>
                    <div className="w-2/6 flex flex-col text-lg xl:text-xl gap-1">
                        <label htmlFor="slug">Slug</label>
                        <input
                            type="text"
                            name="slug"
                            id="slug"
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                            className="border rounded-lg bg-gray-50 px-3 py-1"
                        />
                    </div>
                </div>
                <div className="flex items-center justify-start gap-6">
                    <div className="w-2/6 flex flex-col text-lg xl:text-xl gap-1">
                        <label htmlFor="category">Category</label>
                        <select
                            name="category"
                            id="category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="border rounded-lg bg-gray-50 px-3 py-1">
                            <option disabled>Actual: {category}</option>
                            <option value="aretes">Aretes</option>
                            <option value="collares">collares</option>
                        </select>
                    </div>
                    <div className="w-2/6 flex flex-col text-lg xl:text-xl gap-1">
                        <label htmlFor="stock">Stock</label>
                        <input
                            type="number"
                            name="countInStock"
                            id="stock"
                            value={countInStock}
                            onChange={(e) => setCountInStock(e.target.value)}
                            className="border rounded-lg bg-gray-50 px-3 py-1"
                        />
                    </div>
                    <div className="w-2/6 flex flex-col text-lg xl:text-xl gap-1">
                        <label htmlFor="image">Image</label>
                        <input
                            type="file"
                            name="imagenProducto"
                            id="image"
                            onChange={(e) => setImage(e.target.files[0])}
                            className="border rounded-lg bg-gray-50 px-3 py-1"
                        />
                    </div>
                </div>
                <div className="w-2/6 flex flex-col gap-1">
                    <label htmlFor="description" className="text-lg xl:text-xl">
                        Description
                    </label>
                    <textarea
                        name="description"
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="border rounded-lg bg-gray-50 px-3 py-1"
                    />
                </div>
                <div className="w-1/2 flex gap-4">
                    <button
                        type="submit"
                        className="w-1/4 rounded-lg border hover:bg-blue-500 bg-yellow py-3 px-8 
        text-black font-bold font-serif mt-4">
                        {action}
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setContent('productsList');
                            props.ctChange('productsList');
                        }}
                        className="w-1/4 rounded-lg border hover:bg-blue-500 bg-yellow py-3 px-8 
        text-black font-bold font-serif mt-4">
                        Return
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProductForm;
