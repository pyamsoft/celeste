import React from "react";
import { Logger } from "../common/util/logger";
import { ProfileLoading } from "./ProfileLoading";
import { UserProfile } from "./UserProfile";
import { stopListening } from "../common/util/listener";
import { WishListEditorDialog } from "../wishlist/WishListEditorDialog";
import { ProfileInteractor } from "./ProfileInteractor";

const logger = Logger.tag("Profile");

export class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: null,

      userList: null,
      wishLists: null,
    };

    this.userListListener = null;
    this.itemListListeners = {};
  }

  componentDidMount() {
    const { user } = this.props;
    this.userListListener = ProfileInteractor.watchUserList({
      userID: user.id,
      onUserListChange: (userList) => {
        logger.d("User list updated: ", userList);
        this.setState({ userList }, () => {
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
        this.itemListListeners[wID] = ProfileInteractor.watchItemList({
          itemID: wID,
          onItemListChange: (list) => {
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
