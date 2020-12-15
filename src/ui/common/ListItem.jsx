import React from "react";

const defaultClassNames = "list-item block w-full";

export function ListItem(props) {
  const { id, className, style, children, onClick } = props;
  return (
    <li
      id={id}
      className={`${className ? className : ""} ${defaultClassNames}`}
      style={style}
      onClick={onClick}
    >
      {children}
    </li>
  );
}
