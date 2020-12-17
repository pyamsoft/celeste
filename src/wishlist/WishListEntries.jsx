import React from "react";
import { fitToWindowWidth, remToPx, watchResize } from "../common/util/window";
import { stopListening } from "../common/util/listener";
import { WishListCategories } from "./WishListCategories";
import { WishListEntry } from "./entry/WishListEntry";
import { FixedSizeGrid, FixedSizeList } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";

const IDEAL_ITEM_SIZE = remToPx(12);

function calculatePossibleItemCount() {
  const maxPossibleWidth = fitToWindowWidth();
  return Math.floor(maxPossibleWidth / IDEAL_ITEM_SIZE);
}

export class WishListEntries extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      itemCount: calculatePossibleItemCount(),
    };

    this.resizeCallback = null;
  }

  componentDidMount() {
    this.resizeCallback = watchResize(() => {
      this.setState({ itemCount: calculatePossibleItemCount() });
    });
  }

  componentWillUnmount() {
    if (stopListening(this.resizeCallback)) {
      this.resizeCallback = null;
    }
  }

  getSearchPriority = (name) => {
    const { search } = this.props;
    const cleanSearch = search.trim().toLowerCase();
    const cleanName = name.trim().toLowerCase();

    if (cleanName === cleanSearch) {
      return 1;
    }

    if (cleanName.startsWith(cleanSearch)) {
      return 2;
    }

    if (cleanName.endsWith(cleanSearch)) {
      return 3;
    }

    if (cleanName.indexOf(cleanSearch) >= 0) {
      return 4;
    }

    return 0;
  };

  filterVisibleItems = (item) => {
    const { search, items, isEditable, category } = this.props;
    const noSearch = !search || !search.trim();
    if (isEditable) {
      if (noSearch) {
        return true;
      } else {
        return this.getSearchPriority(item.name) > 0;
      }
    }

    return items.find((i) => {
      const filtered =
        i.id === item.id && category === i.type && i.series === item.series;
      if (!filtered) {
        return false;
      } else {
        if (noSearch) {
          return true;
        } else {
          return this.getSearchPriority(i.name) > 0;
        }
      }
    });
  };

  sortItems = (i1, i2) => {
    const { search } = this.props;
    const noSearch = !search || !search.trim();
    if (noSearch) {
      // Do not change the sort order
      return 0;
    }

    const p1 = this.getSearchPriority(i1.name);
    const p2 = this.getSearchPriority(i2.name);
    if (p1 <= 0 && p2 <= 0) {
      return 0;
    }

    if (p1 > 0 && p2 <= 0) {
      return -1;
    }

    if (p2 > 0 && p1 <= 0) {
      return 1;
    }

    if (p1 < p2) {
      return -1;
    } else if (p1 > p2) {
      return 1;
    } else {
      return 0;
    }
  };

  mapToWishing = (item) => {
    const { isEditable, items, category } = this.props;
    const isWishing = items.find(
      (i) => i.id === item.id && category === i.type && i.series === item.series
    );

    return {
      item,
      count: isWishing?.count || 0,
      isWishing: isEditable ? isWishing?.count > 0 : false,
      note: isWishing?.note || "",
      giftedBy: isWishing?.giftedBy || {},
    };
  };

  generateRenderables = () => {
    const { acnh, category } = this.props;
    const categoryItems = acnh[category] || {};

    if (WishListCategories.hasSeries(category)) {
      const result = {};
      const seriesList = Object.keys(categoryItems);
      for (const series of seriesList) {
        const renderable = categoryItems[series]
          .filter(this.filterVisibleItems)
          .sort(this.sortItems)
          .map(this.mapToWishing);
        if (renderable.length > 0) {
          result[series] = renderable;
        }
      }
      return result;
    } else {
      return Object.values(categoryItems)
        .filter(this.filterVisibleItems)
        .sort(this.sortItems)
        .map(this.mapToWishing);
    }
  };

  renderSeriesRow = (renderables, { index, style }) => {
    const seriesList = Object.keys(renderables);
    const series = seriesList[index];

    return (
      <div
        key={series}
        style={style}
        className="flex flex-row flex-nowrap overflow-x-auto"
      >
        {renderables[series].map((entry) => this.renderEntry(entry, series))}
      </div>
    );
  };

  renderRow = (renderables, { columnIndex, rowIndex, style }) => {
    const { itemCount } = this.state;
    const index = rowIndex * itemCount + columnIndex;
    const entry = renderables[index];
    return (
      <div key={index} style={style}>
        {entry ? this.renderEntry(entry, index) : null}
      </div>
    );
  };

  renderEntry = (entry, series) => {
    const {
      category,
      onItemAdded,
      onItemRemoved,
      onNoteChanged,
      isEditable,
    } = this.props;
    const { item, ...rest } = entry;
    return (
      <WishListEntry
        {...rest}
        key={`${category}-${series}-${item.id}`}
        item={item}
        onAdd={onItemAdded}
        onRemove={onItemRemoved}
        onNoteChanged={onNoteChanged}
        size={IDEAL_ITEM_SIZE}
        isEditable={isEditable}
      />
    );
  };

  render() {
    const { className, style, category } = this.props;
    const { itemCount } = this.state;
    const renderables = this.generateRenderables();
    return (
      <div
        className={`${
          className ? className : ""
        } block w-full overflow-hidden h-full popover-boundary`}
        style={style}
      >
        {WishListCategories.hasSeries(category) ? (
          <div className="block overflow-x-hidden overflow-y-auto h-full">
            <AutoSizer>
              {({ height, width }) => (
                <FixedSizeList
                  height={height}
                  width={width}
                  itemSize={IDEAL_ITEM_SIZE}
                  itemCount={Object.keys(renderables).length}
                >
                  {(data) => this.renderSeriesRow(renderables, data)}
                </FixedSizeList>
              )}
            </AutoSizer>
          </div>
        ) : (
          <div className="flex flex-row flex-wrap overflow-x-hidden overflow-y-auto h-full">
            <AutoSizer>
              {({ height, width }) => (
                <FixedSizeGrid
                  height={height}
                  width={width}
                  rowCount={Math.ceil(renderables.length / itemCount)}
                  rowHeight={IDEAL_ITEM_SIZE}
                  columnCount={itemCount}
                  columnWidth={IDEAL_ITEM_SIZE}
                >
                  {(data) => this.renderRow(renderables, data)}
                </FixedSizeGrid>
              )}
            </AutoSizer>
          </div>
        )}
      </div>
    );
  }
}
