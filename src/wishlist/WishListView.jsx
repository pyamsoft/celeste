import React from "react";
import { WishListTitle } from "./WishListTitle";
import { WishListTabs } from "./WishListTabs";
import { WishListEntries } from "./WishListEntries";

const defaultClassNames = "wish-list block overflow-hidden w-full flex-auto";

export function WishListView(props) {
  const { className, style, ...rest } = props;
  const {
    acnh,
    name,
    items,
    category,
    onCategoryChanged,
    onItemAdded,
    onItemRemoved,
    isEditable,
  } = rest;
  return (
    <div
      className={`${defaultClassNames} ${className ? className : ""}`}
      style={style}
    >
      <div className="h-full w-full overflow-hidden flex flex-col">
        <WishListTitle name={name} className="mb-3" />
        <WishListTabs category={category} onTabClicked={onCategoryChanged} />
        <WishListEntries
          className="flex-auto"
          acnh={acnh}
          items={items}
          category={category}
          onItemAdded={onItemAdded}
          onItemRemoved={onItemRemoved}
          isEditable={isEditable}
        />
      </div>
    </div>
  );
}
