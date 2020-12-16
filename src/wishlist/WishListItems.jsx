import React from "react";
import { Text } from "../common/component/Text";
import { Img } from "../common/component/Img";
import { fitToWindowWidth, remToPx, watchResize } from "../common/util/window";
import { EmptyButton } from "../common/component/Button";
import { stopListening } from "../common/util/listener";
import { WishListCategories } from "./WishListCategories";

const IDEAL_ITEM_SIZE = remToPx(12);

function calculatePossibleItemSize() {
  const maxPossibleWidth = fitToWindowWidth();

  let count = 1;
  while (IDEAL_ITEM_SIZE * count <= maxPossibleWidth) {
    ++count;
  }

  return Math.floor(maxPossibleWidth / count);
}

export class WishListItems extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      itemSize: calculatePossibleItemSize(),
    };

    this.resizeCallback = null;
  }

  componentDidMount() {
    this.resizeCallback = watchResize(() => {
      this.setState({ itemSize: calculatePossibleItemSize() });
    });
  }

  componentWillUnmount() {
    if (stopListening(this.resizeCallback)) {
      this.resizeCallback = null;
    }
  }

  filterVisibleItems = (item) => {
    const { items, isEditable, category } = this.props;
    if (isEditable) {
      return true;
    } else {
      return items.find((i) => {
        const basicValidation = i.id === item.id && category === i.type;
        if (!basicValidation) {
          return false;
        }

        if (WishListCategories.hasSeries(category)) {
          return i.series === item.series;
        } else {
          return true;
        }
      });
    }
  };

  mapToWishing = (item) => {
    const { items, category } = this.props;
    const isWishing = items.find((i) => {
      const basicValidation = i.id === item.id && category === i.type;
      if (!basicValidation) {
        return false;
      }

      if (WishListCategories.hasSeries(category)) {
        return i.series === item.series;
      } else {
        return true;
      }
    });

    return {
      item,
      count: isWishing?.count ?? 0,
      isWishing: isWishing?.count > 0,
    };
  };

  render() {
    const {
      className,
      style,
      acnh,
      category,
      onItemAdded,
      onItemRemoved,
    } = this.props;
    const { itemSize } = this.state;
    const categoryItems = acnh[category] || {};
    return (
      <div
        className={`${
          className ? className : ""
        } block w-full overflow-hidden h-full`}
        style={style}
      >
        {WishListCategories.hasSeries(category) ? (
          <div className="block w-full overflow-x-hidden overflow-y-auto h-full">
            {Object.keys(categoryItems).map((series) => (
              <div
                key={series}
                className="flex flex-row flex-nowrap overflow-x-auto"
              >
                {categoryItems[series]
                  .filter(this.filterVisibleItems)
                  .map(this.mapToWishing)
                  .map(({ item, count, isWishing }) => (
                    <WishListItem
                      key={`${category}-${series}-${item.id}`}
                      item={item}
                      isWishing={isWishing}
                      onAdd={onItemAdded}
                      onRemove={onItemRemoved}
                      size={itemSize}
                      count={count}
                    />
                  ))}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-row flex-wrap overflow-x-hidden overflow-y-auto h-full">
            {Object.values(categoryItems)
              .filter(this.filterVisibleItems)
              .map(this.mapToWishing)
              .map(({ item, count, isWishing }) => (
                <WishListItem
                  key={`${category}-${item.id}`}
                  item={item}
                  onAdd={onItemAdded}
                  onRemove={onItemRemoved}
                  isWishing={isWishing}
                  size={itemSize}
                  count={count}
                />
              ))}
          </div>
        )}
      </div>
    );
  }
}

class WishListItem extends React.Component {
  generateItemStyle = (size) => {
    return {
      width: size,
      minWidth: size,
      maxWidth: size,

      height: size,
      minHeight: size,
      maxHeight: size,
    };
  };

  handleAdd = () => {
    const { item, onAdd } = this.props;
    onAdd(item);
  };

  handleRemove = () => {
    const { item, onRemove } = this.props;
    onRemove(item);
  };

  render() {
    const { isWishing, item, size, count } = this.props;
    return (
      <div className="p-1 cursor-point" style={this.generateItemStyle(size)}>
        <div
          className={`relative w-full h-full rounded-lg border-2 ${
            isWishing
              ? "bg-green-300 hover:bg-green-400 border-green-400 hover:border-green-500"
              : "bg-gray-300 hover:bg-gray-100 border-gray-400 hover:border-gray-500"
          }`}
        >
          <Img
            preload={true}
            src={item.image}
            alt={item.name}
            width={size}
            height={size}
          />
          <Text className="flex flex-row absolute z-10 top-0 left-0 right-0 text-black">
            <div className="mx-auto mt-3">
              <div className="px-2">{item.name}</div>
            </div>
          </Text>
          <div className="flex flex-row absolute z-10 bottom-0 left-0 right-0 text-black pb-3">
            <IconButton
              className="ml-2 text-red-500"
              onClick={this.handleRemove}
            >
              -
            </IconButton>
            <div className="flex-auto" />
            {count > 0 && (
              <IconButton className="mx-2 text-white font-bold">
                {count}
              </IconButton>
            )}
            <div className="flex-auto" />
            <IconButton
              className="mr-2 text-green-500"
              onClick={this.handleAdd}
            >
              +
            </IconButton>
          </div>
        </div>
      </div>
    );
  }
}

const ICON_SIZE = remToPx(2);
const ICON_STYLE = {
  width: ICON_SIZE,
  minWidth: ICON_SIZE,
  maxWidth: ICON_SIZE,

  height: ICON_SIZE,
  minHeight: ICON_SIZE,
  maxHeight: ICON_SIZE,
};

function IconButton(props) {
  const { children, className, onClick } = props;
  return (
    <EmptyButton
      className={`my-auto font-size-xl bg-gray-500 hover:bg-gray-300 border-2 border-gray-500 hover:border-gray-300 rounded-lg font-mono ${
        className ? className : ""
      }`}
      onClick={onClick}
      style={ICON_STYLE}
    >
      <div className="m-auto">{children}</div>
    </EmptyButton>
  );
}
