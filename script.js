let start = document.getElementById('start'),
    stop = document.getElementById('stop'),
    mediaRecorder,
    preview = document.getElementById('preview'),
    mime = document.getElementById('mimetype-select');

start.addEventListener('click', async function () {
    let stream = await recordScreen();
    let mimeType = 'video/' + mime.value;
    mediaRecorder = createRecorder(stream, mimeType);

    preview.srcObject = stream;
    preview.captureStream = preview.captureStream || preview.mozCaptureStream;

    let node = document.createElement("p");
    node.textContent = "Started recording";
    document.body.appendChild(node);
})

stop.addEventListener('click', function () {
    mediaRecorder.stop();
    preview.srcObject = null;
    let node = document.createElement("p");
    node.textContent = "Stopped recording";
    document.body.appendChild(node);
})

async function recordScreen() {
    return await navigator.mediaDevices.getDisplayMedia({
        audio: true,
        video: { mediaSource: "screen" }
    });
}

function createRecorder(stream, mimeType) {
    // the stream data is stored in this array
    let recordedChunks = [];

    const mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = function (e) {
        if (e.data.size > 0) {
            recordedChunks.push(e.data);
        }
    };
    mediaRecorder.onstop = function () {
        saveFile(recordedChunks);
        recordedChunks = [];
    };
    mediaRecorder.start(200); // For every 200ms the stream data will be stored in a separate chunk.
    return mediaRecorder;
}

function saveFile(recordedChunks) {
    const blob = new Blob(recordedChunks, {
        type: 'video/' + mime.value
    });
    let filename = getRandomString(15);

    let downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = `${filename}.${mime.value}`;

    document.body.appendChild(downloadLink);
    downloadLink.click();
    URL.revokeObjectURL(blob); // clear from memory
    document.body.removeChild(downloadLink);
}

function getRandomString(length) {
    var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var result = '';
    for ( var i = 0; i < length; i++ ) {
        result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    return result;
}