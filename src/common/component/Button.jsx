import React from "react";

const defaultClassNames = "btn border-2 rounded-lg px-3 py-2 cursor-pointer focus:outline-none";

export function Button(props) {
  const { id, className, style, onClick, children, disabled } = props;
  return (
    <button
      id={id}
      className={`${className ? className : ""} ${defaultClassNames}`}
      style={style}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
