import { AiFillInstagram, AiFillMail } from 'react-icons/ai';
import { BsFillTelephoneFill } from 'react-icons/bs';
import { FaWhatsappSquare } from 'react-icons/fa';
import { Link, NavLink } from 'react-router-dom';

const Footer = () => {
    return (
        <div className="bg-pink py-5 flex flex-col gap-4 ">
            <div className="w-full text-white container mx-auto flex flex-col md:flex-row gap-4 items-center justify-evenly">
                <div>
                    <Link to="/" className="">
                        <div className="flex gap-2 items-end">
                            <img
                                className="w-8 h-8 lg:w-10 lg:h-10"
                                src="./p_logo.png"
                                alt="logo"
                            />
                            <p className="font-bold text-xl lg:text-2xl">
                                PATONTAS
                            </p>
                        </div>
                    </Link>
                </div>
                <div>
                    <nav>
                        <ul className="list-none flex flex-col justify-between items-center ml-auto gap-1">
                            <li className="px-2 hover:scale-105 hover:shadow-lg rounded-full text-lg">
                                <NavLink to="/">Home</NavLink>
                            </li>
                            <li className="px-2 hover:scale-105 hover:shadow-lg rounded-full text-lg">
                                <NavLink to="/products">Products</NavLink>
                            </li>
                            <li className="px-2 hover:scale-105 hover:shadow-lg rounded-full text-lg">
                                <NavLink to="/cart">Cart</NavLink>
                            </li>
                        </ul>
                    </nav>
                </div>
                <div className="text-lg font-bold uppercase flex flex-col gap-2 items-center">
                    <p>Social Media</p>
                    <div className="flex gap-2">
                        <Link
                            to={
                                'https://www.instagram.com/patontas.accesorios/'
                            }
                            target="_blank"
                            className="group">
                            <AiFillInstagram
                                size={30}
                                className="group-hover:hidden"
                            />
                            <p className="hidden group-hover:inline-flex opacity-40 px-1 text-white bg-gray-700 rounded-lg relative top-0 left-0">
                                Instagram
                            </p>
                        </Link>
                        <Link
                            to={
                                'https://api.whatsapp.com/message/6SDPDVJHVXX7F1?autoload=1&app_absent=0'
                            }
                            target="_blank"
                            className="group">
                            <FaWhatsappSquare
                                size={30}
                                className="group-hover:hidden"
                            />
                            <p className="hidden group-hover:inline-flex opacity-40 px-1 text-white bg-gray-700 rounded-lg relative top-0 left-0">
                                whatsApp
                            </p>
                        </Link>
                    </div>
                    <div className="flex items-center gap-2">
                        <BsFillTelephoneFill size={20} />
                        <p>(+57) 3023879940</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <AiFillMail size={20} />
                        <p>patotasaccesorios@gmail.com</p>
                    </div>
                </div>
            </div>
            <p className="text-white text-center">
                Copyright © 2023 Patontas. Powered by Patontas.
            </p>
        </div>
    );
};

export default Footer;
