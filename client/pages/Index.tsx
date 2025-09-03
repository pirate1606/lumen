import Navbar from "@/components/lumen/Navbar";
import Hero from "@/components/lumen/Hero";
import Problem from "@/components/lumen/Problem";
import Features from "@/components/lumen/Features";
import Languages from "@/components/lumen/Languages";
import Demo from "@/components/lumen/Demo";
import Emergency from "@/components/lumen/Emergency";
import About from "@/components/lumen/About";
import Contact from "@/components/lumen/Contact";
import Footer from "@/components/lumen/Footer";
import SectionDivider from "@/components/lumen/SectionDivider";

export default function Index() {
  return (
    <div className="relative">
      <Navbar />
      <main>
        <Hero />
        <SectionDivider />
        <Problem />
        <SectionDivider flip />
        <Features />
        <Languages />
        <Demo />
        <Emergency />
        <About />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
