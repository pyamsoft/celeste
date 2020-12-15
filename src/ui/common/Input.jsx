import React from "react";

export function Input(props) {
  const { className, style, onChange, value, disabled } = props;
  return (
    <input
      className={`${className ? className : ""} input ${
        disabled ? "disabled" : ""
      }`}
      style={style}
      disabled={disabled}
      onChange={onChange}
      value={value}
    />
  );
}
