let zoom = document.getElementById("book");
let coverRight = document.getElementsByClassName("cover_back_right");
let transformLayer = document.getElementsByClassName("layer5");
let fadedLayer = document.getElementsByClassName("layerStatic");
let closePageBook = document.getElementsByClassName("layer5_left");
let coverLeft = document.getElementsByClassName("cover_back_left");
let button = document.getElementById("btn");

zoom.onclick = function() {
	zoomOut();
	transformCover();
	staticLayer();
};

let zoomOut = () => {
	zoom.style.transform = "scale(2, 2)";
};

let transformCover = () => {
	coverLeft[0].setAttribute("style", "transform: none;");
	coverRight[0].setAttribute("style", "transform: none;");
};

let staticLayer = () => {
	transformLayer[0].setAttribute(
		"style",
		"transform: translate3d(14px, 0px, 20px) rotateY(0deg); border-right: none; box-shadow: none;"
	);
	transformLayer[1].setAttribute(
		"style",
		"transform: translate3d(-14px, 0px, 20px) rotateY(0deg); border-left: none; box-shadow: none;"
	);
	fadedLayer[0].setAttribute(
		"style",
		"transform: translate3d(6px, 0px, 0px) rotateY(0deg)"
	);
	fadedLayer[1].setAttribute(
		"style",
		"transform: translate3d(-6px, 0px, 0px) rotateY(0deg)"
	);
	fadedLayer[2].setAttribute(
		"style",
		"transform: translate3d(10px, 0px, 5px) rotateY(0deg)"
	);
	fadedLayer[3].setAttribute(
		"style",
		"transform: translate3d(-10px, 0px, 5px) rotateY(0deg)"
	);
	fadedLayer[4].setAttribute(
		"style",
		"transform: translate3d(12px, 0px, 10px) rotateY(0deg)"
	);
	fadedLayer[5].setAttribute(
		"style",
		"transform: translate3d(-12px, 0px, 10px) rotateY(0deg)"
	);
	fadedLayer[6].setAttribute(
		"style",
		"transform: translate3d(13px, 0px, 15px) rotateY(0deg)"
	);
	fadedLayer[7].setAttribute(
		"style",
		"transform: translate3d(-13px, 0px, 15px) rotateY(0deg)"
	);
};

button.onclick = () => close();

let close = () => {
	closePageBook[0].classList.add("zoomOver");
	closeBook();
};

function closeBook() {
	transformCover = function() {
		coverLeft[0].setAttribute("style", "transform: rotateY(180deg); transform-origin: right;");
	}
	transformCover();
	for (let i = 0; i < fadedLayer.length; i++) fadedLayer[i].classList.add("hideLayer");
	// closePageBook[0].setAttribute("style", "transform: rotateY(180deg)");
	closePageBook[0].classList.add('flipRight');;
};
