'use client';

import { useState } from 'react';
import { useApiKey } from '@/context/ApiKeyContext';
import { LuSettings, LuX } from 'react-icons/lu';

export default function ApiKeyInput() {
    const { apiKey, setApiKey } = useApiKey();
    const [draft, setDraft] = useState(apiKey);
    const [isOpen, setIsOpen] = useState(false);

    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);
    const save = () => {
        setApiKey(draft.trim());
        closeModal();
    };

    return (
        <div className="absolute right-10">
            <button
                onClick={openModal}
                className="p-3 shadow-xl hover:shadow-lg shadow-blue-500/30 ease-in-out transition-all duration-200 cursor-pointer rounded-full bg-blue-500 text-white hover:bg-blue-600 flex items-center"
            >
                <LuSettings size={24} />
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-96 relative">
                        <button
                            onClick={closeModal}
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                        >
                            <LuX size={20} />
                        </button>

                        <h2 className="text-lg font-semibold mb-4">Enter Gemini API Key</h2>

                        <input
                            type="password"
                            value={draft}
                            onChange={e => setDraft(e.target.value)}
                            className="w-full border px-3 py-2 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="sk-..."
                        />

                        <div className="flex justify-end">
                            <button
                                onClick={save}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
