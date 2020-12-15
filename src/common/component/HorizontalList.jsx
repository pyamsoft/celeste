import React from "react";

const defaultClassNames =
  "horizontal-list flex flex-row flex-nowrap overflow-x-auto overflow-y-hidden";

export function HorizontalList(props) {
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
