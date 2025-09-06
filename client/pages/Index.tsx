import Navbar from "@/components/lumen/Navbar";
import Hero from "@/components/lumen/Hero";
import Problem from "@/components/lumen/Problem";
import Features from "@/components/lumen/Features";
import Languages from "@/components/lumen/Languages";
import Emergency from "@/components/lumen/Emergency";
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
        <Emergency />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
