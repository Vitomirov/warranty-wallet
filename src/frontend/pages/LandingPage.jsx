import Header from "../layout/Header";
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
        <Header />
      </header>

      <main>
        <Hero />
        <section>
          <About />
        </section>
        <section>
          <Features />
        </section>
        <section>
          <FAQ />
        </section>
      </main>

      <BackToTopButton />
    </div>
  );
};

export default LandingPage;
