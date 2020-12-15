import React from "react";

const defaultClassNames = "vertical-list block overflow-y-auto overflow-x-hidden";

export function VerticalList(props) {
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
