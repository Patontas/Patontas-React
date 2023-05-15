import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { FaSearch, FaTrashAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { Store } from '../Store';
import { getError } from '../utils';

const UserTable = () => {
    const navigate = useNavigate();
    const { state } = useContext(Store);

    const [users, setUsers] = useState([]);
    const { userInfo } = state;
    const [searchText, setSearchText] = useState('');
    const [searchedResult, setSearchedResult] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await axios.get(
                    'https://patontas-api.onrender.com/api/users/fetch-users',
                    {
                        headers: {
                            authorization: `Bearer ${userInfo.token}`,
                        },
                    }
                );
                setUsers(res.data.users);
            } catch (err) {
                getError(err);
            }
        };
        fetchUsers();
    }, [userInfo, navigate, users]);

    const handleSearch = () => {
        const searchedResult = users.filter(
            (user) =>
                user.name.toLowerCase().includes(searchText.toLowerCase()) ||
                user.email.toLowerCase().includes(searchText.toLowerCase()) ||
                user._id.toLowerCase().includes(searchText.toLowerCase())
        );
        console.log(users);
        setSearchedResult(searchedResult);
    };

    const changeRol = async (id, rol) => {
        await axios
            .put(
                `api/users/update/${id}`,
                {
                    isAdmin: !rol,
                },
                {
                    headers: {
                        authorization: `Bearer ${userInfo.token}`,
                    },
                }
            )
            .then((res) => {
                alert('User Updated Successfully');
            })
            .catch((err) => {
                alert(err.response.data.msg);
            });
    };

    const deleteUser = async (id) => {
        await axios
            .delete(`api/users/delete/${id}`, {
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
    return (
        <div className="w-full">
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
                            FULL NAME
                        </th>
                        <th className="px-6 py-2" scope="col">
                            EMAIL
                        </th>
                        <th className="px-6 py-2" scope="col">
                            ROL
                        </th>
                        <th className="px-6 py-2" scope="col">
                            ACTIONS
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {searchText
                        ? searchedResult.map((user) => (
                              <tr key={user._id} className="border border-pink">
                                  <th
                                      className="px-6 py-3 truncate whitespace-wrap"
                                      scope="row">
                                      {user._id}
                                  </th>
                                  <td className="px-6 py-3">{user.name}</td>
                                  <td className="px-6 py-3">{user.email}</td>
                                  <td className="px-6 py-3">
                                      <div className="w-full flex items-center gap-2">
                                          <p>
                                              {user.isAdmin
                                                  ? 'Admin'
                                                  : 'Regular'}
                                          </p>
                                          <button
                                              type="button"
                                              onClick={() =>
                                                  changeRol(
                                                      user._id,
                                                      user.isAdmin
                                                  )
                                              }
                                              className="rounded-lg border hover:bg-blue-500 bg-yellow p-2 
                    text-white font-bold font-serif">
                                              Change
                                          </button>
                                      </div>
                                  </td>
                                  <td className="flex items-center gap-4 p-3">
                                      <button
                                          type="button"
                                          onClick={() => deleteUser(user._id)}
                                          className="rounded-lg border hover:bg-blue-500 bg-red-600 p-2 
                    text-white font-bold font-serif">
                                          <FaTrashAlt size={20} />
                                      </button>
                                  </td>
                              </tr>
                          ))
                        : users.map((user) => (
                              <tr key={user._id} className="border border-pink">
                                  <th
                                      className="px-6 py-3 truncate whitespace-wrap"
                                      scope="row">
                                      {user._id}
                                  </th>
                                  <td className="px-6 py-3">{user.name}</td>
                                  <td className="px-6 py-3">{user.email}</td>
                                  <td className="px-6 py-3">
                                      <div className="w-full flex items-center gap-2">
                                          <p>
                                              {user.isAdmin
                                                  ? 'Admin'
                                                  : 'Regular'}
                                          </p>
                                          <button
                                              type="button"
                                              onClick={() =>
                                                  changeRol(
                                                      user._id,
                                                      user.isAdmin
                                                  )
                                              }
                                              className="rounded-lg border hover:bg-blue-500 bg-yellow p-2 
                    text-white font-bold font-serif">
                                              Change
                                          </button>
                                      </div>
                                  </td>
                                  <td className="flex items-center gap-4 p-3">
                                      <button
                                          type="button"
                                          onClick={() => deleteUser(user._id)}
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

export default UserTable;
