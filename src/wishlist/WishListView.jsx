import React from "react";
import { WishListTitle } from "./WishListTitle";
import { WishListTabs } from "./WishListTabs";
import { WishListItems } from "./WishListItems";

const defaultClassNames =
  "wish-list flex flex-col overflow-hidden w-full overflow-hidden";

export function WishListView(props) {
  const { className, style, ...rest } = props;
  const {
    acnh,
    name,
    items,
    category,
    onCategoryChanged,
    onItemSelected,
  } = rest;
  return (
    <div
      className={`${defaultClassNames} ${className ? className : ""}`}
      style={style}
    >
      <WishListTitle name={name} className="mb-3" />
      <WishListTabs category={category} onTabClicked={onCategoryChanged} />
      <WishListItems
        acnh={acnh}
        items={items}
        category={category}
        onItemClicked={onItemSelected}
      />
    </div>
  );
}
