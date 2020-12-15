import React from "react";
import { Dialog } from "../common/component/Dialog";
import { WishList } from "./WishList";

export function WishListEditorDialog(props) {
  const { onClose } = props;
  return (
    <Dialog onClose={onClose} className="w-full h-full">
      <WishList {...props} />
    </Dialog>
  );
}
