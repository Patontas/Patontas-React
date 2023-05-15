import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { FaFilter, FaSearch, FaTrashAlt } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { Store } from '../Store';
import { getError } from '../utils';

const OrdersTable = () => {
    const navigate = useNavigate();
    const { state } = useContext(Store);
    const { userInfo } = state;

    const [orders, setOrders] = useState([]);
    const [searchText, setSearchText] = useState('');
    // eslint-disable-next-line
    const [searchedResult, setSearchedResult] = useState(null);
    const [deliveryFilter, setDeliveryFilter] = useState(null);
    const [paymentFilter, setPaymentFilter] = useState(null);
    const [filters, setFilters] = useState(false);

    const handleSearch = () => {
        const searchedResult = orders.filter(
            (orders) =>
                orders.shippingAddress.name
                    .toLowerCase()
                    .includes(searchText.toLowerCase()) ||
                orders._id.toLowerCase().includes(searchText.toLowerCase())
        );
        setSearchedResult(searchedResult);
    };

    const deleteOrder = async (id) => {
        await axios
            .delete(`api/orders/delete/${id}`, {
                headers: {
                    authorization: `Bearer ${userInfo.token}`,
                },
            })
            .then((res) => {
                alert('User Deleted Successfully');
            })
            .catch((err) => {
                alert(err.response.data.msg);
            });
    };

    const handlePayment = async (id) => {
        await axios
            .put(
                `https://patontas-api.onrender.com/api/orders/update/${id}`,
                { isPaid: true },
                {
                    headers: {
                        authorization: `Bearer ${userInfo.token}`,
                    },
                }
            )
            .then((res) => {
                alert('Order Updated Successfully');
            })
            .catch((err) => {
                alert(err.response.data.msg);
            });
    };

    const handleDelivery = async (id) => {
        await axios
            .put(
                `https://patontas-api.onrender.com/api/orders/update/${id}`,
                { isDelivered: true },
                {
                    headers: {
                        authorization: `Bearer ${userInfo.token}`,
                    },
                }
            )
            .then((res) => {
                alert('Order Updated Successfully');
            })
            .catch((err) => {
                alert(err.response.data.msg);
            });
    };

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await axios.get(
                    'https://patontas-api.onrender.com/api/orders/',
                    {
                        headers: {
                            authorization: `Bearer ${userInfo.token}`,
                        },
                    }
                );
                setOrders(res.data.orders);
            } catch (err) {
                getError(err);
            }
        };
        fetchOrders();
    }, [userInfo, navigate, orders]);

    return (
        <div className="w-full">
            <div className="flex gap-4 items-center justify-center  mb-8">
                <div className="flex items-center gap-4">
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
                <button type="button" onClick={() => setFilters(!filters)}>
                    <FaFilter size={20} />
                </button>
                <div
                    className={`${
                        filters ? 'flex items-center gap-4' : 'hidden'
                    } border border-pink rounded-lg`}>
                    <button
                        type="button"
                        onClick={() => {
                            setPaymentFilter(null);
                            setDeliveryFilter(null);
                        }}
                        className="rounded-lg px-1 hover:scale-105 
                       text-black">
                        ALL
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            if (paymentFilter) {
                                setPaymentFilter(null);
                            } else {
                                setPaymentFilter(true);
                            }
                        }}
                        className="rounded-lg  px-1 hover:scale-105 
                        text-black ">
                        Payment Pending
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            if (deliveryFilter) {
                                setDeliveryFilter(null);
                            } else {
                                setDeliveryFilter(true);
                            }
                        }}
                        className="rounded-lgpx-1 hover:scale-105 
                        text-black">
                        Not Delivered
                    </button>
                </div>
            </div>
            <table className="w-full text-sm text-left text-black rounded-lg">
                <thead className="text-sm text-black uppercase bg-pink rounded-lg">
                    <tr>
                        <th className="px-6 py-2" scope="col">
                            ID
                        </th>
                        <th className="px-6 py-2" scope="col">
                            NAME
                        </th>
                        <th className="px-6 py-2" scope="col">
                            Date
                        </th>
                        <th className="px-6 py-2" scope="col">
                            Total
                        </th>
                        <th className="px-6 py-2" scope="col">
                            PAID
                        </th>
                        <th className="px-6 py-2" scope="col">
                            DELIVERED
                        </th>
                        <th className="px-6 py-2" scope="col">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {searchText
                        ? searchedResult
                              .filter(
                                  (order) =>
                                      order.isPaid !== paymentFilter &&
                                      order.isDelivered !== deliveryFilter
                              )
                              .map((order) => (
                                  <tr
                                      key={order._id}
                                      className="border border-pink">
                                      <th
                                          className="px-6 py-3 truncate whitespace-wrap"
                                          scope="row">
                                          {order._id}
                                      </th>
                                      <td className="px-6 py-3">
                                          {order.shippingAddress.name}
                                      </td>
                                      <td className="px-6 py-3">
                                          {order.createdAt.substring(0, 10)}
                                      </td>
                                      <td className="px-2 py-3">
                                          <p>{order.totalPrice}</p>
                                      </td>
                                      {order.isPaid ? (
                                          <td className="px-2 py-3">
                                              <p
                                                  className="w-full border border-green-300 rounded-lg shadow-sm shadow-green-300
                                                 bg-green-200 p-1 font-bold text-green-800 text-center">
                                                  Order Paid
                                              </p>
                                          </td>
                                      ) : (
                                          <td className="px-2 py-3">
                                              <button
                                                  type="button"
                                                  onClick={() =>
                                                      handlePayment(order._id)
                                                  }
                                                  className="w-full border border-red-300 rounded-lg shadow-sm shadow-red-300
                                                 bg-red-200 p-1 font-bold text-red-800 text-center">
                                                  Waiting Payment
                                              </button>
                                          </td>
                                      )}
                                      {order.isDelivered ? (
                                          <td className="px-2 py-3">
                                              <p
                                                  className="w-full border border-green-300 rounded-lg shadow-sm shadow-green-300 
                                                bg-green-200 p-1 font-bold text-green-800 text-center">
                                                  Order Delivered
                                              </p>
                                          </td>
                                      ) : (
                                          <td className="px-2 py-3">
                                              <button
                                                  type="button"
                                                  onClick={() =>
                                                      handleDelivery(order._id)
                                                  }
                                                  className="w-full border border-red-300 rounded-lg shadow-sm shadow-red-300
                                                 bg-red-200 p-1 font-bold text-red-800 text-center">
                                                  Not Delivered
                                              </button>
                                          </td>
                                      )}
                                      <td className="flex items-center gap-4 p-3">
                                          <Link
                                              to={`/order/${order._id}`}
                                              className="rounded-lg border hover:bg-blue-500 bg-yellow px-6 py-2 
                       text-black font-medium font-serif">
                                              {' '}
                                              Details
                                          </Link>
                                          <button
                                              type="button"
                                              onClick={() =>
                                                  deleteOrder(order._id)
                                              }
                                              className="rounded-lg border hover:bg-blue-500 bg-red-600 p-2 
              text-white font-bold font-serif">
                                              <FaTrashAlt size={20} />
                                          </button>
                                      </td>
                                  </tr>
                              ))
                        : orders
                              .filter(
                                  (order) =>
                                      order.isPaid !== paymentFilter &&
                                      order.isDelivered !== deliveryFilter
                              )
                              .map((order) => (
                                  <tr
                                      key={order._id}
                                      className="border border-pink">
                                      <th
                                          className="px-6 py-3 truncate whitespace-wrap"
                                          scope="row">
                                          {order._id}
                                      </th>
                                      <td className="px-6 py-3">
                                          {order.shippingAddress.name}
                                      </td>
                                      <td className="px-6 py-3">
                                          {order.createdAt.substring(0, 10)}
                                      </td>
                                      <td className="px-2 py-3">
                                          <p>{order.totalPrice}</p>
                                      </td>
                                      {order.isPaid ? (
                                          <td className="px-2 py-3">
                                              <p
                                                  className="w-full border border-green-300 rounded-lg shadow-sm shadow-green-300
                                                 bg-green-200 p-1 font-bold text-green-800 text-center">
                                                  Order Paid
                                              </p>
                                          </td>
                                      ) : (
                                          <td className="px-2 py-3">
                                              <button
                                                  type="button"
                                                  onClick={() =>
                                                      handlePayment(order._id)
                                                  }
                                                  className="w-full border border-red-300 rounded-lg shadow-sm shadow-red-300
                                                 bg-red-200 p-1 font-bold text-red-800 text-center">
                                                  Waiting Payment
                                              </button>
                                          </td>
                                      )}
                                      {order.isDelivered ? (
                                          <td className="px-2 py-3">
                                              <p
                                                  className="w-full border border-green-300 rounded-lg shadow-sm shadow-green-300 
                                                bg-green-200 p-1 font-bold text-green-800 text-center">
                                                  Order Delivered
                                              </p>
                                          </td>
                                      ) : (
                                          <td className="px-2 py-3">
                                              <button
                                                  type="button"
                                                  onClick={() =>
                                                      handleDelivery(order._id)
                                                  }
                                                  className="w-full border border-red-300 rounded-lg shadow-sm shadow-red-300
                                                 bg-red-200 p-1 font-bold text-red-800 text-center">
                                                  Not Delivered
                                              </button>
                                          </td>
                                      )}
                                      <td className="flex items-center gap-4 p-3">
                                          <Link
                                              to={`/order/${order._id}`}
                                              className="rounded-lg border hover:bg-blue-500 bg-yellow px-6 py-2 
                       text-black font-medium font-serif">
                                              Details
                                          </Link>

                                          <button
                                              type="button"
                                              onClick={() =>
                                                  deleteOrder(order._id)
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
    );
};

export default OrdersTable;
