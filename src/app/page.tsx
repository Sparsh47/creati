import Navbar from "@/components/shared/Navbar";
import Hero from "@/components/sections/home/Hero";
import Features from "@/components/sections/home/Features";
import Testimonials from "@/components/sections/home/Testimonials";
import CTA from "@/components/sections/home/CTA";
import Steps from "@/components/sections/home/Steps";
import Pricing from "@/components/sections/home/Pricing";
import FAQ from "@/components/sections/home/FAQ";
import Footer from "@/components/shared/Footer";

export default function Home() {

    return (
        <>
            <Navbar />
            <Hero />
            <Features />
            <Steps />
            <Testimonials />
            <Pricing />
            <FAQ />
            <CTA />
            <Footer />
        </>
    );
}
