import React, { useState } from 'react';
import { AiFillHome } from 'react-icons/ai';
import { BiMenu, BiStore, BiUser } from 'react-icons/bi';
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';
import { FaProductHunt } from 'react-icons/fa';
import { MdRequestPage } from 'react-icons/md';
import { Link, NavLink } from 'react-router-dom';

const SideBar = (props) => {
    const [open, setOpen] = useState(props.open);
    // eslint-disable-next-line
    const [content, setContent] = useState(props.content);
    const [openProducts, setOpenProducts] = useState(false);

    return (
        <div
            className={`${
                open
                    ? 'w-64 fixed top-0 bg-yellow'
                    : 'w-20 fixed top-0 bg-yellow'
            } duration-300 z-50 h-screen`}>
            <div className="w-full h-fit flex items-center p-4">
                <div
                    onClick={() => {
                        setOpen(!open);
                        props.openChange(!open);
                    }}
                    className="hover:scale-105 hover:shadow-lg rounded-full">
                    <BiMenu
                        size={36}
                        color="white"
                        className={`cursor-pointer  ${open ? 'm-1' : 'm-1'}`}
                    />
                </div>
                <div className={`${open ? 'inline-flex' : 'hidden'}`}>
                    <Link to="/">
                        <div className="flex gap-2 items-center">
                            <img
                                className="w-8 h-8 lg:w-10 lg:h-10"
                                src="./p_logo.png"
                                alt="logo"
                            />
                            <p
                                className={`invisible text-white md:visible font-bold text-xl lg:text-2xl `}>
                                PATONTAS
                            </p>
                        </div>
                    </Link>
                </div>
            </div>
            {open ? (
                <aside
                    className={`bg-yellow w-full absolute left-0 top-20 z-9999 flex flex-col rounded-lg`}>
                    <nav className="p-4 lg:mt-4 lg:px-6 text-white">
                        <div className="w-full">
                            <ul className="mb-6 flex flex-col gap-2">
                                <li className="p-2 hover:scale-105 hover:shadow-lg rounded-full font-bold">
                                    <NavLink
                                        to="/"
                                        className="flex items-center gap-4">
                                        <BiStore size={24} />
                                        <h3>Store</h3>
                                    </NavLink>
                                </li>
                                <li className="p-2 hover:scale-105 hover:shadow-lg rounded-full font-bold">
                                    <div
                                        onClick={() => {
                                            setContent('home');
                                            props.contentChange('home');
                                        }}
                                        className="flex items-center gap-4">
                                        <AiFillHome size={24} />
                                        <h3>HOME</h3>
                                    </div>
                                </li>
                                <li className="p-2 hover:scale-105 hover:shadow-lg rounded-full font-bold">
                                    <div
                                        onClick={() => {
                                            setContent('users');
                                            props.contentChange('users');
                                        }}
                                        className="flex items-center gap-4">
                                        <BiUser size={24} />
                                        <h3>Users</h3>
                                    </div>
                                </li>
                                <li className="px-2 py-4 hover:scale-105 hover:shadow-lg rounded-full font-bold flex flex-col justify-center gap-4">
                                    <div
                                        className="flex items-center gap-4"
                                        onClick={() => {
                                            setOpenProducts(!openProducts);
                                        }}>
                                        <FaProductHunt size={24} />
                                        <p>PRODUCTS</p>
                                        {openProducts ? (
                                            <BsChevronUp />
                                        ) : (
                                            <BsChevronDown />
                                        )}
                                    </div>
                                    {openProducts && (
                                        <ul className="flex flex-col gap-1">
                                            <li className="ml-4">
                                                <NavLink
                                                    to="/products"
                                                    className="flex items-center gap-2">
                                                    <MdRequestPage size={16} />
                                                    <p className="font-medium text-sm">
                                                        Products Page
                                                    </p>
                                                </NavLink>
                                            </li>
                                            <li className="ml-4">
                                                <div
                                                    onClick={() => {
                                                        setContent(
                                                            'productsList'
                                                        );
                                                        props.contentChange(
                                                            'productsList'
                                                        );
                                                    }}
                                                    className="flex items-center gap-2 cursor-pointer">
                                                    <FaProductHunt size={16} />
                                                    <p className="font-medium text-sm">
                                                        Products List
                                                    </p>
                                                </div>
                                            </li>
                                            <li className="ml-4">
                                                <div
                                                    onClick={() => {
                                                        setContent(
                                                            'addProduct'
                                                        );
                                                        props.contentChange(
                                                            'addProduct'
                                                        );
                                                    }}
                                                    className="flex items-center gap-2 cursor-pointer">
                                                    <FaProductHunt size={16} />
                                                    <p className="font-medium text-sm">
                                                        Add Products
                                                    </p>
                                                </div>
                                            </li>
                                        </ul>
                                    )}
                                </li>
                            </ul>
                        </div>
                    </nav>
                </aside>
            ) : (
                <aside
                    className={`bg-yellow absolute left-0 top-20 z-9999 w-full flex flex-col`}>
                    <nav className="p-4 lg:px-6 text-white">
                        <div className="w-full">
                            <ul className="mb-6 flex flex-col justify-center items-center gap-2">
                                <li className="p-2 hover:scale-105 hover:shadow-lg rounded-full">
                                    <NavLink to="/">
                                        <BiStore size={24} />
                                    </NavLink>
                                </li>
                                <li className="p-2 hover:scale-105 hover:shadow-lg rounded-full">
                                    <div
                                        onClick={() => {
                                            setContent('home');
                                            props.contentChange('home');
                                        }}>
                                        <AiFillHome size={24} />
                                    </div>
                                </li>
                                <li className="p-2 hover:scale-105 hover:shadow-lg rounded-full">
                                    <div
                                        onClick={() => {
                                            setContent('users');
                                            props.contentChange('users');
                                        }}>
                                        <BiUser size={24} />
                                    </div>
                                </li>
                                <li className="p-2 hover:scale-105 hover:shadow-lg rounded-full">
                                    <div
                                        onClick={() => {
                                            setOpen(!open);
                                            setOpenProducts(!openProducts);
                                        }}>
                                        <FaProductHunt
                                            size={24}
                                            className="cursor-pointer"
                                        />
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </nav>
                </aside>
            )}
        </div>
    );
};

export default SideBar;
