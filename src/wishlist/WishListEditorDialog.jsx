import React from "react";
import { Dialog } from "../common/component/Dialog";
import { WishListView } from "./WishListView";
import { WishListSaveRow } from "./WishListSaveRow";
import { WishListCategories } from "./WishListCategories";
import { Logger } from "../common/util/logger";

const logger = Logger.tag("WishListEditorDialog");

export class WishListEditorDialog extends React.Component {
  constructor(props) {
    super(props);

    // Construct via the wishlist and then we can work with state from here
    const { wishlist } = props;
    this.state = {
      // Deconstruct the wishlist
      name: wishlist.name || "New Wishlist",
      items: wishlist.items ? [...wishlist.items] : [],

      // Other state
      category: WishListCategories.DEFAULT,
    };
  }

  isCreating = () => {
    const { wishlist } = this.props;
    return !wishlist.id;
  };

  handleSave = () => {
    const { name, items } = this.state;
    const { onCreate, onCommit, onClose } = this.props;
    if (this.isCreating()) {
      onCreate(name, items);
    } else {
      const { wishlist } = this.props;
      onCommit(wishlist.id, name, items);
    }
    onClose();
  };

  handleItemSelected = (item) => {
    logger.d("Item selected: ", item);
  };

  handleCategoryChanged = (category) => {
    this.setState({ category });
  };

  render() {
    const { user, acnh, onClose } = this.props;
    const { name, items, category } = this.state;
    return (
      <Dialog onClose={onClose} className="w-full h-full">
        <WishListView
          user={user}
          acnh={acnh}
          name={name}
          items={items}
          category={category}
          className="flex-auto w-full overflow-hidden"
          onCategoryChanged={this.handleCategoryChanged}
          onItemSelected={this.handleItemSelected}
        />
        <WishListSaveRow
          className="mt-3"
          onCancel={onClose}
          onSave={this.handleSave}
          isCreating={this.isCreating()}
        />
      </Dialog>
    );
  }
}
