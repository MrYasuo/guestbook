import { Editor } from './editor';
import SignaturePad from 'signature_pad';

const zoom: HTMLElement = 
	<HTMLElement>document.getElementById("book");
const coverRight: HTMLCollectionOf<HTMLElement> = 
	<HTMLCollectionOf<HTMLElement>>document.getElementsByClassName("cover_back_right");
const transformLayer: HTMLCollectionOf<HTMLElement> = 
	<HTMLCollectionOf<HTMLElement>>document.getElementsByClassName("layer5");
const fadedLayer: HTMLCollectionOf<HTMLElement> = 
	<HTMLCollectionOf<HTMLElement>>document.getElementsByClassName("layerStatic");
const closePageBook: HTMLCollectionOf<HTMLElement> = 
	<HTMLCollectionOf<HTMLElement>>document.getElementsByClassName("layer5_left");
const flatPageBook: HTMLCollectionOf<HTMLElement> = 
	<HTMLCollectionOf<HTMLElement>>document.getElementsByClassName("layer5_right");
const coverLeft: HTMLCollectionOf<HTMLElement> = 
	<HTMLCollectionOf<HTMLElement>>document.getElementsByClassName("cover_back_left");
const button: HTMLButtonElement = 
	<HTMLButtonElement>document.getElementById("btn");
const openButton: HTMLButtonElement = 
	<HTMLButtonElement>document.getElementById("btn--open");
const leftSide: HTMLElement = 
	<HTMLElement>document.getElementById("left_side");
const mid: HTMLCollectionOf<HTMLElement> = 
	<HTMLCollectionOf<HTMLElement>>document.getElementsByClassName("cover_back_mid");
const rightSide: HTMLElement = 
	<HTMLElement>document.getElementById("right_side");
// Setting up smooth editor
const editor = new Editor(<HTMLTextAreaElement>document.getElementById('input'));
// Setting up signaturePad
const signaturePadCanvas = document.getElementById("signature-pad");
if (window.innerWidth <= 500 || window.innerHeight <= 320) {
	signaturePadCanvas.width = 180;
	signaturePadCanvas.height = 200;
	signaturePadCanvas.style.left = "-45px";
	signaturePadCanvas.style.top = "-50px";
}
const signaturePad = new SignaturePad(signaturePadCanvas, {
	backgroundColor: 'rgba(255, 255, 255, 0)',
	penColor: '#613f0b'
});
// Turn off signature pad
// If not restart signaturePad after scale(2)
// The drawing will be off
signaturePad.off();

const signaturePadPlaceHolderCtx = document.getElementById("signature-pad--placeholder").getContext("2d");
const drawingSignaturePadPlaceHolder = (placeholder: string) => {
	signaturePadPlaceHolderCtx.fillStyle = "#8c846f";
	signaturePadPlaceHolderCtx.font = `${editor.editorStyle.fontSize.slice(0, -2) * 2}px ${editor.editorStyle.fontFamily}`;
	signaturePadPlaceHolderCtx.textAlign = "center";
	signaturePadPlaceHolderCtx.textBaseline = "middle";
	// Fixed width: 360, height: 400
	signaturePadPlaceHolderCtx.fillText(placeholder, editor.editorStyle.paddingLeft.slice(0, -2) * 2 + signaturePadPlaceHolderCtx.measureText(placeholder).width / 2, editor.editorStyle.paddingTop.slice(0, -2) * 2 + editor.editorStyle.fontSize.slice(0, -2) * 1);
}

// Clear button of the signaturePad
const clearButton = document.getElementById("clear-btn");
clearButton.addEventListener('click', () => {
	signaturePad.clear();
});
// Checking open's state for re-opening
let openState = 0;

// Sending data to backend
const postData = async (url = '', data = {}) => {
	console.log(data);
  const response = await fetch(url, {
    method: 'POST',
		mode: 'cors', 
    cache: 'no-cache', 
    credentials: 'same-origin', 
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}

zoom.addEventListener("click", () => {
	zoomOut();
	transformCover();
	signaturePad.on();
	clearButton.style.visibility = "visible";
	if (signaturePad.isEmpty()) drawingSignaturePadPlaceHolder("Please sign here...");
	else {
		signaturePadPlaceHolderCtx.clearRect(0, 0, 360, 400);
	}
	staticLayer();
	button.disabled = ((editor.editor.value === '') || signaturePad.isEmpty())
});

const zoomOut = () => zoom.style.transform = "scale(2)"

const transformCover = () => {
	coverLeft[0].setAttribute("style", "transform: none;");
	coverRight[0].setAttribute("style", "transform: none;");
};

const staticLayer = () => {
	transformLayer[0].style.transform = "translate3d(0px, 0px, 20px) rotateY(0deg)";
	transformLayer[0].style.borderRight = "none";
	transformLayer[0].style.boxShadow = "none";
	transformLayer[1].style.transform = "translate3d(0px, 0px, 20px) rotateY(0deg)";
	transformLayer[1].style.borderRight = "none";
	transformLayer[1].style.boxShadow = "none";
	fadedLayer[0].style.transform = "translate3d(0px, 0px, 0px) rotateY(0deg)";
	fadedLayer[1].style.transform = "translate3d(0px, 0px, 5px) rotateY(0deg)";
	fadedLayer[2].style.transform = "translate3d(0px, 0px, 10px) rotateY(0deg)";
	fadedLayer[3].style.transform = "translate3d(0px, 0px, 15px) rotateY(0deg)";
	fadedLayer[4].style.transform = "translate3d(0px, 0px, 0px) rotateY(0deg)";
	fadedLayer[5].style.transform = "translate3d(0px, 0px, 5px) rotateY(0deg)";
	fadedLayer[6].style.transform = "translate3d(0px, 0px, 10px) rotateY(0deg)";
	fadedLayer[7].style.transform = "translate3d(0px, 0px, 15px) rotateY(0deg)";
	setTimeout(() => {
		transformLayer[1].classList.add("zoomLayer5");
	}, 1500);
};

button.addEventListener('click', () => {
	close();
	console.log(editor.editor.value);
	postData('/', {
		'message': editor.editor.value,
		'imange': signaturePad.toDataURL(),
	})
	.catch(console.error);
});

openButton.addEventListener('click', () => close());

button.disabled = ((editor.editor.value === '') || signaturePad.isEmpty());

editor.editor.addEventListener('input', () => button.disabled = ((editor.editor.value === '') || signaturePad.isEmpty()));

const close = () => {
	closePageBook[0].classList.add("zoomOver");
	closeBook();
};

const closeBook = () => {
	for (let i = 0; i < fadedLayer.length; i++)
		fadedLayer[i].classList.add("layer-hidden");
	leftSide.classList.toggle("turn");
	mid[0].classList.toggle("turn_mid");
	if (openState === 0) {
		transformLayer[1].classList.remove("unShow");
		transformLayer[1].classList.add("showUp");
		openState = 1;
	} else {
		transformLayer[1].classList.remove("showUp");
		transformLayer[1].classList.add("unShow");
		openState = 0;
	}
	setTimeout(function () {
		closePageBook[0].classList.add("return_static");
	}, 2500);
};

window.addEventListener('resize', () => {
	if (window.innerWidth <= 500 || window.innerHeight <= 320) {
		transformLayer[1].classList.remove("unShow");
		transformLayer[1].classList.add("keepStatic");
		mid[0].classList.add("keepMid");
		signaturePadCanvas.width = 180;
		signaturePadCanvas.height = 200;
		signaturePadCanvas.style.left = "-45px";
		signaturePadCanvas.style.top = "-50px";
	}
	else {
		transformLayer[1].classList.remove("unShow");
		transformLayer[1].classList.add("keepStatic");
		mid[0].classList.add("keepMid");
		signaturePadCanvas.width = 360;
		signaturePadCanvas.height = 400;
		signaturePadCanvas.style.left = "-90px";
		signaturePadCanvas.style.top = "-100px";
	}
});

export {};
