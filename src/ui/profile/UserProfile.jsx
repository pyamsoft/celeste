import React from "react";
import { Title } from "../common/Title";
import { ListItem } from "../common/ListItem";
import { VerticalList } from "../common/VerticalList";
import { Button } from "../common/Button";

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
      <Button onClick={onCreateNewWishList}>New</Button>
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
