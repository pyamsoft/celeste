import { Dialog } from "../common/component/Dialog";
import { Title } from "../common/component/Title";
import { Text } from "../common/component/Text";
import { LoginDelegate } from "../login/LoginDelegate";
import React from "react";

const DIALOG_STYLE = {
  overlay: {
    // Over the tooltip
    zIndex: 50,
  },
  content: {
    // Over the tooltip
    zIndex: 100,
  },
};

export function ForceSignInDialog(props) {
  const { onClose } = props;
  return (
    <Dialog onClose={onClose} style={DIALOG_STYLE}>
      <Title>Hold on there!</Title>
      <Text>In order to update a wishlist, you need to sign in!</Text>
      <LoginDelegate />
    </Dialog>
  );
}
