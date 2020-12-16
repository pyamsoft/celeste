import React from "react";
import Popup from "reactjs-popup";
import styled from "styled-components";

const TYPE_FUNCTION = typeof function () {};

const StyledPopup = styled(Popup)`
  &-overlay {
  }
  &-content {
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
    const { closeOnClickOutside, trigger, children } = this.props;
    return (
      <StyledPopup
        ref={this.setRef}
        trigger={trigger(this.operations)}
        position={["top center", "bottom right", "bottom left"]}
        keepTooltipInside=".popover-boundary"
        closeOnDocumentClick={closeOnClickOutside}
      >
        {typeof children === TYPE_FUNCTION
          ? children(this.operations)
          : children}
      </StyledPopup>
    );
  }
}