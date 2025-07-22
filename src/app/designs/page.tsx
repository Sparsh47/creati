"use client";

import Image from "next/image";
import {useCharts} from "@/context/ChartContexts";
import {Trash2} from "lucide-react";
import React from "react";
import Link from "next/link";

export default function DesignsPage() {

    const {charts, deleteCharts} = useCharts();

    return (
        <div className="w-full h-screen flex items-center justify-center">
            <button
                onClick={deleteCharts}
                className="absolute z-50 top-32 right-10 p-3 shadow-xl hover:shadow-lg shadow-blue-500/30 ease-in-out transition-all duration-200 cursor-pointer rounded-full bg-blue-500 text-white hover:bg-blue-600 flex items-center"
            >
                <Trash2 size={24} />
            </button>
            {
                charts.length > 0 ? <div className="w-full grid grid-cols-4">
                        {charts.map((chart, index) => (
                            <Image src={chart} alt={`flow-design-${index}`} width={1000} height={1000} className="w-[300px] h-auto shadow-lg rounded-lg border border-black/10" />
                        ))}
                    </div>
                    :
                    <div className="w-full flex flex-col items-center justify-center gap-5">
                        <h1 className="text-4xl font-space-grotesk">
                            No designs found
                        </h1>
                        <Link href="/" className="cta-btn">Create Design</Link>
                    </div>
            }
        </div>
    )
}