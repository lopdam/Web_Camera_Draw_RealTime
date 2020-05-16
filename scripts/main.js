let video = document.getElementById("video");

let canvas = document.getElementById("canvas");

const context = canvas.getContext("2d");

let lentes = new Image();

let imageLoaded = false;

lentes.src = "./images/lentes.png";

lentes.onload = function () {
	imageLoaded = true;
};

let boca = new Image();

let imagebocaLoaded = false;

boca.src = "./images/candy.png";

boca.onload = function () {
	imagebocaLoaded = true;
};

//
/*

	ChannelCount=>{ideal:10, exact:10}
			latency
	SampleRate
	Volume
			         */
/*
	const contraints={
	audio:{
	channelCount:{ideal:10, exact:10},
	sampleRate:{

	},
	volume:{},
	echoCancellation:true
	},
	video:{
	frameRate:{ideal:10},
	aspectRatio:{
	},
	facingMode:"user"

}
	}*/

function start(deviceKey = undefined) {
	const contraints = {
		audio: {},
		video: {
			deviceId: deviceKey,
		},
	};

	//MediaTrackConstraints
	navigator.mediaDevices
		.getUserMedia(contraints)
		.then((stream) => {
			console.log(stream);
			video.srcObject = stream;
			setTimeout(function () {
				ctracker.start(video);
				requestAnimationFrame(loop);
			}, 500);
		})
		.catch((err) => console.log(err));
	return;
}

let selecTag = document.getElementById("camera-selector");

const ctracker = new clm.tracker();
ctracker.init(pModel);

navigator.mediaDevices.enumerateDevices().then((devices) => {
	devices.forEach((device) => {
		if (device.kind != "videoinput") {
			return;
		}
		let optionTag = document.createElement("option");

		optionTag.innerHTML = device.label;

		optionTag.value = device.deviceId;

		selecTag.appendChild(optionTag);
	});
});

selecTag.addEventListener("change", function (ev) {
	let deviceID = this.options[this.seletedIndex].value;

	start(deviceID);
});

function drawImageRealTime(imagen, positions) {
	if (
		positions.x.final != null &&
		positions.x.init != null &&
		positions.y.final != null &&
		positions.y.init != null
	) {
		let w = positions.x.final[0] - positions.x.init[0];

		let h = positions.y.final[1] - positions.y.init[1];

		context.drawImage(imagen, positions.x.init[0], positions.y.init[1], w, h);
	}
}
function drawImageBocaRealTime(imagen, positions) {
	if (positions.pos.init != null) {
		let w = 50;

		let h = 100;

		context.drawImage(
			imagen,
			positions.pos.init[0],
			positions.pos.init[1],
			w,
			h
		);
	}
}

function loop() {
	context.drawImage(video, 0, 0, 800, 600);
	ctracker.draw(canvas);

	let positions = ctracker.getCurrentPosition();

	if (imageLoaded) {
		drawImageRealTime(lentes, {
			x: {
				init: positions[0],
				final: positions[14],
			},

			y: {
				init: positions[33],
				final: positions[41],
			},
		});
	}

	if (imagebocaLoaded) {
		drawImageBocaRealTime(boca, {
			pos: {
				init: positions[61],
			},
		});
	}

	requestAnimationFrame(loop);
}

start();
