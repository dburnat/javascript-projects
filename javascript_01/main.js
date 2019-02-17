"use strict";

//file input handle
const fileInpt = document.querySelector('#file');
//filters slider handle
const brightnessSlider = document.querySelector('#brightness');
const saturationSlider = document.querySelector('#saturation');
const contrastSlider = document.querySelector('#contrast');
//canvas handle
const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');
const imageData = ctx.getImageData(0,0,500,300);
//init new img object
let img = new Image();

const imageBody = {
	['defaultImage'] : [],
	['displayedImage'] : []
}

fileInpt.onchange = function(event){ //Execute when file input change
	let files = event.target.files; // FileList object
	let file = files[0];	//handle to file
	let reader = new FileReader(); //New constructor

	reader.readAsDataURL(file); //How to read file
	reader.onload = function(event){ //waiting to load file
		img.src = event.target.result; //setting selected image to source
		
		img.onload = function(){
			ctx.drawImage(img,0,0); //drawing Img on canvas
			imageBody.defaultImage = ctx.getImageData(0,0,canvas.width  ,canvas.height);
			imageBody.displayedImage = ctx.getImageData(0,0,canvas.width,canvas.height);
		}
	}
}



brightnessSlider.oninput = function(){
	let imgData =imageBody.defaultImage;
	let data = imgData.data;
	let brightnessMultiplier = 1.4;

	let imgToManipulate = imageBody.displayedImage;
	let dataToDisplay = imgToManipulate.data;

	for(let i=0; i < data.length; i += 4){
		dataToDisplay[i] = data[i] + this.value * brightnessMultiplier;
		dataToDisplay[i+1] = data[i+1] + this.value* brightnessMultiplier;
		dataToDisplay[i+2] = data[i+2] +this.value* brightnessMultiplier;
	}

	ctx.putImageData(imgToManipulate, 0, 0);
}



saturationSlider.oninput = function(){
	canvas.style.filter = `saturate(${this.value *2}% )`;
}

contrastSlider.oninput = function(){
	let imgData = imageBody.defaultImage;
	let data = imgData.data;
	let contrastMultiplier = 0.35;

	let imgToManipulate = imageBody.displayedImage;
	let dataToDisplay = imgToManipulate.data;

	for (let i = 0; i < data.length; i += 4) {
		if (data[i] >= 128) {
			dataToDisplay[i] = data[i] + this.value * contrastMultiplier;
		}else{
			dataToDisplay[i] = data[i] - this.value * contrastMultiplier;
		}

		if (data[i+1] >= 128) {
			dataToDisplay[i+1] = data[i+1] + this.value * contrastMultiplier;
		}else{
			dataToDisplay[i+1] = data[i+1] - this.value * contrastMultiplier;
		}

		if (data[i+2] >= 128) {
			dataToDisplay[i+2] = data[i+2] + this.value * contrastMultiplier;
		}else{
			dataToDisplay[i+2] = data[i+2] - this.value * contrastMultiplier;
		}
	}

	ctx.putImageData(imgToManipulate, 0, 0);
}

//drawing

canvas.width = 500;
canvas.height = 300;

ctx.lineJoin = 'round';
ctx.lineCap = 'round';
ctx.lineWidth = 5;
ctx.strokeStyle = '#ac0000';

let isDrawing = false;
let lastX = 0;
let lastY = 0;


document.querySelectorAll('.tile')
      .forEach(input => input.addEventListener('click', function(e){
		let elem = e.target;
		let color = elem.style.backgroundColor;
		ctx.strokeStyle = color;
		console.log(color) // red
	  }));


function draw(e) {
  // stop the function if they are not mouse down
  if(!isDrawing) return;
  //listen for mouse move event
  console.log(e);
  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.stroke();
  [lastX, lastY] = [e.offsetX, e.offsetY];
}

function download() {
    var dt = canvas.toDataURL('image/jpeg');
    this.href = dt;
};

canvas.addEventListener('mousedown', (e) => {
	isDrawing = true;
	[lastX, lastY] = [e.offsetX, e.offsetY];
});

canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', () => isDrawing = false);
canvas.addEventListener('mouseout', () => isDrawing = false);
downloadLnk.addEventListener('click', download, false);

