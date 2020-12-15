import React from "react";
import { Title } from "../common/Title";
import { ListItem } from "../common/ListItem";
import { List } from "../common/List";
import { Button } from "../common/Button";

export function UserProfile(props) {
  const { user, wishlist, onCreateNewWishList } = props;
  return (
    <div>
      <Title>Profile for: {user.displayName}</Title>
      <List>
        {wishlist.wishlists.map((w) => (
          <ListItem key={w}>{w}</ListItem>
        ))}
      </List>
      <Button onClick={onCreateNewWishList}>New</Button>
    </div>
  );
}
