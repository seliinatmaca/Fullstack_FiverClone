import React from "react";

const Input = ({
  label,
  name,
  placeholder,
  type = "text",
  isReq = false,
  disabled = false,
  isMulti = false,
}) => {
  return (
    <div className="mb-5">
      <label className="block mb-2 text-sm font-medium text-gray-900">
        {label}
      </label>
      <input
        name={name}
        type={type}
        className="bg-gray-50 border border-gray-300  text-sm rounded-lg focus:ring-blue-500  block w-full p-2.5  placeholder-gray-400 text-dark disabled:bg-gray-200  focus:border-blue-500"
        placeholder={placeholder}
        required={isReq}
        disabled={disabled}
        multiple={isMulti}
      />
    </div>
  );
};

export default Input;
