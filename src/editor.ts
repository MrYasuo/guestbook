import { Caret } from "./caret";
import type { Offset } from "./offset";
import { copyCss } from "./utils";

export class Editor {
	editor: HTMLTextAreaElement;
	editorStyle: CSSStyleDeclaration | null;
	private _baseOffset: Offset;

	private _editorMirror: HTMLElement;

	private _caret: Caret;
	private _caretOffset: Offset;

	/**
	 * @param editor send existing textarea element
	 *
	 * Currently the editor only support text
	 * In the future I may add more features like adding picture, changing text style
	 *
	 * This editor create a mirror to get the current caret's position
	 */
	constructor(editor: HTMLTextAreaElement | null) {
		if (editor === null) {
			this.editor = <HTMLTextAreaElement>document.createElement("textarea");
			document.body.appendChild(this.editor);
		} else {
			this.editor = <HTMLTextAreaElement>editor;
		}
		this.editorStyle = getComputedStyle(this.editor);

		// Getting base offset of the textarea
		this._baseOffset = {
			top:
				this.editor.offsetTop +
				parseInt(this.editorStyle.marginTop) +
				parseInt(this.editorStyle.borderTopWidth),
			left:
				this.editor.offsetLeft +
				parseInt(this.editorStyle.marginLeft) +
				parseInt(this.editorStyle.borderLeftWidth),
		};

		// Setting up mirror div
		this._editorMirror = document.createElement("div");
		this.editor.parentNode.appendChild(this._editorMirror);
		this._editorMirror.innerHTML = "<span></span>";
		// Copy textarea css to the mirrored one
		// copyCss(this._editorMirror, this.editorStyle);
		this._editorMirror.id = this.editor.id;
		this._editorMirror.style.visibility = "hidden";
		this._editorMirror.style.position = "fixed";
		this._editorMirror.style.top = "0";
		this._editorMirror.style.left = "0";

		this.editor.addEventListener("input", () => this.update());
		this.editor.addEventListener("click", () => this.update());
		this.editor.addEventListener("keyup", () => this.update());
		this.editor.addEventListener("keydown", () => this.update());
		this.editor.addEventListener("scroll", () => this.update());
		this.editor.addEventListener("blur", () => this._caret.setHidden());
		this.editor.addEventListener("focus", () => this._caret.setVisible());

		this._caret = new Caret(this.editor, this._baseOffset);
		this._caretOffset = this._baseOffset;
	}

	/**
	 * Update the content of the mirror
	 * Make selected letter in a span to get its position
	 */
	private _updateMirror() {
		if (this.editor.selectionStart > 0) {
			this._editorMirror.innerHTML =
				this.editor.value.slice(0, this.editor.selectionStart - 1) +
				`<span>${this.editor.value[this.editor.selectionStart - 1]}</span>` +
				this.editor.value.slice(this.editor.selectionStart);
		} else {
			this._editorMirror.innerHTML = "<span></span>" + this.editor.value;
		}
	}

	/**
	 * Update the caret's position
	 */
	private _updateCaret() {
		let selectedElement = <HTMLElement>this._editorMirror.children[0];
		this._caretOffset = {
			top:
				selectedElement.offsetTop +
				this._baseOffset.top -
				this.editor.scrollTop,
			left:
				selectedElement.offsetLeft +
				selectedElement.offsetWidth +
				this._baseOffset.left -
				this.editor.scrollLeft,
		};
		this._caret.setOffset(this._caretOffset);

		this._caret.setVisible();
		if (
			this._caretOffset.top - this._baseOffset.top < 0 ||
			this._caretOffset.top - this._baseOffset.top >=
				this._editorMirror.clientHeight
		) {
			this._caret.setHidden();
		}
	}

	update() {
		this._updateMirror();
		this._updateCaret();
	}

	/**
	 * @param className class's name
	 * Updating css when adding new class to the textarea
	 */
	addClass(className: string) {
		this.editor.classList.add(className);
		this.editorStyle = getComputedStyle(this.editor);
		copyCss(this._editorMirror, this.editorStyle);
	}

	/**
	 * @param className class's name
	 * Updating css when removing a class to the textarea
	 */
	removeClass(className: string) {
		this.editor.classList.remove(className);
		this.editorStyle = getComputedStyle(this.editor);
		copyCss(this._editorMirror, this.editorStyle);
	}

	/**
	 * @param className class's name
	 * Updating css when toggling a class to the textarea
	 */
	toggleClass(className: string) {
		this.editor.classList.toggle(className);
		this.editorStyle = getComputedStyle(this.editor);
		copyCss(this._editorMirror, this.editorStyle);
	}
}
