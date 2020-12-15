import React from "react";
import { WishList } from "./WishList";
import { noop } from "../common/util/function";
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

  render() {
    const { user, acnh } = this.props;
    const { loading, wishlist } = this.state;
    return !wishlist || loading ? (
      <Loading />
    ) : (
      <WishList
        user={user}
        acnh={acnh}
        onCommit={noop}
        onCreate={noop}
        onClose={noop}
        wishlist={wishlist}
      />
    );
  }
}

function Loading() {
  return <Title>Loading Wishlist....</Title>;
}

export const WishListPage = registerRoute(WishListController);
