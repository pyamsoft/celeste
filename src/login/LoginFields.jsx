import React from "react";
import { CenteredContainer } from "../common/component/CenteredContainer";
import { SuccessButton } from "../common/component/Button";
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
      <SuccessButton className="w-full" onClick={onLogin} disabled={loggingIn}>
        Login
      </SuccessButton>
    </CenteredContainer>
  );
}
