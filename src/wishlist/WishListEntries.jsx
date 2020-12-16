import React from "react";
import { fitToWindowWidth, remToPx, watchResize } from "../common/util/window";
import { stopListening } from "../common/util/listener";
import { WishListCategories } from "./WishListCategories";
import { WishListEntry } from "./entry/WishListEntry";

const IDEAL_ITEM_SIZE = remToPx(12);

function calculatePossibleItemSize() {
  const maxPossibleWidth = fitToWindowWidth();

  let count = 1;
  while (IDEAL_ITEM_SIZE * count <= maxPossibleWidth) {
    ++count;
  }

  return Math.floor(maxPossibleWidth / count);
}

export class WishListEntries extends React.Component {
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
      return items.find(
        (i) =>
          i.id === item.id && category === i.type && i.series === item.series
      );
    }
  };

  mapToWishing = (item) => {
    const { isEditable, items, category } = this.props;
    const isWishing = items.find(
      (i) => i.id === item.id && category === i.type && i.series === item.series
    );

    return {
      item,
      count: isWishing?.count ?? 0,
      isWishing: isEditable ? isWishing?.count > 0 : false,
      note: isWishing?.note ?? "",
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
      onNoteChanged,
      isEditable,
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
                  .map(({ item, count, note, isWishing }) => (
                    <WishListEntry
                      key={`${category}-${series}-${item.id}`}
                      item={item}
                      isWishing={isWishing}
                      onAdd={onItemAdded}
                      onRemove={onItemRemoved}
                      onNoteChanged={onNoteChanged}
                      size={itemSize}
                      count={count}
                      note={note}
                      isEditable={isEditable}
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
              .map(({ item, count, note, isWishing }) => (
                <WishListEntry
                  key={`${category}-${item.id}`}
                  item={item}
                  onAdd={onItemAdded}
                  onRemove={onItemRemoved}
                  onNoteChanged={onNoteChanged}
                  isWishing={isWishing}
                  size={itemSize}
                  count={count}
                  note={note}
                  isEditable={isEditable}
                />
              ))}
          </div>
        )}
      </div>
    );
  }
}