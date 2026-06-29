import AppHeader from "./AppHeader";
import Footer from "./Footer";

export default function AppLayout({ children }) {
  return (
    <div className="d-flex flex-column min-vh-100 app-theme">
      <AppHeader />
      <main className="flex-grow-1 d-flex content-layout justify-content-center align-items-center pt-5">
        <div className="container">{children}</div>
      </main>
      <Footer />
    </div>
  );
}
