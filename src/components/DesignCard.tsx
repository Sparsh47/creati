"use client";

import { MdEdit, MdDelete, MdContentCopy } from "react-icons/md";
import { FaLock, FaLockOpen, FaRegTrashAlt, FaCheckCircle } from "react-icons/fa";
import { GoKebabHorizontal } from "react-icons/go";
import { IoMdSettings } from "react-icons/io";
import { FiCopy } from "react-icons/fi";
import { DesignCardType } from "@/types/designs";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {copyToClipboard} from "@/lib/utils";

export default function DesignCard({
                                       title,
                                       prompt,
                                       visibility,
                                       id,
                                       images,
                                       createdAt,
                                       onChangeAction,
                                   }: DesignCardType) {
    const { data: session } = useSession();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [newTitle, setNewTitle] = useState(title);
    const [isUpdatingTitle, setIsUpdatingTitle] = useState(false);

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteConfirmInput, setDeleteConfirmInput] = useState("");
    const [isDeletingDesign, setIsDeletingDesign] = useState(false);

    const dropdownRef = useRef<HTMLDivElement>(null);

    const deleteDesign = async () => {
        try {
            setIsDeletingDesign(true);
            const response = await axios.delete(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/designs/delete-design/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${session?.user.accessToken}`,
                    },
                }
            );
            if (response.status) {
                toast.success(response.data.message);
                onChangeAction();
                setShowDeleteConfirm(false);
                setDeleteConfirmInput("");
            } else {
                toast.error("Could not delete design");
            }
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsDeletingDesign(false);
        }
        setDropdownOpen(false);
    };

    const copyPrompt = async () => {
        await copyToClipboard(prompt);
        setDropdownOpen(false);
        toast.success("Prompt copied!");
    };

    const updateDesign = async (data: { title?: string; visibility?: string }) => {
        if (data.title && (data.title.trim() === "" || data.title === title)) {
            setIsEditingTitle(false);
            setNewTitle(title);
            return;
        }

        try {
            setIsUpdatingTitle(true);
            const response = await axios.patch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/designs/update-design-data/${id}`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${session?.user.accessToken}`,
                    },
                }
            );

            if (response.status === 200) {
                if (data.title && data.visibility) {
                    toast.success("Title and visibility updated successfully!");
                } else if (data.title) {
                    toast.success("Title updated successfully!");
                } else if (data.visibility) {
                    toast.success("Visibility updated successfully!");
                }

                setIsEditingTitle(false);
            } else {
                toast.error("Failed to update design");
                if (data.title) {
                    setNewTitle(title);
                }
            }
        } catch (error: any) {
            toast.error("Failed to update design");
            if (data.title) {
                setNewTitle(title);
            }
        } finally {
            setIsUpdatingTitle(false);
            onChangeAction();
        }
    };

    const cancelTitleEdit = () => {
        setIsEditingTitle(false);
        setNewTitle(title);
    };

    const toggleVisibility = () => {
        const newVisibility = visibility === "PUBLIC" ? "PRIVATE" : "PUBLIC";
        updateDesign({ visibility: newVisibility });
    };

    const handleDeleteClick = () => {
        setShowDeleteConfirm(true);
        setDropdownOpen(false);
    };

    const cancelDeleteConfirm = () => {
        setShowDeleteConfirm(false);
        setDeleteConfirmInput("");
    };

    const toggleDropdown = () => {
        setDropdownOpen((prev) => !prev);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="w-[350px] height-[350px] rounded-xl border border-blue-200 shadow-xl shadow-blue-500/30 p-3 flex flex-col gap-3.5"
        >
            <Link href={`/flow/${id}`} className="w-full h-[200px] bg-blue-100 rounded-lg relative">
                {/*@ts-ignore*/}
                <Image src={images[images.length-1].url}
                    alt={prompt}
                    width={800}
                    height={800}
                    className="w-full h-full object-cover rounded-lg"
                />
                <span className="absolute z-50 right-3 top-3 bg-blue-500 text-white border border-blue-500 text-xs font-semibold px-3 py-0.5 rounded-full">
          {visibility}
        </span>
            </Link>

            {isEditingTitle && (
                <div className="fixed inset-0 bg-opacity-10 backdrop-blur-[5px] flex items-center justify-center z-[100]">
                    <div className="bg-white rounded-xl border border-blue-200 shadow-xl shadow-blue-500/30 p-6 w-96 max-w-[90vw]">
                        <h3 className="text-lg font-semibold text-blue-600 mb-4">Change Title</h3>

                        <div className="mb-4">
                            <label htmlFor="titleInput" className="block font-medium text-blue-500 mb-2">
                                New Title
                            </label>
                            <input
                                id="titleInput"
                                type="text"
                                value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                                className="input"
                                placeholder="Enter new title..."
                                autoFocus
                                disabled={isUpdatingTitle}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") updateDesign({ title: newTitle });
                                    if (e.key === "Escape") cancelTitleEdit();
                                }}
                            />
                        </div>

                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    cancelTitleEdit();
                                }}
                                disabled={isUpdatingTitle}
                                className="px-4 py-2 cursor-pointer font-medium text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    updateDesign({ title: newTitle });
                                }}
                                disabled={isUpdatingTitle || newTitle.trim() === ""}
                                className="px-4 py-2 cursor-pointer text-sm font-medium bg-white border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {isUpdatingTitle ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Updating...
                                    </>
                                ) : (
                                    "Save"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showDeleteConfirm && (
                <div className="fixed inset-0 backdrop-blur-[5px] flex items-center justify-center z-[100]">
                    <div className="bg-white rounded-xl border border-blue-200 shadow-xl shadow-blue-500/30 max-w-[800px] min-w-[600px] flex items-center justify-center gap-8">
                        <div className="py-3 pl-6">
                            <h3 className="text-lg font-semibold text-red-600 mb-4">Delete Project</h3>

                            <div className="mb-4">
                                <p className="text-sm text-gray-600 mb-3">
                                    This action <strong>cannot be undone</strong>. This will permanently delete the
                                    project and all its data.
                                </p>
                                <div className="flex flex-col gap-1 text-sm mb-4">
                                    <p className="flex gap-1">
                                        <FaCheckCircle size={12} className="text-blue-500 relative top-1" />
                                        All saved design files and configurations
                                    </p>
                                    <p className="flex gap-1">
                                        <FaCheckCircle size={12} className="text-blue-500 relative top-1" />
                                        Stored images linked to this design
                                    </p>
                                    <p className="flex gap-1">
                                        <FaCheckCircle size={12} className="text-blue-500 relative top-1" />
                                        Edit history and versioning data
                                    </p>
                                    <p className="flex gap-1">
                                        <FaCheckCircle size={12} className="text-blue-500 relative top-1" />
                                        Sharing links and community posts related to this design
                                    </p>
                                </div>
                                <p className="text-sm font-medium text-gray-800 mb-2 flex gap-2">
                                    Please type{" "}
                                    <FiCopy
                                        size={20}
                                        onClick={async (e) => {
                                            e.stopPropagation();
                                            await copyToClipboard(title);
                                            toast.success("Title Copied!");
                                        }}
                                        className="cursor-pointer p-1 hover:bg-gray-50"
                                    />{" "}
                                    <strong>"{title}"</strong> to confirm:
                                </p>
                                <input
                                    type="text"
                                    value={deleteConfirmInput}
                                    onChange={(e) => setDeleteConfirmInput(e.target.value)}
                                    className="w-full input"
                                    placeholder={title}
                                    autoFocus
                                    disabled={isDeletingDesign}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && deleteConfirmInput === title) deleteDesign();
                                        if (e.key === "Escape") cancelDeleteConfirm();
                                    }}
                                />
                            </div>

                            <div className="flex gap-3 justify-start">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        cancelDeleteConfirm();
                                    }}
                                    disabled={isDeletingDesign}
                                    className="px-4 py-2 cursor-pointer font-medium text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deleteDesign();
                                    }}
                                    disabled={deleteConfirmInput !== title || isDeletingDesign}
                                    className="px-4 py-2 cursor-pointer text-sm font-medium text-red-500 border border-red-400 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                                >
                                    <FaRegTrashAlt size={14} />
                                    {isDeletingDesign ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                                            Deleting...
                                        </>
                                    ) : (
                                        "Delete Project"
                                    )}
                                </button>
                            </div>
                        </div>
                        <Image
                            src="/delete-dialog.png"
                            alt="delete dialog box image"
                            width={10000}
                            height={10000}
                            className="w-1/2 h-[400px] object-cover rounded-r-xl"
                        />
                    </div>
                </div>
            )}

            <div className="w-full flex items-center justify-between gap-5 px-1">
                <Link href={`/flow/${id}`} className="w-[70%]">
                    <p className="line-clamp-2 text-sm">{title}</p>
                </Link>
                <div className="w-[30%] flex items-center justify-end gap-2">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsEditingTitle(true);
                        }}
                        className="p-2 rounded-md border border-blue-500 cursor-pointer hover:bg-blue-50 transition-colors"
                    >
                        <MdEdit size={15} className="text-blue-500" />
                    </button>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            toggleVisibility();
                        }}
                        className="p-2 rounded-md border border-blue-500 cursor-pointer hover:bg-blue-50 transition-colors"
                    >
                        {visibility === "PUBLIC" ? (
                            <FaLockOpen size={15} className="text-blue-500" />
                        ) : (
                            <FaLock size={15} className="text-blue-500" />
                        )}
                    </button>

                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleDropdown();
                            }}
                            className="p-2 rounded-md border border-blue-500 cursor-pointer hover:bg-blue-50 transition-colors"
                        >
                            <GoKebabHorizontal size={15} className="text-blue-600 rotate-90" />
                        </button>

                        {dropdownOpen && (
                            <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-blue-200 rounded-xl shadow-lg shadow-blue-500/20 z-[100] p-1">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        copyPrompt();
                                    }}
                                    className="w-full cursor-pointer px-4 py-2 rounded-lg text-left text-sm text-blue-700 hover:bg-blue-50 hover:text-blue-600 transition-colors flex items-center gap-2"
                                >
                                    <MdContentCopy size={14} className="text-blue-500" />
                                    Copy Prompt
                                </button>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteClick();
                                    }}
                                    className="w-full cursor-pointer px-4 py-2 rounded-lg text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                                >
                                    <MdDelete size={14} className="text-red-500" />
                                    Delete Project
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
