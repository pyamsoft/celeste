import React from "react";
import { CancelButton, SuccessButton } from "../common/component/Button";

export function WishListSaveRow(props) {
  const { onCancel, onSave, className, style } = props;
  return (
    <div className={`block w-full ${className ? className : ""}`} style={style}>
      <div className="flex flex-row flex-nowrap w-full">
        <CancelButton className="ml-auto" onClick={onCancel}>
          Cancel
        </CancelButton>
        <SuccessButton className="ml-3" onClick={onSave}>
          Create
        </SuccessButton>
      </div>
    </div>
  );
}
