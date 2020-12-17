import React from "react";
import { Title } from "../common/component/Title";
import { ListItem } from "../common/component/ListItem";
import { VerticalList } from "../common/component/VerticalList";
import { Button, SuccessButton } from "../common/component/Button";
import { faClipboard, faShareAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { APP_URL } from "../common/util/constants";
import { eatClick } from "../common/util/window";
import { PopOver } from "../common/component/PopOver";
import { CopyToClipboard } from "react-copy-to-clipboard";

export class UserProfile extends React.Component {
  render() {
    const {
      user,
      wishLists,
      onCreateNewWishList,
      onWishListSelected,
    } = this.props;
    return (
      <div>
        <Title>Profile for: {user.displayName}</Title>
        <VerticalList>
          {wishLists.map((w) => (
            <WishList key={w.id} wishlist={w} onClick={onWishListSelected} />
          ))}
        </VerticalList>
        <SuccessButton onClick={onCreateNewWishList}>New</SuccessButton>
      </div>
    );
  }
}

class WishList extends React.Component {
  constructor(props) {
    super(props);
    this.popOverTimer = null;
  }

  componentWillUnmount() {
    this.clearPopOverTimer();
  }

  clearPopOverTimer = () => {
    if (this.popOverTimer) {
      clearTimeout(this.popOverTimer);
      this.popOverTimer = null;
    }
  };

  handleClick = () => {
    const { onClick, wishlist } = this.props;
    onClick(wishlist);
  };

  handleOnCopy = (openPopOver, closePopOver) => {
    return () => {
      this.clearPopOverTimer();
      openPopOver();
      this.popOverTimer = setTimeout(() => {
        closePopOver();
      }, 2000);
    };
  };

  render() {
    const { wishlist } = this.props;
    return (
      <ListItem id={`wishlist-${wishlist.id}`} onClick={this.handleClick}>
        <div className="flex flex-row flex-nowrap">
          <span>{wishlist.name}</span>
          <div className="flex-auto" />
          <PopOver
            position="bottom center"
            closeOnClickOutside={true}
            trigger={({ openPopOver, closePopOver }) => (
              <div className="need-this-for-popover">
                <CopyToClipboard
                  text={`${APP_URL}/wishlists/${wishlist.id}`}
                  onCopy={this.handleOnCopy(openPopOver, closePopOver)}
                >
                  <Button onClick={eatClick} className="px-3">
                    <div className="flex flex-row flex-nowrap divide-x-2 divide-gray-200">
                      <div>
                        <FontAwesomeIcon
                          icon={faShareAlt}
                          className="mr-2 my-2"
                        />
                      </div>
                      <div>
                        <FontAwesomeIcon
                          icon={faClipboard}
                          className="ml-2 my-2"
                        />
                      </div>
                    </div>
                  </Button>
                </CopyToClipboard>
              </div>
            )}
          >
            {({ closePopOver }) => (
              <div className="w-full h-full" onClick={closePopOver}>
                Copied to clipboard! Share your list with friends!
              </div>
            )}
          </PopOver>
        </div>
      </ListItem>
    );
  }
}
