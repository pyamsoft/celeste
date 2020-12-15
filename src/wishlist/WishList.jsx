import React from "react";
import { WishListView } from "./WishListView";
import { WishListCategories } from "./WishListCategories";

export class WishList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      category: WishListCategories.DEFAULT,
    };
  }

  handleCategoryChanged = (category) => {
    this.setState({ category });
  };

  render() {
    const {
      user,
      acnh,
      name,
      items,
      isEditable,
      isCreating,
      children,
      onItemAdded,
      onItemRemoved,
    } = this.props;
    const { category } = this.state;

    return (
      <div className="w-full h-full max-h-full max-w-full overflow-hidden flex flex-col">
        <WishListView
          user={user}
          acnh={acnh}
          name={name}
          items={items}
          category={category}
          isCreating={isCreating}
          isEditable={isEditable}
          onItemAdded={onItemAdded}
          onItemRemoved={onItemRemoved}
          onCategoryChanged={this.handleCategoryChanged}
        />
        {children}
      </div>
    );
  }
}
