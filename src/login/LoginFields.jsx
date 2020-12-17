import React from "react";
import { CenteredContainer } from "../common/component/CenteredContainer";
import { SuccessButton } from "../common/component/Button";
import { Input } from "../common/component/Input";
import { Text } from "../common/component/Text";

export function LoginFields(props) {
  const { onLogin, onEmailChanged, email, loggingIn } = props;
  return (
    <CenteredContainer>
      <Text className="mb-3 text-white w-72">
        Enter your email address and we will send you a verification email so
        you can log in!
      </Text>
      <Input
        disabled={loggingIn}
        className="w-full mb-3"
        onChange={onEmailChanged}
        onSubmit={onLogin}
        value={email}
        placeholder="Enter your email address"
      />
      <SuccessButton
        className="w-full px-3 py-2"
        onClick={onLogin}
        disabled={loggingIn}
      >
        Login
      </SuccessButton>
    </CenteredContainer>
  );
}
