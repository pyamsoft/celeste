import React from "react";
import { CancelButton } from "../common/component/Button";

export function WishListSaveRow(props) {
  const { onCancel, className, style } = props;
  return (
    <div className={`block w-full ${className ? className : ""}`} style={style}>
      <div className="flex flex-row flex-nowrap w-full">
        <CancelButton className="ml-auto px-3 py-2" onClick={onCancel}>
          Cancel
        </CancelButton>
      </div>
    </div>
  );
}
