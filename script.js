let start = document.getElementById('start'),
    stop = document.getElementById('stop'),
    mediaRecorder,
    preview = document.getElementById('preview'),
    mime = document.getElementById('mimetype-select');

const appendStatusNotification = actionType => {
    const notificationText = actionType === "start" ? "Started recording" : actionType === "stop" ? "Stopped recording" : "";
    let node = document.createElement("p");
    node.textContent = notificationText;
    document.body.appendChild(node);
}

start.addEventListener('click', async () => {
    let stream = await recordScreen();
    let mimeType = 'video/' + mime.value;

    mediaRecorder = createRecorder(stream, mimeType);
    preview.srcObject = stream;
    preview.captureStream = preview.captureStream || preview.mozCaptureStream;
    appendStatusNotification("start");
})

stop.addEventListener('click', () => {
    mediaRecorder.stop();
    preview.srcObject = null;
    appendStatusNotification("stop");
})

async function recordScreen() {
    return await navigator.mediaDevices.getDisplayMedia({
        audio: true,
        video: { mediaSource: "screen" }
    });
}

const createRecorder = (stream, mimeType) => {
    // the stream data is stored in this array
    let recordedChunks = [];
    const mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
            recordedChunks.push(e.data);
        }
    };
    mediaRecorder.onstop = () => {
        saveFile(recordedChunks);
        recordedChunks = [];
    };

    mediaRecorder.start(200); // For every 200ms the stream data will be stored in a separate chunk.
    return mediaRecorder;
}

const saveFile = (recordedChunks) => {
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

const getRandomString = (length) => {
    let randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for ( let i = 0; i < length; i++ ) {
        result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    return result;
}