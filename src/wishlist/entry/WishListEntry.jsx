import React from "react";
import { Img } from "../../common/component/Img";
import { EntryTop } from "./EntryTop";
import { EntryBottom } from "./EntryBottom";
import _ from "lodash";
import { PopOver } from "../../common/component/PopOver";
import { EntryInfoPopup } from "./EntryInfoPopup";

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
    const { isWishing, item, size, count, isEditable } = this.props;
    return (
      <div className="p-1 cursor-point" style={this.generateItemStyle(size)}>
        <PopOver
          position={["right center", "left center"]}
          trigger={
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
                item={item}
                count={count}
                note={note}
                isEditable={isEditable}
                onAdd={this.handleAdd}
                onRemove={this.handleRemove}
                onNoteChanged={this.handleNoteChanged}
              />
            </div>
          }
        >
          {(popOverOperations) => (
            <EntryInfoPopup {...popOverOperations} item={item} />
          )}
        </PopOver>
      </div>
    );
  }
}
