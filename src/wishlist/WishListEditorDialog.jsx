import React from "react";
import { Dialog } from "../common/component/Dialog";
import { WishList } from "./WishList";

export function WishListEditorDialog(props) {
  const { user, acnh, onClose, onCommit, onCreate, wishlist } = props;
  return (
    <Dialog onClose={onClose} className="w-full h-full">
      <WishList
        user={user}
        acnh={acnh}
        onCommit={onCommit}
        onCreate={onCreate}
        onClose={onClose}
        wishlist={wishlist}
      />
    </Dialog>
  );
}
