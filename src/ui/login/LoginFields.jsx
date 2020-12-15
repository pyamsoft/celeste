import React from "react";
import { CenteredContainer } from "../common/CenteredContainer";
import { Button } from "../common/Button";
import { Input } from "../common/Input";

export function LoginFields(props) {
  const { onLogin, onEmailChanged, email, loggingIn } = props;
  return (
    <CenteredContainer>
      <Input
        disabled={loggingIn}
        className="w-full mb-3"
        onChange={onEmailChanged}
        onSubmit={onLogin}
        value={email}
        placeholder="Enter your email address"
      />
      <Button className="w-full" onClick={onLogin} disabled={loggingIn}>
        Login
      </Button>
    </CenteredContainer>
  );
}
