"use client";

import { MdEdit } from "react-icons/md";
import { FaLock } from "react-icons/fa";
import { FaLockOpen } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import {DesignCardType} from "@/types/designs";
import {toast} from "react-hot-toast";
import axios from "axios";
import {useSession} from "next-auth/react";
import {useMemo} from "react";
import Image from "next/image";

export default function DesignCard({prompt, visibility, id, images, createdAt}: DesignCardType) {

    const {data: session} = useSession();

    const deleteDesign = async (designId: string) => {
        try {
            const response = await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/designs/delete-design/${designId}`, {
                headers: {
                    Authorization: `Bearer ${session?.user.accessToken}`
                }
            });
            if(response.status) {
                toast.success(response.data.message);
            } else {
                toast.error("Could not delete design");
            }
        } catch(error: any) {
            toast.error(error.message);
        }
    }

    return (
        <div className="w-[400px] height-[350px] rounded-xl border-2 border-blue-200 shadow-xl shadow-blue-500/30 p-3 flex flex-col gap-3.5">
            <div className="w-full h-[200px] bg-blue-100 rounded-lg relative">
                <Image src={images[0].url} alt={prompt} width={800} height={800} className="w-full h-full object-cover" />
                <span className="absolute z-50 right-3 top-3 bg-blue-500 text-white border border-blue-500 text-xs font-semibold px-3 py-0.5 rounded-full">{visibility}</span>
            </div>
            <div className="w-full flex items-center justify-between gap-5 px-1">
                <div className="w-[60%]">
                    <p className="line-clamp-2 text-sm">{prompt}</p>
                </div>
                <div className="w-[30%] flex items-center justify-end gap-2">
                    <button onClick={()=>console.log("Edit")} className="p-2 rounded-md border border-blue-500 cursor-pointer">
                        <MdEdit size={15} className="text-blue-500" />
                    </button>
                    <button onClick={()=>console.log("Change Visibility")} className="p-2 rounded-md border border-blue-500 cursor-pointer">
                        {visibility === "PUBLIC" ? <FaLockOpen size={15} className="text-blue-500" /> : <FaLock size={15} className="text-blue-500"/>}
                    </button>
                    <button onClick={()=>deleteDesign(id)} className="p-2 rounded-md border border-red-500 cursor-pointer">
                        <MdDelete size={15} className="text-red-500" />
                    </button>
                </div>
            </div>
        </div>
    )
}