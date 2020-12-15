import React from "react";

const defaultClassNames = "title text-2xl";

export function Title(props) {
  const { className, style, children } = props;
  return (
    <div
      className={`${className ? className : ""} ${defaultClassNames}`}
      style={style}
    >
      {children}
    </div>
  );
}
