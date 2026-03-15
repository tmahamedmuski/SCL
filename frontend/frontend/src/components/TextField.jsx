import React from 'react';

const TextField = ({ label, value, onChange }) => {
    return (
    <div className="mb-4">
        <label className="block text-gray-700">{label}</label>
        <input
        type="text"
        value={value}
        onChange={onChange}
        className="border rounded w-full p-2 mt-1"
        />
    </div>
    );
};

export default TextField;
