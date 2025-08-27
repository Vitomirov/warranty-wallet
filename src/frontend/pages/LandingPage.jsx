import Navigation from "../layout/Navigation";
import Hero from "../ui/Hero";
import About from "./About";
import Features from "./Features";
import FAQ from "./FAQ";
import BackToTopButton from "../ui/BackToTopButton";

console.log("Landing page is rendering");

const LandingPage = () => {
  return (
    <div className="global-container">
      <header>
        <Navigation />
      </header>

      <main>
        <Hero className="help" />
        <section className=" help">
          <About />
        </section>
        <section className="help">
          <Features />
        </section>
        <section className="help">
          <FAQ />
        </section>
      </main>

      <BackToTopButton />
    </div>
  );
};

export default LandingPage;
