import React from "react";

const defaultClassNames = "text text-base";

export function Text(props) {
  const { id, onClick, className, style, children } = props;
  return (
    <div
      id={id}
      className={`${className ? className : ""} ${defaultClassNames}`}
      style={style}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
