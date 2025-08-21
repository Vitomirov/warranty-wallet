import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LogOut from "./LogOut";

function Dashboard() {
  const { user } = useAuth();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!(user || localStorage.getItem("token")));
  }, [user]);

  return (
    <div className="dashboard d-flex flex-column flex-grow-1">
      {/* Reduced padding on mobile (p-sm-3) and added custom class for height management */}
      <main className="flex-grow-1 container-fluid p-5 d-flex flex-column justify-content-center dashboard-main-content p-sm-3">
        <div className="row">
          <div className="text-center mb-5 pb-5 mb-sm-3 pb-sm-3">
            {/* Reduced bottom margin/padding on mobile */}
            {/* Made h2 font smaller on mobile with fs-sm-6 */}
            <h2 className="text-white fw-lighter fs-sm-6 pb-3">
              All your warranties in one place. Add and manage with ease.
            </h2>
          </div>
        </div>

        {/* Adjusted column classes and reduced gap on mobile */}
        <div className="row justify-content-center dashboardbutton g-3 g-md-4 mt-2 mt-sm-0">
          {/* Reduced top margin on mobile */}
          <div className="col-12 col-md-6 col-lg-5">
            <Link
              to="/myWarranties"
              className="btn btn-lg border w-100 shadow dashboard-btn-size"
            >
              {/* Added dashboard-btn-size */}
              &gt;&gt;&gt;My Warranties &lt;&lt;&lt;
            </Link>
          </div>
          <div className="col-12 col-md-6 col-lg-5 mb-1">
            <Link
              to="/newWarranty"
              className="btn btn-lg border w-100 shadow dashboard-btn-size"
            >
              {/* Added dashboard-btn-size */}
              &gt;&gt;&gt;New Warranty&lt;&lt;&lt;
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
