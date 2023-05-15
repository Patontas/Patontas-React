import React from 'react';
import { Helmet } from 'react-helmet-async';
import FeatureProducts from '../components/FeatureProducts';
import Slide from '../components/Slide';

const Home = () => {
    return (
        <div>
            <Helmet>
                <title>Home</title>
            </Helmet>
            <Slide />
            <FeatureProducts />
        </div>
    );
};

export default Home;
