import React from "react";
import {Img} from "../../common/component/Img";
import {remToPx} from "../../common/util/window";
import {EmptyButton} from "../../common/component/Button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCommentDots} from "@fortawesome/free-solid-svg-icons";
import {Logger} from "../../common/util/logger";
import {EntryTop} from "./EntryTop";
import {EntryBottom} from "./EntryBottom";

const logger = Logger.tag("WishListEntry");

export class WishListEntry extends React.Component {
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
    const { item, onNoteChanged } = this.props;
    onNoteChanged(item.updateNote(note));
  };

  handleNoteClicked = () => {
    const { isEditable } = this.props;
    logger.d("Note clicked. Is editable? ", isEditable);
  };

  render() {
    const { isWishing, item, size, count, note, isEditable } = this.props;
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

          <EntryTop item={item} isEditable={isEditable} />
          <EntryBottom
            count={count}
            note={note}
            isEditable={isEditable}
            onAdd={this.handleAdd}
            onRemove={this.handleRemove}
            onNoteChanged={this.handleNoteChanged}
            onNoteClicked={this.handleNoteClicked}
          />
        </div>
      </div>
    );
  }
}

