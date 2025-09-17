import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth/AuthContext";
import DeleteWarranty from "./DeleteWarranty";
import Button from "../../ui/Button";
import useWarranties from "../../hooks/useWarranties";
import useMeasure from "../../hooks/useMeasure";

function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Fetches user warranties and calculates list item height for dynamic scrolling.
  // The 'useWarranties' hook provides data, while 'useMeasure' ensures the list
  // container size adapts automatically to the content.
  const { warranties, loading, error, fetchWarranties } = useWarranties();
  const { ref: listRef, height: rowHeight } = useMeasure(warranties);

  const handleWarrantyClick = (id) => navigate(`/warranties/details/${id}`);
  const handleAddClick = () => navigate("/newWarranty");

  if (loading) {
    return <div className="alert alert-info">Loading warranties...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="container col-12 col-md-10 col-lg-8 my-5">
      <h1 className="text-center mb-3 fw-bold">Hello, {user?.username}!</h1>

      <div className="mb-3">
        <h3 className="fw-lighter">Your Warranties:</h3>
      </div>

      {warranties.length === 0 ? (
        <div className="alert alert-warning">No warranties found.</div>
      ) : (
        <div
          style={{
            maxHeight: rowHeight ? rowHeight * 3 : undefined,
            overflowY: "auto",
            overflowX: "hidden",
          }}
          ref={listRef}
        >
          <ul className="list-group">
            {warranties.map((warranty) => (
              <li
                key={warranty.warrantyId}
                className="border border-dark-item rounded-3 p-3"
              >
                <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center">
                  <div className="mb-2 mb-sm-0">
                    <div className="fw-bold">{warranty.productName}</div>
                    <p className="text-muted">
                      Expires: {warranty.warrantyExpireDate}
                    </p>
                  </div>
                  <div className="d-flex justify-content-between flex-row col-12 col-lg-3 col-md-5 mt-2 mt-sm-0">
                    <Button
                      variant="tertiary"
                      onClick={() => handleWarrantyClick(warranty.warrantyId)}
                    >
                      View
                    </Button>
                    <DeleteWarranty
                      id={warranty.warrantyId}
                      onDeleteSuccess={fetchWarranties}
                    />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="text-center mt-3">
        <Button variant="success" onClick={handleAddClick}>
          + Add New Warranty
        </Button>
      </div>
    </div>
  );
}

export default Dashboard;
