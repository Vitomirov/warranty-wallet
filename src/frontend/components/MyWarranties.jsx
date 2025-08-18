import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import useSecureRequest from "../hooks/useSecureRequest";

const MyWarranties = () => {
  const { user, logout } = useAuth();
  const { secureRequest } = useSecureRequest();

  const [warranties, setWarranties] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const isFetchingRef = useRef(false);
  const cancelTokenSource = useRef(null);
  const isMounted = useRef(true);

  const fetchWarranties = async () => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    try {
      cancelTokenSource.current = axios.CancelToken.source();
      const response = await secureRequest("get", "/warranties/all", null, {
        cancelToken: cancelTokenSource.current.token,
      });

      if (isMounted.current) {
        setWarranties(response.data);
      }
    } catch (error) {
      if (!axios.isCancel(error)) {
        let errorMessage = "Failed to fetch warranties.";
        if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (typeof error.response?.data === "string") {
          errorMessage = error.response.data;
        } else if (error.message) {
          errorMessage = error.message;
        }

        if (isMounted.current) {
          setError(errorMessage);
          if (error.response?.status === 401) {
            logout();
          }
        }
      }
    } finally {
      isFetchingRef.current = false;
      if (isMounted.current) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    isMounted.current = true;
    setLoading(true);

    const fetchData = async () => {
      if (cancelTokenSource.current) {
        cancelTokenSource.current.cancel("Operation canceled by the user.");
      }
      await fetchWarranties();
    };

    fetchData();

    return () => {
      isMounted.current = false;
      if (cancelTokenSource.current) {
        cancelTokenSource.current.cancel("Component unmounted.");
      }
    };
  }, []);

  return (
    // The main section centers the content vertically on the screen.
    <section
      id="myWarranties"
      className="d-flex justify-content-center align-items-center flex-grow-1"
    >
      {/* This container defines the central content area, similar to the My Account layout. */}
      <div className="content-layout w-100 help">
        <h1 className="text-center mb-5 montserrat">
          {user.username}'s Warranties
        </h1>
        {error && <div className="alert alert-danger text-center">{error}</div>}

        {/* Main content container with responsive columns for centering. */}
        <div className="d-flex justify-content-center help">
          <div className="col-12 col-md-8 col-lg-6">
            {loading ? (
              <p className="text-center">Loading warranties...</p>
            ) : (
              <div>
                {warranties.length === 0 ? (
                  <div className="d-flex flex-column text-center">
                    <p>No warranties yet. You can add one below.</p>
                  </div>
                ) : (
                  <ol className="list-group list-group-numbered mt-2">
                    {warranties.map((warranty) => (
                      <li
                        key={warranty.warrantyId}
                        className="list-style list-group-item ps-4 mb-2 help border"
                      >
                        <Link
                          to={`/warranties/details/${warranty.warrantyId}`}
                          style={{
                            display: "block",
                            textDecoration: "none",
                            color: "inherit",
                          }}
                        >
                          {warranty.productName}
                        </Link>
                      </li>
                    ))}
                  </ol>
                )}
                <div className="button-container mt-4 text-center d-flex justify-content-between help">
                  <Link to="/newWarranty" className="btn btn-primary border">
                    Add a new warranty
                  </Link>
                  <Link to="/dashboard" className="btn btn-secondary border">
                    Back
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Buttons section, styled to match the My Account layout. */}
      </div>
    </section>
  );
};

export default MyWarranties;
