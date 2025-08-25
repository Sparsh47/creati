"use client";

import React from "react";
import Image from "next/image";
import {GoPlus} from "react-icons/go";
import {toast} from "react-hot-toast";
import axios from "axios";
import {useSession} from "next-auth/react";
import {RiLink} from "react-icons/ri";
import Link from "next/link";

type CardProps = {
    id: string; image: string; title: string; description: string; height?: string;
};

export default function CommunityDesignCard({
                                                id, image, title, description, height = "h-[280px]",
                                            }: CardProps) {

    const {data: session} = useSession();

    const addDesign = async () => {
        try {
            const response = await axios.patch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/designs/add-design-to-user`,
                { designId: id },
                {
                    headers: {
                        Authorization: `Bearer ${session?.user.accessToken}`,
                    },
                }
            );

            const { status, message, error } = response.data;

            if (status) {
                toast.dismiss();
                toast.success(message || "Design successfully added!");
            } else {
                toast.dismiss();
                toast.error(message || error || "Failed to add design");
            }
        } catch (e: any) {
            if (e.response) {
                const { status, data } = e.response;

                switch (status) {
                    case 409:
                        toast.error(data.message || "You already own this design");
                        break;
                    case 404:
                        toast.error(data.message || "Design or user not found");
                        break;
                    case 429:
                        toast.error(
                            data.error ||
                            "Upgrade your subscription to add more designs."
                        );
                        break;
                    default:
                        toast.error(data.message || "Something went wrong");
                }
            } else {
                console.error(e);
                toast.error("Network error while adding design");
            }
        }
    };

    return (<div
            className={`relative p-2 w-full bg-white rounded-xl shadow-lg shadow-blue-500/15 border border-blue-200 flex flex-col gap-2 overflow-hidden ${height}`}>
            <div className="absolute top-4 right-4 flex items-center justify-center gap-5">
                <button
                    className="p-2 bg-blue-500 cursor-pointer text-white rounded-full flex items-center justify-center shadow-md hover:bg-blue-600 transition-colors"
                    aria-label="Add"
                    type="button"
                    onClick={addDesign}
                >
                    <GoPlus size={24} className="text-white"/>
                </button>
                <Link
                    href={`/community/${id}`}
                    className="p-2 bg-blue-500 cursor-pointer text-white rounded-full flex items-center justify-center shadow-md hover:bg-blue-600 transition-colors"
                    aria-label="Add"
                >
                    <RiLink size={24} className="text-white"/>
                </Link>
            </div>
            <Image
                width={10000}
                height={10000}
                src={image}
                alt={title}
                className="w-full rounded-lg aspect-video object-cover bg-blue-100"
            />
            <div className="flex flex-col">
                <h3 className="font-semibold text-blue-600 text-xl">{title}</h3>
                <p className="text-gray-800 line-clamp-1 text-sm">
                    {description}
                </p>
            </div>
        </div>)
}