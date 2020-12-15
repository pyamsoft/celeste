import React from "react";

const defaultClassNames = "list block overflow-auto";

export function List(props) {
  const { className, style, children } = props;
  return (
    <ul
      className={`${className ? className : ""} ${defaultClassNames}`}
      style={style}
    >
      {children}
    </ul>
  );
}
