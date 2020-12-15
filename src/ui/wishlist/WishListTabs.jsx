import React from "react";
import { Button } from "../common/Button";
import { WishListCategories } from "./WishListCategories";
import { HorizontalList } from "../common/HorizontalList";
import { ACNHFish } from "../../domain/acnh/ACNHFish";
import { ACNHBug } from "../../domain/acnh/ACNHBug";
import { ACNHSea } from "../../domain/acnh/ACNHSea";
import { ACNHFossil } from "../../domain/acnh/ACNHFossil";
import { ACNHHouseware } from "../../domain/acnh/ACNHHouseware";
import { ACNHWallmount } from "../../domain/acnh/ACNHWallmount";

export function WishListTabs(props) {
  const { className, style, category, onTabClicked } = props;
  return (
    <div className={`${className ? className : ""} block w-full`} style={style}>
      <HorizontalList>
        <WishListTab
          category={ACNHFish.TYPE}
          currentCategory={category}
          onClick={onTabClicked}
        />
        <WishListTab
          category={ACNHBug.TYPE}
          currentCategory={category}
          onClick={onTabClicked}
        />
        <WishListTab
          category={ACNHSea.TYPE}
          currentCategory={category}
          onClick={onTabClicked}
        />
        <WishListTab
          category={ACNHFossil.TYPE}
          currentCategory={category}
          onClick={onTabClicked}
        />
        <WishListTab
          category={ACNHHouseware.TYPE}
          currentCategory={category}
          onClick={onTabClicked}
        />
        <WishListTab
          category={ACNHWallmount.TYPE}
          currentCategory={category}
          onClick={onTabClicked}
        />
      </HorizontalList>
    </div>
  );
}

class WishListTab extends React.Component {
  handleClick = () => {
    const { category, onClick } = this.props;
    onClick(category);
  };

  render() {
    const { currentCategory, category } = this.props;
    return (
      <Button
        className={`${
          currentCategory === category ? "text-green-400" : "text-black"
        } whitespace-nowrap`}
        onClick={this.handleClick}
      >
        {WishListCategories.getDisplayName(category)}
      </Button>
    );
  }
}
