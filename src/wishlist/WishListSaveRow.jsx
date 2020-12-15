import React from "react";
import {
  Button,
  CancelButton,
  SuccessButton,
} from "../common/component/Button";

export function WishListSaveRow(props) {
  const { onCancel, onSave, isCreating, className, style } = props;
  return (
    <div className={`block w-full ${className ? className : ""}`} style={style}>
      <div className="flex flex-row flex-nowrap w-full">
        <CancelButton className="ml-auto" onClick={onCancel}>
          Cancel
        </CancelButton>
        <SuccessButton className="ml-3" onClick={onSave}>
          {isCreating ? "Create" : "Save"}
        </SuccessButton>
      </div>
    </div>
  );
}
