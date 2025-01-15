import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LogOut from './LogOut';



const Hero = () => {

    const { user } = useAuth();

return (
<section className="hero-section min-vh-100">
    <div className="container">
        <div className="row align-items-center">
            {/* Left Content */}
            <div className="col-lg-6 col-md-12 text-center text-md-start pt-5">
                <div className="hero-left mt-5">
                    <h2 className='mb-3 montserrat'>Warranty Wallet</h2>
                    <p className='mb-4 ms-3'>All warranties in one place.</p>
                        <div className="button d-flex justify-content-center justify-content-md-start gap-3 ms-4">
                            {user ? (
                                <>
                                    <LogOut className="btn btn-primary btn-lg"/>
                                    <Link to="/dashboard" className="btn btn-primary btn-lg">Dashboard</Link>
                                </>
                            ) : (
                                <>    
                                <Link to="/login" className="btn btn-lg">Log In</Link>
                                <Link to="/signup" className="btn btn-secondary btn-lg">Sign Up</Link>
                            </>
                            )}

                    </div>
                </div>
            </div>
            {/* Right Content */}
            <div className="col-lg-5 ms-5 col-md-12 d-flex justify-content-center">
                    <img className="img-fluid"
                        style={{ maxWidth: 'auto', height: '75%' }}
                        src="src/frontend/images/LendingPage.png"
                        alt="LendingPage" />
            </div>
        </div>
    </div>
</section>
);
};
export default Hero;
