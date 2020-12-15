import React from "react";
import { UserWishListInteractor } from "../../domain/wishlist/UserWishListInteractor";
import { Logger } from "../../util/logger";
import { ProfileLoading } from "./ProfileLoading";
import { UserProfile } from "./UserProfile";
import { WishListInteractor } from "../../domain/wishlist/WishListInteractor";
import { stopListening } from "../../util/listener";
import { ItemWishListInteractor } from "../../domain/wishlist/ItemWishListInteractor";
import { WishListEditorDialog } from "../wishlist/WishListEditorDialog";

const logger = Logger.tag("Profile");

export class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: null,
      submitted: false,

      userList: null,
      wishLists: null,
    };

    this.userListListener = null;
    this.itemListListeners = {};
  }

  componentDidMount() {
    const { user } = this.props;
    this.userListListener = UserWishListInteractor.watch({
      userID: user.id,
      onWishListChanged: (userList) => {
        logger.d("User list updated: ", userList);
        this.setState({ userList }, () => {
          this.createDefaultWishList();
          this.registerItemListeners();
        });
      },
    });
  }

  componentWillUnmount() {
    if (stopListening(this.userListListener)) {
      this.userListListener = null;
    }

    Object.keys(this.itemListListeners).forEach((i) => {
      const listener = this.itemListListeners[i];
      if (stopListening(listener)) {
        this.itemListListeners[i] = null;
      }
    });
    this.itemListListeners = {};
  }

  registerItemListeners = () => {
    if (this.itemListListeners.length > 0) {
      return;
    }

    const { userList } = this.state;
    if (!userList) {
      return;
    }

    userList.wishlists.forEach((wID) => {
      if (!this.itemListListeners[wID]) {
        this.itemListListeners[wID] = ItemWishListInteractor.watch({
          wishListID: wID,
          onWishListChanged: (list) => {
            logger.d("Item list updated: ", list);
            const { wishLists } = this.state;
            const newList = wishLists || [];
            const index = newList.findIndex((w) => w.id === list.id);
            if (index >= 0) {
              newList[index] = list;
            } else {
              newList.push(list);
            }
            this.setState({ wishLists: newList });
          },
        });
      }
    });
  };

  createDefaultWishList = () => {
    const { userList } = this.state;
    if (!userList) {
      return;
    }

    if (!userList.wishlists || userList.wishlists.length <= 0) {
      this.handleSubmitNewWishList("My Wishlist", []);
    }
  };

  handleWishListSelected = (wishlist) => {
    this.setState({ selected: wishlist });
  };

  handleCreateNewWishList = () => {
    this.handleWishListSelected({});
  };

  handleCloseWishList = () => {
    this.setState({ selected: null });
  };

  handleSubmitNewWishList = (name, items) => {
    const { submitted } = this.state;
    if (submitted) {
      return;
    }

    this.setState({ submitted: true }, async () => {
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
      } finally {
        this.setState({ submitted: false });
      }
    });
  };

  render() {
    const { user } = this.props;
    const { wishLists, selected } = this.state;
    return (
      <div className="w-full h-full overflow-hidden">
        {!wishLists || wishLists.length <= 0 ? (
          <ProfileLoading user={user} />
        ) : (
          <UserProfile
            user={user}
            wishLists={wishLists}
            onWishListSelected={this.handleWishListSelected}
            onCreateNewWishList={this.handleCreateNewWishList}
          />
        )}

        {!!selected && (
          <WishListEditorDialog
            onClose={this.handleCloseWishList}
            wishlist={selected}
          />
        )}
      </div>
    );
  }
}
