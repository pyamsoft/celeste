import React from "react";

const defaultClassNames = "list block overflow-auto";

export function List(props) {
  const { id, onClick, className, style, children } = props;
  return (
    <ul
      id={id}
      onClick={onClick}
      className={`${className ? className : ""} ${defaultClassNames}`}
      style={style}
    >
      {children}
    </ul>
  );
}
