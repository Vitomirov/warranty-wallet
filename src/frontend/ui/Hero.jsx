import { Link } from "react-router-dom";
import { useAuth } from "../context/auth/AuthContext";
import Button from "./Button";

const Hero = () => {
  const { user } = useAuth();

  return (
    <section className="min-vh-100 d-flex align-items-center justify-content-center text-center">
      <div className="help w-100 content-layout">
        <div className="row d-flex justify-content-center">
          <div className="col-12">
            <h1 className="mb-3 display-4">Warranty Wallet</h1>
            <h2 className="mb-4 fs-5">All warranties in one place.</h2>
            <div className="button d-flex justify-content-center gap-3">
              <>
                <Link to="/login">
                  <Button variant="primary">Log In</Button>
                </Link>
                <Link to="/signup">
                  <Button variant="secondary">Sign Up</Button>
                </Link>
              </>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
