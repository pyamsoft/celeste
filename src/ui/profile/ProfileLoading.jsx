import React from "react";

export function ProfileLoading(props) {
  const { user } = props;
  return <div>Loading profile for: {user.displayName}</div>;
}
