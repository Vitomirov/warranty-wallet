import { Suspense } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/marketing/Hero";
import AboutSection from "@/components/marketing/AboutSection";
import FeaturesSection from "@/components/marketing/FeaturesSection";
import FAQSection from "@/components/marketing/FAQSection";
import BackToTopButton from "@/components/ui/BackToTopButton";

function SectionFallback() {
  return <div className="py-5 text-center text-muted">Loading...</div>;
}

export default function HomePage() {
  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Matches Vite Layout wrapper: main.content-layout > .container > LandingPage */}
      <main className="flex-grow-1 d-flex content-layout justify-content-center align-items-center pt-5">
        <div className="container">
          <div className="global-container">
            <header>
              <Header />
            </header>

            <main>
              <Hero />
              <Suspense fallback={<SectionFallback />}>
                <section>
                  <AboutSection />
                </section>
              </Suspense>
              <Suspense fallback={<SectionFallback />}>
                <section>
                  <FeaturesSection />
                </section>
              </Suspense>
              <Suspense fallback={<SectionFallback />}>
                <section>
                  <FAQSection />
                </section>
              </Suspense>
            </main>

            <BackToTopButton />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
