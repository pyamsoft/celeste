import React from "react";

export function UserProfile(props) {
  const { user, wishlist, onCreateNewWishList } = props;
  return (
    <div>
      <div>Profile for: {user.displayName}</div>
      <ul className="block overflow-auto">
        {wishlist.wishlists.map((w) => (
          <li key={w} className="w-full">
            {w}
          </li>
        ))}
      </ul>
      <div className="block w-full">
        <div onClick={onCreateNewWishList}>New</div>
      </div>
    </div>
  );
}
