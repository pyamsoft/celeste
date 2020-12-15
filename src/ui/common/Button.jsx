import React from "react";

const defaultClassNames =
  "btn border-2 rounded-lg px-3 py-2 bg-green-300 cursor-pointer text-white focus:outline-none";

export function Button(props) {
  const { className, style, onClick, children, disabled } = props;
  return (
    <button
      className={`${className ? className : ""} ${defaultClassNames}`}
      style={style}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
