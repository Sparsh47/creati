import React from 'react';

const Spinner = () => {
    return (
        <div className="flex items-center justify-center">
            <div className="w-6 h-6 border-4 border-blue-100 border-t-blue-400 rounded-full animate-spin" />
        </div>
    );
};

export default Spinner;
