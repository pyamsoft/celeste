import React from "react";

export function CenteredContainer(props) {
  const { id, onClick, className, style, children } = props;
  return (
    <div
      id={id}
      onClick={onClick}
      className={`${className ? className : ""} flex flex-col w-full`}
      style={style}
    >
      <div className="block m-auto">{children}</div>
    </div>
  );
}
