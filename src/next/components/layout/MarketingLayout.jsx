import Header from "./Header";
import Footer from "./Footer";

export default function MarketingLayout({ children }) {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <main className="flex-grow-1 d-flex content-layout justify-content-center align-items-center pt-5">
        <div className="container">{children}</div>
      </main>
      <Footer />
    </div>
  );
}
