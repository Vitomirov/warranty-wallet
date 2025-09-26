import Header from "./Header";
import Footer from "./Footer";
import MetaTags from "./MetaTags";

const Layout = ({ children, isApp = false }) => {
  return (
    <div
      className={`d-flex flex-column min-vh-100 ${
        isApp ? "app-theme" : "marketing-theme"
      }`}
    >
      <MetaTags />
      <Header />
      <main className="flex-grow-1 d-flex content-layout justify-content-center align-items-center pt-5">
        <div className="container">{children}</div>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
