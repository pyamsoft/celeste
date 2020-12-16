import React from "react";
import { EmptyButton } from "../../common/component/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCommentDots } from "@fortawesome/free-solid-svg-icons";
import { remToPx } from "../../common/util/window";

export function EntryBottom(props) {
  const {
    count,
    note,
    onAdd,
    onRemove,
    onNoteChanged,
    onNoteClicked,
    isEditable,
  } = props;
  return (
    <div className="block absolute z-10 bottom-0 left-0 right-0 pb-3">
      <NoteButton
        note={note}
        onNoteChanged={onNoteChanged}
        onNoteClicked={onNoteClicked}
        isEditable={isEditable}
      />
      <CountButtons count={count} onAdd={onAdd} onRemove={onRemove} />
    </div>
  );
}

function NoteButton(props) {
  const { note, onNoteClicked } = props;

  return (
    <div className="flex flex-row flex-nowrap w-full mb-2">
      <div className="flex-auto" />
      <EmptyButton onClick={onNoteClicked} className="mr-2">
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
  );
}

function CountButtons(props) {
  const { count, handleAdd, handleRemove } = props;
  return (
    <div className="flex flex-row flex-nowrap w-full">
      <IconButton className="ml-2 text-red-500" onClick={handleRemove}>
        -
      </IconButton>
      <div className="flex-auto" />
      {count > 0 && (
        <IconButton className="mx-2 text-white font-bold">{count}</IconButton>
      )}
      <div className="flex-auto" />
      <IconButton className="mr-2 text-green-500" onClick={handleAdd}>
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
