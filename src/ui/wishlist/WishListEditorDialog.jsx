import React from "react";
import { Dialog } from "../common/Dialog";
import { WishListView } from "./WishListView";

export class WishListEditorDialog extends React.Component {
  constructor(props) {
    super(props);

    // Construct via the wishlist and then we can work with state from here
    const { wishlist } = props;
    this.state = {
      creating: !!wishlist.id,
      name: wishlist.name || "New Wishlist",
      items: wishlist.items ? [...wishlist.items] : [],
    };
  }

  render() {
    const { onClose } = this.props;
    return (
      <Dialog onClose={onClose} className="w-full h-full">
        <WishListView {...this.state} />
      </Dialog>
    );
  }
}
