import React from "react";
import { CenteredContainer } from "../common/CenteredContainer";
import { Button } from "../common/Button";
import { Input } from "../common/Input";

export function LoginFields(props) {
  const { onLogin, onEmailChanged, email } = props;
  return (
    <CenteredContainer>
      <Input className="w-full mb-3" onChange={onEmailChanged} value={email} />
      <Button className="w-full" onClick={onLogin} />
    </CenteredContainer>
  );
}
