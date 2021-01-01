async function init() {
	const videoGrid = document.getElementById("video-grid");

	var socket = io();

	var peer = new Peer();

	peer.on("open", (USER_ID) => {
		socket.emit("join-room", ROOM_ID, USER_ID);
	});

	var videoElement = document.createElement("video");

	videoElement.style.cssText = "transform: scale(-1, 1); filter: FlipH;";

	try {
		var stream = await navigator.mediaDevices.getUserMedia({
			video: true,
			audio: true,
		});
		addVideoStream(videoElement, stream);

		peer.on("call", (call) => {
			call.answer(stream);

			const video = document.createElement("video");
			call.on("stream", (otherUserVideoStream) => {
				addVideoStream(video, otherUserVideoStream);
			});

			call.on("close", () => {
				video.remove();
			});
		});

		socket.on("user-connected", (userID) => {
			connectToNewUser(userID, stream);
		});
	} catch (error) {
		console.error("Error accessing media devices.", error);
	}

	function addVideoStream(video, stream) {
		video.srcObject = stream;
		video.addEventListener("loadedmetadata", () => {
			video.play();
		});
		videoGrid.append(video);
	}

	function connectToNewUser(userID, stream) {
		const call = peer.call(userID, stream);
		const video = document.createElement("video");
		call.on("stream", (userVideoStream) => {
			addVideoStream(video, userVideoStream);
		});

		call.on("close", () => {
			video.remove();
		});
	}
}

window.onload = init;
