import React from "react";
import { Dialog } from "../common/component/Dialog";
import { WishListDelegate } from "./WishListDelegate";
import { WishListInteractor } from "./WishListInteractor";
import { Logger } from "../common/util/logger";
import { WishListSaveRow } from "./WishListSaveRow";
import { WishListManageInteractor } from "./WishListManageInteractor";
import { ProfileInteractor } from "../profile/ProfileInteractor";
import { stopListening } from "../common/util/listener";
import _ from "lodash";

const logger = Logger.tag("WishListEditorDialog");

export class WishListEditorDialog extends React.Component {
  constructor(props) {
    super(props);
    const { wishlist } = props;
    this.state = {
      submitted: false,

      // Deconstruct the wishlist
      id: wishlist.id || null,
      name: wishlist.id ? wishlist.name : "New Wishlist",
      items: wishlist.id ? wishlist.items : [],
    };

    this.queueSave = _.debounce(this.handleSave, 300, {
      leading: false,
      trailing: true,
    });
    this.wishListListener = null;
  }

  componentDidMount() {
    this.beginListeningToWishlist();
  }

  componentWillUnmount() {
    if (stopListening(this.wishListListener)) {
      this.wishListListener = null;
    }
    this.queueSave.cancel();
  }

  beginListeningToWishlist = () => {
    const { id } = this.state;
    if (!id) {
      return;
    }
    if (this.wishListListener) {
      return;
    }

    this.wishListListener = ProfileInteractor.watchWishList({
      itemID: id,
      onInsertOrUpdate: (list) => {
        if (id === list.id) {
          this.replaceGiftedBy(list);
        }
      },
      onDelete: (listID) => {
        if (id === listID) {
          logger.w("Wish list was deleted");
          this.handleClose();
        }
      },
    });
  };

  replaceGiftedBy = async (newWishList) => {
    const { items } = this.state;

    const newItems = await WishListManageInteractor.replaceGiftedBy({
      list: items,
      items: newWishList.items,
    });

    this.setState({ items: newItems });
  };

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
        const wishListID = await WishListInteractor.createNewWishList({
          userID: user.id,
          wishListName: name,
          items,
        });
        this.setState({ id: wishListID }, this.beginListeningToWishlist);
      } catch (e) {
        logger.e(e, "Error creating new wish list");
      }
    });
  };

  handleUpdateWishList = (id, name, items) => {
    this.handleCommitWishList(async () => {
      const { user } = this.props;
      try {
        await WishListInteractor.ownerUpdateWishList({
          userID: user.id,
          wishListID: id,
          wishListName: name,
          items,
        });
      } catch (e) {
        logger.e(e, "Error creating new wish list");
      }
    });
  };

  handleClose = () => {
    const { onClose } = this.props;
    onClose();
  };

  handleSave = () => {
    const { id, name, items } = this.state;
    if (!id) {
      this.handleSubmitNewWishList(name, items);
    } else {
      this.handleUpdateWishList(id, name, items);
    }
  };

  handleItemAdded = async (item) => {
    const { items } = this.state;
    const newItems = await WishListManageInteractor.itemAdded({
      list: items,
      item,
    });

    this.setState({ items: newItems }, this.queueSave);
  };

  handleItemRemoved = async (item) => {
    const { items } = this.state;
    const newItems = await WishListManageInteractor.itemRemoved({
      list: items,
      item,
    });

    this.setState({ items: newItems }, this.queueSave);
  };

  handleNoteChanged = async (item, note) => {
    const { items } = this.state;
    const newItems = await WishListManageInteractor.itemNotesUpdated({
      list: items,
      item,
      note,
    });

    this.setState({ items: newItems }, this.queueSave);
  };

  handleNameChanged = async (name) => {
    if (name.length > 0 && name.trim().length > 0) {
      this.setState({ name }, this.queueSave);
    }
  };

  render() {
    const { user, acnh } = this.props;
    const { name, items } = this.state;
    return (
      <Dialog onClose={this.handleClose} className="w-full h-full">
        <WishListDelegate
          user={user}
          acnh={acnh}
          name={name}
          items={items}
          isEditable={true}
          onItemAdded={this.handleItemAdded}
          onItemRemoved={this.handleItemRemoved}
          onNoteChanged={this.handleNoteChanged}
          onNameChanged={this.handleNameChanged}
        >
          <WishListSaveRow
            className="mt-3"
            onCancel={this.handleClose}
            onSave={this.handleSave}
          />
        </WishListDelegate>
      </Dialog>
    );
  }
}
