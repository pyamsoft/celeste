import React from "react";
import { Title } from "../common/Title";

export function WishListTitle(props) {
  const { className, style, name } = props;
  return (
    <Title className={`${className ? className : ""} font-bold`} style={style}>
      {name}
    </Title>
  );
}
