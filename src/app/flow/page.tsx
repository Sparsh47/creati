"use client";

import {useDesignResponse} from "@/context/DesignResponseContext";
import {Progress} from "@/components/ui/progress";
import React from "react";
import Sidebar from "@/components/sections/FlowPage/Sidebar";
import GenerateSection from "@/components/sections/FlowPage/GenerateSection";

export default function FlowPage() {
    const {loading, loaderValue} = useDesignResponse();

    return (

        <>
            {loading ? (
                <div className="w-full h-screen flex items-center justify-center">
                    <Progress value={loaderValue} className="w-full max-w-3xl" />
                </div>
            ) : (
                <div className="w-full flex">
                    <Sidebar />
                    <GenerateSection />
                </div>
            )}
        </>
    );
}