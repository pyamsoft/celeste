import React from "react";

export function CenteredContainer(props) {
  const { className, style, children } = props;
  return (
    <div
      className={`${className ? className : ""} flex flex-column w-full`}
      style={style}
    >
      <div className="block m-auto">{children}</div>
    </div>
  );
}
