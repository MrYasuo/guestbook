import type { Offset } from "./offset";

export class Caret {
  caret: HTMLElement;

  constructor(editor: HTMLTextAreaElement, offset: Offset) {
    this.caret = document.createElement("div");
    editor.parentNode.appendChild(this.caret);
    // Currently I don't know anyways for adding css in javascript efficently
    // So I will use external css file
    this.caret.id = "caret";
		this.caret.style.height = getComputedStyle(editor).fontSize;
  }

  setOffset(offset: Offset) {
    this.caret.style.top = `${offset.top}px`;
    this.caret.style.left = `${offset.left}px`;
  }

  setVisible = () => this.caret.classList.add("caret--focus");
  setHidden = () => this.caret.classList.remove("caret--focus");
}
