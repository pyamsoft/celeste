import React from "react";
import { WishListTitle } from "./WishListTitle";

const defaultClassNames = "wish-list block overflow-hidden w-full h-full";

export function WishListView(props) {
  const { className, style, ...rest } = props;
  return (
    <div
      className={`${defaultClassNames} ${className ? className : ""}`}
      style={style}
    >
      <WishListTitle {...rest} className="mb-3" />
    </div>
  );
}
