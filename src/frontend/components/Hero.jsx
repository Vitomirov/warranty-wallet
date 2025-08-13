import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LogOut from "./LogOut";

const Hero = () => {
  const { user } = useAuth();

  return (
    <section className="min-vh-100 help d-flex align-items-center justify-content-center text-center">
      {/* Use a Bootstrap container for content alignment */}
      <div className=" help conent-layout">
        <div className="row align-items-center">
          {/* Left Content */}
          <div className="col-lg-7 col-md-6 col-sm-8 text-start help">
            <div>
              <h1 className="mb-3 display-4 d-flex justify-content-center text-md-center">
                Warranty Wallet
              </h1>
              <h2 className="mb-4 ms-1 d-flex justify-content-center text-md-center fs-5">
                All warranties in one place.
              </h2>
              <div className="button d-flex justify-content-center gap-3 ms-3">
                {user ? (
                  <>
                    <LogOut className="btn btn-primary btn-lg" />
                    <Link to="/dashboard" className="btn btn-primary btn-lg">
                      Dashboard
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="btn btn-lg">
                      Log In
                    </Link>
                    <Link to="/signup" className="btn btn-secondary btn-lg">
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
          {/* Right Content */}
          <div className="col-lg-5 col-md-6 col-sm-4  help">
            <img
              className="img-fluid"
              style={{ maxWidth: "80%", height: "auto" }}
              src="/LendingPage.png"
              alt="LendingPage"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
export default Hero;
