import React, { useEffect, useState } from 'react';

const BackToTopButton = () => {
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => {
        if (window.pageYOffset > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility);
        return () => {
            window.removeEventListener('scroll', toggleVisibility);
        };
    }, []);

    return (
        <button
            type="button"
            className={`btn btn-primary ${isVisible ? 'd-block' : 'd-none'}`}
            onClick={scrollToTop}
            style={{
                position: 'fixed',
                bottom: '55px',
                right: '20px',
                zIndex: 1000,
                border: 'none',
                background: 'transparent', 
                cursor: 'pointer'
            }}
        >
            <i className="bi bi-arrow-up back-to-top" ></i>
        </button>
    );
};

export default BackToTopButton;