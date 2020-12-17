import React from "react";

const defaultClassNames = "title text-9xl";

export function GiantHeader(props) {
  const { id, onClick, className, style, children } = props;
  return (
    <div
      id={id}
      onClick={onClick}
      className={`${className ? className : ""} ${defaultClassNames}`}
      style={style}
    >
      {children}
    </div>
  );
}
