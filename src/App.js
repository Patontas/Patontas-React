import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import ProtectedRoutes from './components/ProtectedRoutes';
import ShowNavbar from './components/ShowNavbar';
import Cart from './pages/Cart';
import DashBoard from './pages/DashBoard';
import Home from './pages/Home';
import OrderDetails from './pages/OrderDetails';
import OrderHistory from './pages/OrderHistory';
import PlaceOrder from './pages/PlaceOrder';
import Product from './pages/Product';
import Products from './pages/Products';
import ShippingAddress from './pages/ShippingAddress';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import UserProfile from './pages/UserProfile';

function App() {
    return (
        <BrowserRouter>
            <section className="bg-[#FFE2D7] min-w-fit max-w-full min-h-screen flex flex-col justify-between">
                <div className="flex flex-col gap-12 w-full">
                    <ShowNavbar>
                        <Navbar />
                    </ShowNavbar>
                    <main className="pb-48">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route
                                path="/product/slug/:slug"
                                element={<Product />}
                            />
                            <Route path="/products" element={<Products />} />
                            <Route path="/cart" element={<Cart />} />
                            <Route path="/signin" element={<Signin />} />
                            <Route path="/signup" element={<Signup />} />
                            <Route
                                path="/shippingAddress"
                                element={<ShippingAddress />}
                            />
                            <Route
                                path="/place-order"
                                element={<PlaceOrder />}
                            />
                            <Route
                                path="/order/:id"
                                element={<OrderDetails />}
                            />
                            <Route
                                path="/orders-history"
                                element={<OrderHistory />}
                            />
                            <Route path="/profile" element={<UserProfile />} />
                            <Route
                                path="/dashboard"
                                element={
                                    <ProtectedRoutes>
                                        <DashBoard />
                                    </ProtectedRoutes>
                                }
                            />
                        </Routes>
                    </main>
                </div>
                <ShowNavbar>
                    <Footer />
                </ShowNavbar>
            </section>
        </BrowserRouter>
    );
}

export default App;
