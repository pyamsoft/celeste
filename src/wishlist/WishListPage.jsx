import React from "react";
import { WishListDelegate } from "./WishListDelegate";
import { Title } from "../common/component/Title";
import { Logger } from "../common/util/logger";
import { registerRoute } from "../router/Router";
import { WishListInteractor } from "./WishListInteractor";
import { ProfileInteractor } from "../profile/ProfileInteractor";
import { stopListening } from "../common/util/listener";

const logger = Logger.tag("WishListPage");

class WishListController extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      wishlist: null,
      error: null,
    };

    this.wishListListener = null;
  }

  componentDidMount() {
    const { match } = this.props;
    this.loadWishList(match?.params?.id);
  }

  componentWillUnmount() {
    if (stopListening(this.wishListListener)) {
      this.wishListListener = null;
    }
  }

  loadWishList = (id) => {
    const { loading } = this.state;
    if (loading) {
      return;
    }

    this.setState({ loading: true }, async () => {
      const payload = { loading: false };
      try {
        logger.d("Loading wishlist: ", id);
        const wishlist = await WishListInteractor.get({ itemID: id });
        logger.d("Loaded wishlist: ", wishlist);
        payload.wishlist = wishlist;
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
      logger.d("Cannot watch null wishlist");
      return;
    }

    this.wishListListener = ProfileInteractor.watchWishList({
      itemID: wishlist.id,
      onInsertOrUpdate: (list) => {
        logger.d("WishList list inserted/updated: ", list);
        const { wishlist } = this.state;
        if (wishlist.id === list.id) {
          this.setState({ wishlist: list, error: null });
        }
      },
      onDelete: (listID) => {
        logger.d("WishList list deleted ", listID);
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

  handleItemAdded = (item) => {
    const { wishlist } = this.state;
    logger.d("WishListItem gifted to wishlist: ", item, wishlist);
  };

  handleItemRemoved = (item) => {
    const { wishlist } = this.state;
    logger.d("WishListItem taken back from wishlist: ", item, wishlist);
  };

  render() {
    const { user, acnh } = this.props;
    const { error, loading, wishlist } = this.state;
    return error ? (
      <div className="m-5 font-bold text-red-600">ERROR: {error.message}</div>
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
    );
  }
}

function Loading() {
  return <Title>Loading Wishlist....</Title>;
}

export const WishListPage = registerRoute(WishListController);
