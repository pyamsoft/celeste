import React from "react";
import { Button } from "../common/Button";

export function WishListSaveRow(props) {
  const { onCancel, onSave, isCreating, className, style } = props;
  return (
    <div className={`block w-full ${className ? className : ""}`} style={style}>
      <div className="flex flex-row flex-nowrap w-full">
        <Button className="ml-auto" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          className="ml-3 bg-green-300 text-white border-green-400"
          onClick={onSave}
        >
          {isCreating ? "Create" : "Save"}
        </Button>
      </div>
    </div>
  );
}
