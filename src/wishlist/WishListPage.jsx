import React from "react";
import { WishList } from "./WishList";
import { Title } from "../common/component/Title";
import { Logger } from "../common/util/logger";
import { registerRoute } from "../router/Router";
import { WishListInteractor } from "./WishListInteractor";

const logger = Logger.tag("WishListPage");

class WishListController extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      wishlist: null,
    };
  }

  componentDidMount() {
    const { match } = this.props;
    this.loadWishList(match?.params?.id);
  }

  loadWishList = (id) => {
    const { loading } = this.state;
    if (loading) {
      return;
    }

    this.setState({ loading: true }, async () => {
      const payload = { loading: false };
      try {
        const wishlist = await WishListInteractor.get({ itemID: id });
        logger.d("Loaded wishlist: ", wishlist);
        payload.wishlist = wishlist;
      } catch (e) {
        logger.e(e, "Error loading wishlist");
        payload.wishlist = null;
      } finally {
        this.setState(payload);
      }
    });
  };

  handleItemAdded = (item) => {
    const { wishlist } = this.props;
    logger.d("Item gifted to wishlist: ", item, wishlist);
  };

  handleItemRemoved = (item) => {
    const { wishlist } = this.props;
    logger.d("Item taken back from wishlist: ", item, wishlist);
  };

  render() {
    const { user, acnh } = this.props;
    const { loading, wishlist } = this.state;
    return !wishlist || loading ? (
      <Loading />
    ) : (
      <WishList
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
