import React from "react";
import { WishListTitle } from "./WishListTitle";
import { WishListTabs } from "./WishListTabs";
import { WishListCategories } from "./WishListCategories";
import { WishListItems } from "./WishListItems";
import { Logger } from "../../util/logger";

const logger = Logger.tag("WishListView");
const defaultClassNames =
  "wish-list flex flex-col overflow-hidden w-full overflow-hidden";

export class WishListView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      category: WishListCategories.DEFAULT,
    };
  }

  handleTabClicked = (category) => {
    this.setState({ category });
  };

  handleItemClicked = (item) => {
    logger.d("Item clicked: ", item);
  };

  render() {
    const { className, style, ...rest } = this.props;
    const { acnh, name, items } = rest;
    const { category } = this.state;
    return (
      <div
        className={`${defaultClassNames} ${className ? className : ""}`}
        style={style}
      >
        <WishListTitle name={name} className="mb-3" />
        <WishListTabs
          category={category}
          onTabClicked={this.handleTabClicked}
        />
        <WishListItems
          acnh={acnh}
          items={items}
          category={category}
          onItemClicked={this.handleItemClicked}
        />
      </div>
    );
  }
}
