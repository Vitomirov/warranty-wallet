import { lazy, Suspense } from "react";
import Header from "../layout/Header";
import Hero from "./Hero";
import BackToTopButton from "../ui/BackToTopButton";

// Dinamički uvoz ostalih komponenti
const About = lazy(() => import("./About"));
const Features = lazy(() => import("./Features"));
const FAQ = lazy(() => import("./FAQ"));

console.log("Landing page is rendering");

const LandingPage = () => {
  return (
    <div className="global-container">
      <header>
        <Header />
      </header>

      <main>
        <Hero />
        <Suspense fallback={<div>Loading About...</div>}>
          <section>
            <About />
          </section>
        </Suspense>
        <Suspense fallback={<div>Loading Features...</div>}>
          <section>
            <Features />
          </section>
        </Suspense>
        <Suspense fallback={<div>Loading FAQ...</div>}>
          <section>
            <FAQ />
          </section>
        </Suspense>
      </main>

      <BackToTopButton />
    </div>
  );
};

export default LandingPage;
