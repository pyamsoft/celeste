import React from "react";
import { Title } from "../common/component/Title";

export function ProfileLoading(props) {
  const { user } = props;
  return <Title>Loading profile for: {user.displayName}</Title>;
}
