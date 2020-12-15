import React from "react";
import { CenteredContainer } from "../common/component/CenteredContainer";
import { Button } from "../common/component/Button";
import { Input } from "../common/component/Input";

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
      <Button
        className="w-full btn-green-300 text-white border-green-400"
        onClick={onLogin}
        disabled={loggingIn}
      >
        Login
      </Button>
    </CenteredContainer>
  );
}
