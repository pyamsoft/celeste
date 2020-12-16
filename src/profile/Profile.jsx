import React from "react";
import { Logger } from "../common/util/logger";
import { UserProfile } from "./UserProfile";
import { stopListening } from "../common/util/listener";
import { WishListEditorDialog } from "../wishlist/WishListEditorDialog";
import { ProfileInteractor } from "./ProfileInteractor";

const logger = Logger.tag("Profile");

export class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      creating: false,
      selected: null,

      userList: null,
      wishLists: null,
    };

    this.userListListener = null;
    this.itemListListeners = {};
  }

  componentDidMount() {
    const { user } = this.props;
    this.userListListener = ProfileInteractor.watchUserWishList({
      userID: user.id,
      onUserListChange: (userList) => {
        logger.d("User list updated: ", userList);
        this.setState({ userList }, () => {
          this.registerItemListeners();
        });
      },
    });

    this.createDefaultUserWishList();
  }

  createDefaultUserWishList = () => {
    const { creating } = this.state;
    if (creating) {
      return;
    }

    this.setState({ creating: true }, async () => {
      const { user } = this.props;
      try {
        await ProfileInteractor.createDefaultUserWishList({ userID: user.id });
      } catch (e) {
        logger.e(e, "Failed to create default user wish list");
      } finally {
        this.setState({ creating: false });
      }
    });
  };

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

    if (userList.wishlists.length <= 0) {
      logger.d("User does not have any user-wishlists: ", userList);
      this.setState({ wishLists: [] });
      return;
    }

    userList.wishlists.forEach((wishlist) => {
      const wID = wishlist.id;
      if (!this.itemListListeners[wID]) {
        this.itemListListeners[wID] = ProfileInteractor.watchWishList({
          itemID: wID,
          onInsertOrUpdate: (list) => {
            logger.d("WishList list inserted/updated: ", list);
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
          onDelete: (listID) => {
            logger.d("WishList list deleted ", listID);
            const { wishLists } = this.state;
            const newList = wishLists || [];
            const index = newList.findIndex((w) => w.id === listID);
            if (index >= 0) {
              newList.splice(index, 1);
            }
            this.setState({ wishLists: newList });
          },
        });
      }
    });
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

  render() {
    const { user, acnh } = this.props;
    const { wishLists, selected } = this.state;
    return (
      <div className="w-full h-full overflow-hidden">
        <UserProfile
          user={user}
          wishLists={wishLists || []}
          onWishListSelected={this.handleWishListSelected}
          onCreateNewWishList={this.handleCreateNewWishList}
        />

        {!!selected && (
          <WishListEditorDialog
            user={user}
            acnh={acnh}
            onClose={this.handleCloseWishList}
            wishlist={selected}
          />
        )}
      </div>
    );
  }
}
