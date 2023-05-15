import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { FaSearch, FaTrashAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { Store } from '../Store';
import { getError } from '../utils';
import ProductForm from './ProductForm';

const ProductsTable = (props) => {
    const navigate = useNavigate();
    const { state } = useContext(Store);

    const [products, setProducts] = useState([]);
    const [productForm, setProductForm] = useState({});
    const [content, setContent] = useState(props.content);
    const { userInfo } = state;
    const [searchText, setSearchText] = useState('');
    const [searchedResult, setSearchedResult] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get('/api/products/', {
                    headers: {
                        authorization: `Bearer ${userInfo.token}`,
                    },
                });
                setProducts(res.data.data);
            } catch (err) {
                getError(err);
            }
        };
        fetchProducts();
    }, [userInfo, navigate, products]);

    const handleSearch = () => {
        const searchedResult = products.filter(
            (product) =>
                product.name.toLowerCase().includes(searchText.toLowerCase()) ||
                product.category
                    .toLowerCase()
                    .includes(searchText.toLowerCase()) ||
                product._id.toLowerCase().includes(searchText.toLowerCase())
        );
        setSearchedResult(searchedResult);
    };

    const deleteProduct = async (id) => {
        await axios
            .delete(`api/products/delete/${id}`, {
                headers: {
                    authorization: `Bearer ${userInfo.token}`,
                },
            })
            .then((res) => {
                alert('Product Deleted Successfully');
            })
            .catch((err) => {
                alert(err.response.data.msg);
            });
    };

    const ctChange = (ct) => {
        setContent(ct);
    };

    return (
        <div className="w-full">
            {content === 'productsList' ? (
                <div>
                    <div>
                        <div className="flex items-center  gap-4 mb-4">
                            <label htmlFor="address">Search: </label>
                            <input
                                type="text"
                                name="address"
                                id="address"
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                onClick={handleSearch}
                                className="border rounded-lg bg-gray-50 px-3 py-1"
                            />
                            <FaSearch
                                size={24}
                                className="relative right-12 cursor-pointer"
                                onClick={handleSearch}
                            />
                        </div>
                    </div>
                    <table className="w-full text-sm text-left text-black rounded-lg">
                        <thead className="text-sm text-black uppercase bg-pink rounded-lg">
                            <tr>
                                <th className="px-6 py-2" scope="col">
                                    ID
                                </th>
                                <th className="px-6 py-2" scope="col">
                                    Image
                                </th>
                                <th className="px-6 py-2" scope="col">
                                    PRODUCT NAME
                                </th>
                                <th className="px-6 py-2" scope="col">
                                    CATEGORY
                                </th>
                                <th className="px-6 py-2" scope="col">
                                    PRICE
                                </th>
                                <th className="px-6 py-2" scope="col">
                                    STOCK
                                </th>
                                <th className="px-6 py-2" scope="col">
                                    ACTIONS
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {searchText
                                ? searchedResult.map((product) => (
                                      <tr
                                          key={product._id}
                                          className="border border-pink">
                                          <th
                                              className="px-6 py-3 truncate whitespace-wrap"
                                              scope="row">
                                              {product._id}
                                          </th>
                                          <td>
                                              <div className="w-1/4">
                                                  <img
                                                      src={product.images}
                                                      alt={product.name}
                                                      className=" max-w-full min-w-[96px] h-24 "
                                                  />
                                              </div>
                                          </td>
                                          <td className="px-6 py-3">
                                              {product.name}
                                          </td>
                                          <td className="px-6 py-3">
                                              {product.category}
                                          </td>
                                          <td className="px-6 py-3">
                                              {product.price}
                                          </td>
                                          <td className="px-6 py-3">
                                              {product.countInStock}
                                          </td>
                                          <td className="px-6 py-3">
                                              <button
                                                  type="button"
                                                  onClick={() => {
                                                      setContent('productForm');
                                                      setProductForm(product);
                                                  }}
                                                  className="w-full rounded-lg border hover:bg-blue-500 bg-yellow p-2 
                       text-black font-medium font-serif text-xl">
                                                  Edit
                                              </button>
                                              <button
                                                  type="button"
                                                  onClick={() =>
                                                      deleteProduct(product._id)
                                                  }
                                                  className="rounded-lg border hover:bg-blue-500 bg-red-600 p-2 
                   text-white font-bold font-serif">
                                                  <FaTrashAlt size={20} />
                                              </button>
                                          </td>
                                      </tr>
                                  ))
                                : products.map((product) => (
                                      <tr
                                          key={product._id}
                                          className="border border-pink">
                                          <th
                                              className="px-1 py-3 truncate whitespace-wrap"
                                              scope="row">
                                              {product._id}
                                          </th>

                                          <td className="px-6 py-3">
                                              <img
                                                  src={product.images}
                                                  alt={product.name}
                                                  className="w-16 h-16"
                                              />
                                          </td>
                                          <td className="px-6 py-3">
                                              {product.name}
                                          </td>
                                          <td className="px-6 py-3">
                                              {product.category}
                                          </td>
                                          <td className="px-6 py-3">
                                              {product.price}
                                          </td>
                                          <td className="px-6 py-3">
                                              {product.countInStock}
                                          </td>
                                          <td className="flex items-center mt-4  gap-4 p-3">
                                              <button
                                                  type="button"
                                                  onClick={() => {
                                                      setContent('productForm');
                                                      setProductForm(product);
                                                  }}
                                                  className="rounded-lg border hover:bg-blue-500 bg-yellow px-6 py-2 
                       text-black font-medium font-serif">
                                                  Edit
                                              </button>
                                              <button
                                                  type="button"
                                                  onClick={() =>
                                                      deleteProduct(product._id)
                                                  }
                                                  className="rounded-lg border hover:bg-blue-500 bg-red-600 p-2 
                   text-white font-bold font-serif">
                                                  <FaTrashAlt size={20} />
                                              </button>
                                          </td>
                                      </tr>
                                  ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div>
                    <ProductForm
                        product={productForm}
                        content={content}
                        ctChange={ctChange}
                    />
                </div>
            )}
        </div>
    );
};

export default ProductsTable;
