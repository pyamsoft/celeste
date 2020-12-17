import React from "react";
import { EmptyButton } from "../../common/component/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCommentDots } from "@fortawesome/free-solid-svg-icons";
import { eatClick, remToPx } from "../../common/util/window";
import { PopOver } from "../../common/component/PopOver";
import { NotePopup } from "./NotePopup";
import { Text } from "../../common/component/Text";

const DO_NOT_REVEAL_GIFTING_INFO = true;

export function EntryBottom(props) {
  const {
    item,
    count,
    giftedBy,
    note,
    onAdd,
    onRemove,
    onNoteChanged,
    isEditable,
  } = props;
  return (
    <div className="block absolute z-10 bottom-0 left-0 right-0 pb-3">
      <NotesRow
        giftedBy={giftedBy}
        count={count}
        item={item}
        note={note}
        onNoteChanged={onNoteChanged}
        isEditable={isEditable}
      />
      <CountButtons
        count={count}
        onAdd={onAdd}
        onRemove={onRemove}
        giftedBy={giftedBy}
        isEditable={isEditable}
      />
    </div>
  );
}

function NotesRow(props) {
  const { giftedBy, count, item, note, isEditable, onNoteChanged } = props;
  return (
    <div className="flex flex-row flex-nowrap w-full mb-2 relative">
      <TallyButton item={item} giftedBy={giftedBy} count={count} />
      <div className="flex-auto" />
      <NoteButton
        item={item}
        note={note}
        onNoteChanged={onNoteChanged}
        isEditable={isEditable}
      />
    </div>
  );
}

function getGiftedAmount(giftedBy) {
  return Object.values(giftedBy).reduce((a, b) => a + b, 0);
}

function TallyButton(props) {
  const { item, giftedBy, count } = props;
  const amount = getGiftedAmount(giftedBy);
  return (
    <PopOver
      disabled={amount <= 0 || DO_NOT_REVEAL_GIFTING_INFO}
      trigger={
        <div className="need-this-div-for-popover ml-3 my-auto">
          {amount}&nbsp;/&nbsp;{count}
        </div>
      }
    >
      <div className="p-2 w-full h-full">
        <Text className="mb-2">{item.name} gifted by:</Text>
        {Object.keys(giftedBy).map((userID) => (
          <div className="flex flex-row flex-nowrap" key={userID}>
            <Text className="mr-auto">{userID}</Text>
            <Text className="ml-2">{giftedBy[userID]}</Text>
          </div>
        ))}
      </div>
    </PopOver>
  );
}

function NoteButton(props) {
  const { item, note, isEditable, onNoteChanged } = props;
  return (
    <PopOver
      closeOnClickOutside={false}
      trigger={({ togglePopOver }) => (
        <div className="need-this-div-or-ref-error">
          <EmptyButton onClick={togglePopOver} className="mr-2">
            <div className="relative w-8 h-8">
              <FontAwesomeIcon
                icon={faCommentDots}
                size="2x"
                className="inset-0 absolute z-0"
              />
              {note && (
                <small className="bottom-0 right-0 z-10 absolute rounded-full h-4 w-4 bg-yellow-500 text-white text-center">
                  !
                </small>
              )}
            </div>
          </EmptyButton>
        </div>
      )}
    >
      {(popOverOperations) => (
        <NotePopup
          {...popOverOperations}
          item={item}
          note={note}
          isEditable={isEditable}
          onNoteChanged={onNoteChanged}
        />
      )}
    </PopOver>
  );
}

function CountButtons(props) {
  const { count, onAdd, onRemove, isEditable, giftedBy } = props;
  const amount = getGiftedAmount(giftedBy);
  return (
    <div className="flex flex-row flex-nowrap w-full">
      <IconButton
        className="ml-2 text-red-500"
        onClick={onRemove}
        disabled={!isEditable && amount <= 0}
      >
        -
      </IconButton>
      <div className="flex-auto" />
      <IconButton
        className="mr-2 text-green-500"
        onClick={onAdd}
        disabled={!isEditable && amount >= count}
      >
        +
      </IconButton>
    </div>
  );
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

class IconButton extends React.Component {
  handleClick = ($event) => {
    eatClick($event);
    const { onClick } = this.props;
    onClick();
  };

  render() {
    const { children, className, disabled } = this.props;
    return (
      <EmptyButton
        disabled={disabled}
        className={`my-auto bg-gray-500 hover:bg-gray-300 border-2 border-gray-500 hover:border-gray-300 disabled:bg-gray-100 disabled:border-gray-100 rounded-lg font-mono ${
          className ? className : ""
        }`}
        onClick={this.handleClick}
        style={ICON_STYLE}
      >
        <div className="m-auto">{children}</div>
      </EmptyButton>
    );
  }
}
