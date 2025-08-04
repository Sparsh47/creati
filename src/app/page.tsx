"use client";

import React from "react";
import Hero from "@/components/sections/hero/Hero";
import Footer from "@/components/shared/Footer";
import Features from "@/components/sections/hero/Features";
import Steps from "@/components/sections/hero/Steps";
import Testimonials from "@/components/sections/hero/Testimonials";
import Pricing from "@/components/sections/hero/Pricing";
import FAQ from "@/components/sections/hero/FAQ";
import CTA from "@/components/sections/hero/CTA";
import {useDesignResponse} from "@/context/DesignResponseContext";
import {Progress} from "@/components/ui/progress";
import Navbar from "@/components/shared/Navbar";

export default function Home() {

    const {loading, loaderValue} = useDesignResponse();

    return (

        <>
            {loading ? (
                <div className="w-full h-screen flex items-center justify-center">
                    <Progress value={loaderValue} className="w-full max-w-3xl" />
                </div>
            ) : (
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
            )}
        </>
    );
}
