import React from "react";
import { Title } from "../common/Title";
import { ListItem } from "../common/ListItem";
import { List } from "../common/List";
import { Button } from "../common/Button";

export function UserProfile(props) {
  const { user, wishLists, onCreateNewWishList, onWishListSelected } = props;
  return (
    <div>
      <Title>Profile for: {user.displayName}</Title>
      <List>
        {wishLists.map((w) => (
          <WishList key={w.id} wishlist={w} onClick={onWishListSelected} />
        ))}
      </List>
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
