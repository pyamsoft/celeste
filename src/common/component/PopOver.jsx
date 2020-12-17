import React from "react";
import Popup from "reactjs-popup";
import styled from "styled-components";

const TYPE_FUNCTION = typeof function () {};

const StyledPopup = styled(Popup)`
  &-overlay {
  }
  &-content {
    padding: 0;
    width: auto !important;
  }
`;

export class PopOver extends React.Component {
  constructor(props) {
    super(props);

    this.operations = {
      openPopOver: this.open,
      closePopOver: this.close,
      togglePopOver: this.toggle,
    };
  }

  setRef = (ref) => {
    this.ref = ref;
  };

  open = () => {
    if (this.ref) {
      this.ref.open();
    }
  };

  close = () => {
    if (this.ref) {
      this.ref.close();
    }
  };

  toggle = () => {
    if (this.ref) {
      this.ref.toggle();
    }
  };

  componentWillUnmount() {
    this.close();
  }

  render() {
    const {
      position,
      closeOnClickOutside,
      trigger,
      children,
      keepInside,
      disabled,
      on,
    } = this.props;
    return (
      <StyledPopup
        ref={this.setRef}
        trigger={
          typeof trigger === TYPE_FUNCTION ? trigger(this.operations) : trigger
        }
        on={disabled ? [] : on}
        position={position}
        keepTooltipInside={keepInside}
        closeOnDocumentClick={closeOnClickOutside}
      >
        {typeof children === TYPE_FUNCTION
          ? children(this.operations)
          : children}
      </StyledPopup>
    );
  }
}
