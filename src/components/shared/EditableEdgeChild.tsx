import React, { useState, useRef, useEffect } from 'react';

interface EditableLabelProps {
    id: string;
    data: { label?: string };
    onChange?: (id: string, newLabel: string) => void;
    className?: string;
}

const EditableLabel: React.FC<EditableLabelProps> = ({ id, data, onChange, className }) => {
    const [editing, setEditing] = useState(false);
    const [value, setValue] = useState(data.label || '');
    const inputRef = useRef<HTMLInputElement>(null);

    // Keep local state in sync if data.label changes externally
    useEffect(() => {
        setValue(data.label || '');
    }, [data.label]);

    // Focus the input when entering edit mode
    useEffect(() => {
        if (editing && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [editing]);

    const handleDisplayClick = () => {
        setEditing(true);
    };

    const finishEditing = () => {
        setEditing(false);
        const trimmed = value.trim();
        if (trimmed !== data.label) {
            onChange?.(id, trimmed);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            finishEditing();
        } else if (e.key === 'Escape') {
            setValue(data.label || '');
            setEditing(false);
        }
    };

    return editing ? (
        <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={e => setValue(e.target.value)}
            onBlur={finishEditing}
            onKeyDown={handleKeyDown}
            className={`border border-gray-300 rounded px-1 py-0.5 text-sm ${className || ''}`}
        />
    ) : (
        <span
            onClick={handleDisplayClick}
            className={`cursor-pointer px-1 py-0.5 text-sm ${className || ''}`}
        >
      {data.label || '…'}
    </span>
    );
};

export default EditableLabel;
