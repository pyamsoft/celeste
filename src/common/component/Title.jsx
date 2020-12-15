import React from "react";

const defaultClassNames = "title text-2xl";

export function Title(props) {
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
