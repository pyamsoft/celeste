import React from "react";

const defaultClassNames = "text text-base";

export function Text(props) {
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
