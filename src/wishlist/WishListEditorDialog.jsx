import React from "react";
import { Dialog } from "../common/component/Dialog";
import { WishList } from "./WishList";
import { WishListInteractor } from "./WishListInteractor";
import { Logger } from "../common/util/logger";
import { WishListSaveRow } from "./WishListSaveRow";

const logger = Logger.tag("WishListEditorDialog");

export class WishListEditorDialog extends React.Component {
  constructor(props) {
    super(props);
    const { wishlist } = props;
    this.state = {
      submitted: false,

      // Deconstruct the wishlist
      name: wishlist.id ? wishlist.name : "New Wishlist",
      items: wishlist.id ? wishlist.items : [],
    };
  }

  handleCommitWishList = (callback, andThen) => {
    const { submitted } = this.state;
    if (submitted) {
      return;
    }

    this.setState({ submitted: true }, () => {
      try {
        callback();
      } finally {
        this.setState({ submitted: false }, andThen);
      }
    });
  };

  handleSubmitNewWishList = (name, items) => {
    this.handleCommitWishList(async () => {
      const { user } = this.props;
      try {
        const result = await WishListInteractor.createNewWishList({
          userID: user.id,
          wishListName: name,
          items,
        });
        logger.d("New wish list created:", result);
      } catch (e) {
        logger.e(e, "Error creating new wish list");
      }
    }, this.handleClose);
  };

  handleUpdateWishList = (id, name, items) => {
    this.handleCommitWishList(async () => {
      logger.d("Update wishlist", id, name, items);
    }, this.handleClose);
  };

  handleClose = () => {
    const { onClose } = this.props;
    onClose();
  };

  handleSave = () => {
    const { wishlist } = this.props;
    const { name, items } = this.state;
    if (!wishlist.id) {
      this.handleSubmitNewWishList(name, items);
    } else {
      this.handleUpdateWishList(wishlist.id, name, items);
    }
  };

  handleItemAdded = async (item) => {
    logger.d("Item added to wishlist: ", item);
    const { items } = this.state;
    const newItems = await WishListInteractor.itemAdded({
      list: items,
      item,
    });

    logger.d("Item list updated: ", newItems);
    this.setState({ items: newItems });
  };

  handleItemRemoved = async (item) => {
    logger.d("Item removed from wishlist: ", item);
    const { items } = this.state;
    const newItems = await WishListInteractor.itemRemoved({
      list: items,
      item,
    });

    logger.d("Item list updated: ", newItems);
    this.setState({ items: newItems });
  };

  render() {
    const { user, acnh } = this.props;
    const { name, items } = this.state;
    return (
      <Dialog onClose={this.handleClose} className="w-full h-full">
        <WishList
          user={user}
          acnh={acnh}
          name={name}
          items={items}
          isEditable={true}
          onItemAdded={this.handleItemAdded}
          onItemRemoved={this.handleItemRemoved}
        >
          <WishListSaveRow
            className="mt-3"
            onCancel={this.handleClose}
            onSave={this.handleSave}
          />
        </WishList>
      </Dialog>
    );
  }
}
