import { useAuth } from "../../context/auth/AuthContext";
import { Link } from "react-router-dom";
import Button from "../../ui/Button";

const LogOut = ({ className, asLink, linkTo }) => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  if (asLink) {
    // Render as a link if asLink=true - for Dashboard
    return (
      <Link to={linkTo || "/"} onClick={handleLogout} className={className}>
        Log Out
      </Link>
    );
  }

  // Render as a button by default
  return (
    <Button variant="logout" onClick={handleLogout}>
      Log Out
    </Button>
  );
};

export default LogOut;
