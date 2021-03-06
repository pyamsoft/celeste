import React from "react";
import { WishListDelegate } from "./WishListDelegate";
import { Title } from "../common/component/Title";
import { Logger } from "../common/util/logger";
import { registerRoute } from "../router/Router";
import { WishListInteractor } from "./WishListInteractor";
import { ProfileInteractor } from "../profile/ProfileInteractor";
import { stopListening } from "../common/util/listener";
import { WishListGiftInteractor } from "./WishListGiftInteractor";
import _ from "lodash";
import { ForceSignInDialog } from "./ForceSignInDialog";

const logger = Logger.tag("WishListPage");

class WishListController extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      wishlist: null,
      error: null,

      needToSignIn: false,
      committing: false,
    };

    this.wishListListener = null;
    this.publishGiftUpdated = _.debounce(this.updateGiftedByAmounts, 200);
  }

  componentDidMount() {
    const { match } = this.props;
    this.loadWishList(match?.params?.id);
  }

  componentWillUnmount() {
    if (stopListening(this.wishListListener)) {
      this.wishListListener = null;
    }

    this.publishGiftUpdated.cancel();
  }

  loadWishList = (id) => {
    const { loading } = this.state;
    if (loading) {
      return;
    }

    this.setState({ loading: true }, async () => {
      const payload = { loading: false };
      try {
        payload.wishlist = await WishListInteractor.get({ itemID: id });
        payload.error = null;
      } catch (e) {
        logger.e(e, "Error loading wishlist");
        payload.wishlist = null;
        payload.error = e;
      } finally {
        this.setState(payload, this.beginWatchingWishlist);
      }
    });
  };

  beginWatchingWishlist = () => {
    const { wishlist } = this.state;
    if (!wishlist) {
      logger.w("Cannot watch null wishlist");
      return;
    }

    this.wishListListener = ProfileInteractor.watchWishList({
      itemID: wishlist.id,
      onInsertOrUpdate: (list) => {
        const { wishlist } = this.state;
        if (wishlist.id === list.id) {
          this.setState({ wishlist: list, error: null });
        }
      },
      onDelete: (listID) => {
        const { wishlist } = this.state;
        if (wishlist.id === listID) {
          this.setState({
            wishlist: null,
            error: new Error("This wishlist has been deleted by it's owner."),
          });
        }
      },
    });
  };

  stopShowingSignInPopup = () => {
    this.setState({ needToSignIn: false });
  };

  showSignInPopup = () => {
    this.setState({ needToSignIn: true });
  };

  handleItemAdded = async (item) => {
    const { user } = this.props;
    if (!user) {
      logger.w("Missing user, you must sign in to do gift things.");
      this.showSignInPopup();
      return;
    }

    const { wishlist } = this.state;
    this.setState(
      {
        wishlist: wishlist.updateItems(
          await WishListGiftInteractor.giftAdded({
            userID: user.id,
            list: wishlist.items,
            item,
          })
        ),
      },
      this.publishGiftUpdated
    );
  };

  handleItemRemoved = async (item) => {
    const { user } = this.props;
    if (!user) {
      logger.w("Missing user, you must sign in to do gift things.");
      this.showSignInPopup();
      return;
    }

    const { wishlist } = this.state;
    this.setState(
      {
        wishlist: wishlist.updateItems(
          await WishListGiftInteractor.giftRemoved({
            userID: user.id,
            list: wishlist.items,
            item,
          })
        ),
      },
      this.publishGiftUpdated
    );
  };

  updateGiftedByAmounts = () => {
    const { user } = this.props;
    if (!user) {
      logger.w("Missing user, you must sign in to do gift things.");
      this.showSignInPopup();
      return;
    }

    const { committing, wishlist } = this.state;
    if (committing) {
      return;
    }
    this.setState({ committing: true }, async () => {
      try {
        await WishListInteractor.giftUpdateWishList({
          userID: user.id,
          wishListID: wishlist.id,
          items: wishlist.items,
        });
      } catch (e) {
        logger.e(e, "Unable to gift new items");
      } finally {
        this.setState({ committing: false });
      }
    });
  };

  render() {
    const { user, acnh } = this.props;
    const { error, loading, wishlist, needToSignIn } = this.state;
    return (
      <React.Fragment>
        {error ? (
          <div className="m-5 text-red-600">ERROR: {error.message}</div>
        ) : !wishlist || loading ? (
          <Loading />
        ) : (
          <WishListDelegate
            user={user}
            acnh={acnh}
            isEditable={false}
            name={wishlist.name}
            items={wishlist.items}
            onItemAdded={this.handleItemAdded}
            onItemRemoved={this.handleItemRemoved}
          />
        )}

        {needToSignIn && (
          <ForceSignInDialog onClose={this.stopShowingSignInPopup} />
        )}
      </React.Fragment>
    );
  }
}

function Loading() {
  return <Title>Loading Wishlist....</Title>;
}

export const WishListPage = registerRoute(WishListController);
