import React from "react";
import { Title } from "../common/component/Title";
import { ListItem } from "../common/component/ListItem";
import { VerticalList } from "../common/component/VerticalList";
import { SuccessButton } from "../common/component/Button";

export function UserProfile(props) {
  const { user, wishLists, onCreateNewWishList, onWishListSelected } = props;
  return (
    <div>
      <Title>Profile for: {user.displayName}</Title>
      <VerticalList>
        {wishLists.map((w) => (
          <WishList key={w.id} wishlist={w} onClick={onWishListSelected} />
        ))}
      </VerticalList>
      <SuccessButton onClick={onCreateNewWishList}>New</SuccessButton>
    </div>
  );
}

class WishList extends React.Component {
  handleClick = () => {
    const { onClick, wishlist } = this.props;
    onClick(wishlist);
  };

  render() {
    const { wishlist } = this.props;
    return (
      <ListItem id={`wishlist-${wishlist.id}`} onClick={this.handleClick}>
        {wishlist.name}
      </ListItem>
    );
  }
}
