import React from "react";
import { Title } from "../common/Title";
import { ListItem } from "../common/ListItem";
import { List } from "../common/List";
import { Button } from "../common/Button";

export function UserProfile(props) {
  const { user, wishLists, onCreateNewWishList } = props;
  return (
    <div>
      <Title>Profile for: {user.displayName}</Title>
      <List>
        {wishLists.map((w) => (
          <WishList key={w.id} wishlist={w} />
        ))}
      </List>
      <Button onClick={onCreateNewWishList}>New</Button>
    </div>
  );
}

function WishList(props) {
  const { wishlist } = props;
  return <ListItem id={`wishlist-${wishlist.id}`}>{wishlist.name}</ListItem>;
}
