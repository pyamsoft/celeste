import React from "react";

const defaultClassNames = "list-item block w-full";

export function ListItem(props) {
  const { className, style, children } = props;
  return (
    <li
      className={`${className ? className : ""} ${defaultClassNames}`}
      style={style}
    >
      {children}
    </li>
  );
}
