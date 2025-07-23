import React from "react";
import Hero from "@/components/sections/hero/Hero";
import Footer from "@/components/shared/Footer";
import Features from "@/components/sections/hero/Features";
import Steps from "@/components/sections/hero/Steps";
import Testimonials from "@/components/sections/hero/Testimonials";
import Pricing from "@/components/sections/hero/Pricing";
import FAQ from "@/components/sections/hero/FAQ";
import CTA from "@/components/sections/hero/CTA";

export default function Home() {

    return (
        <>
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
