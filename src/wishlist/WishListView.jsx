import React from "react";
import { WishListTitle } from "./WishListTitle";
import { WishListTabs } from "./WishListTabs";
import { WishListEntries } from "./WishListEntries";
import { WishListSearch } from "./WishListSearch";

const defaultClassNames =
  "wish-list block overflow-hidden w-full flex-auto relative";

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
    onNoteChanged,
    onNameChanged,
    isEditable,
    search,
    onSearchChanged,
  } = rest;
  return (
    <div
      className={`${defaultClassNames} ${className ? className : ""}`}
      style={style}
    >
      <div className="absolute inset-0 overflow-hidden flex flex-col">
        <WishListTitle
          isEditable={isEditable}
          name={name}
          className="mb-3"
          onNameChanged={onNameChanged}
        />
        <WishListTabs category={category} onTabClicked={onCategoryChanged} />
        <WishListSearch onChange={onSearchChanged} />
        <WishListEntries
          className="flex-auto"
          acnh={acnh}
          search={search}
          items={items}
          category={category}
          onItemAdded={onItemAdded}
          onItemRemoved={onItemRemoved}
          onNoteChanged={onNoteChanged}
          isEditable={isEditable}
        />
      </div>
    </div>
  );
}
