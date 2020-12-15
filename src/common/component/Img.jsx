import React from "react";

const defaultClassNames = "image";

export function Img(props) {
  const { id, className, style, onClick, preload, src, alt } = props;
  return (
    <img
      id={id}
      className={`${className ? className : ""} ${defaultClassNames} ${
        preload ? "w-0 h-0 opacity-0" : ""
      }`}
      style={style}
      onClick={onClick}
      src={src}
      alt={alt}
    />
  );
}
