import React, { useState } from 'react';
import { FaChevronCircleLeft, FaChevronCircleRight } from 'react-icons/fa';

const Slide = () => {
    const slides = [
        { url: '/slide/1.png' },
        { url: '/p_logo.png' },
        { url: '/p_logo_2.png' },
    ];
    const [slide, setSlide] = useState(0);

    return (
        <div className="contaier mx-auto flex items-center justify-center">
            <FaChevronCircleLeft
                size={40}
                onClick={() => {
                    if (slide > 0) {
                        setSlide(slide - 1);
                    } else {
                        setSlide(slides.length - 1);
                    }
                }}
                className="relative left-4 cursor-pointer bg-black/20 rounded-full"
            />
            <div>
                <img src={slides[slide].url} alt="1" className="container" />
            </div>
            <FaChevronCircleRight
                size={40}
                onClick={() => {
                    if (slide < slides.length - 1) {
                        setSlide(slide + 1);
                    } else {
                        setSlide(0);
                    }
                }}
                className="relative right-4 cursor-pointer"
            />
        </div>
    );
};

export default Slide;
