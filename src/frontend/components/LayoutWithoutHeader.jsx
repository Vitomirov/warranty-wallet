import Footer from "./Footer";

const LayoutWithoutHeader = ({ children }) => {
  return (
    <div className=" vh-100 d-flex justify-content-center flex-column">
      <main className="d-flex flex-grow-1 justify-content-center">
        {children}
      </main>
      {/* Reuse Footer Component */}
      <Footer />
    </div>
  );
};

export default LayoutWithoutHeader;
