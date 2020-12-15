import React from "react";
export function Button(props) {
  const { className, style, onClick, children, disabled } = props;
  return (
    <button
      className={`${className ? className : ""} btn ${
        disabled ? "disabled" : ""
      }`}
      style={style}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
