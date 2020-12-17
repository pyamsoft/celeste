import React from "react";
import { Img } from "../../common/component/Img";
import { EntryTop } from "./EntryTop";
import { EntryBottom } from "./EntryBottom";
import _ from "lodash";
import { PopOver } from "../../common/component/PopOver";
import { EntryInfoPopup } from "./EntryInfoPopup";
import { WishListItem } from "../WishListItem";

export class WishListEntry extends React.Component {
  constructor(props) {
    super(props);
    const { note } = props;
    this.state = {
      note,
    };

    this.publishNotesUpdate = _.debounce(this.immediatelyUpdateNotes, 60);
  }

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

  handleNoteChanged = (note) => {
    this.setState({ note }, this.publishNotesUpdate);
  };

  immediatelyUpdateNotes = () => {
    const { item, onNoteChanged } = this.props;
    const { note } = this.state;
    onNoteChanged(item, note);
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { isEditable } = this.props;
    if (!isEditable) {
      // Replace the notes with the props if we cannot edit this notes
      const { note } = this.state;
      const { note: newNotes } = this.props;
      if (newNotes !== note) {
        this.setState({ note: newNotes });
      }
    }
  }

  render() {
    const { note } = this.state;
    const { isWishing, item, size, count, isEditable, giftedBy } = this.props;
    return (
      <div className="p-1 cursor-point" style={this.generateItemStyle(size)}>
        <PopOver
          key={`popover-${item.id}`}
          position={["right center", "left center"]}
          trigger={
            <div
              key={`trigger-${item.id}`}
              className={`relative w-full h-full rounded-lg border-2 ${
                WishListItem.getGiftedByCount(giftedBy) >= count && count > 0
                  ? "bg-indigo-200 hover:bg-indigo-100 border-indigo-400 hover:border-indigo-600"
                  : isWishing
                  ? "bg-pink-200 hover:bg-pink-100 border-pink-400 hover:border-pink-600"
                  : "bg-gray-300 hover:bg-gray-100 border-gray-400 hover:border-gray-600"
              }`}
            >
              <Img
                key={`img-${item.id}`}
                preload={true}
                src={item.image}
                alt={item.name}
                width={size}
                height={size}
              />

              <EntryTop
                key={`top-${item.id}`}
                item={item}
                isEditable={isEditable}
              />
              <EntryBottom
                key={`bottom-${item.id}`}
                item={item}
                count={count}
                note={note}
                giftedBy={giftedBy}
                isEditable={isEditable}
                onAdd={this.handleAdd}
                onRemove={this.handleRemove}
                onNoteChanged={this.handleNoteChanged}
              />
            </div>
          }
        >
          {(popOverOperations) => (
            <EntryInfoPopup
              {...popOverOperations}
              key={`info-${item.id}`}
              item={item}
            />
          )}
        </PopOver>
      </div>
    );
  }
}
