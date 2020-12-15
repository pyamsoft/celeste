import React from "react";
import { ACItem } from "../../domain/item/ACItem";
import { UserWishListInteractor } from "../../domain/wishlist/UserWishListInteractor";
import { Logger } from "../../util/logger";
import { ProfileLoading } from "./ProfileLoading";
import { UserProfile } from "./UserProfile";

const logger = Logger.tag("Profile");

export class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      creating: false,
      wishlist: null,
    };
  }

  componentDidMount() {
    const { user } = this.props;
    UserWishListInteractor.listenForWishListChanges({
      userID: user.id,
      onWishListChanged: (wishlist) => {
        logger.d("Wishlist updated: ", wishlist);
        this.setState({ wishlist });
      },
    });
  }

  handleCreateNewWishList = () => {
    this.handleSubmitNewWishList("New List Hello", [
      {
        id: "TEST-HELLO",
        type: "fish",
      },
    ]);
    this.setState({ creating: true });
  };

  handleCancelNewWishList = () => {
    this.setState({ creating: false });
  };

  handleSubmitNewWishList = async (name, items) => {
    const { user } = this.props;
    try {
      const result = await UserWishListInteractor.createNewWishList({
        userID: user.id,
        wishListName: name,
        items,
      });
      logger.d("New wish list created:", result);
    } catch (e) {
      logger.e(e, "Error creating new wish list");
    }
  };

  render() {
    const { user } = this.props;
    const { wishlist } = this.state;
    return (
      <div className="w-full h-full overflow-hidden">
        {!wishlist ? (
          <ProfileLoading user={user} />
        ) : (
          <UserProfile
            user={user}
            wishlist={wishlist}
            onCreateNewWishList={this.handleCreateNewWishList}
          />
        )}
      </div>
    );
  }
}
