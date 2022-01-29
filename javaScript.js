let request;
let fpsInterval = 1000 / 15;
let then = Date.now();

let average = 0;
let canvas = document.getElementById("canvas")
let context = canvas.getContext("2d");


document.addEventListener("DOMContentLoaded", init, false);




function init () {
    main_element = document.querySelector("body");
    let button_elements = document.querySelectorAll("nav button");
    for (let b of button_elements) {
        b.addEventListener("click", fetch_content, false);
    }
    fetch_content(null);
    context.fillStyle = "black";
    context.fillRect(20, 20, canvas.width, canvas.height);
    context.fillStyle = "red";
    context.fillRect(50, 300-average, 20, 20);
    drawAll();
}

function fetch_content(event) {
    if (event == null) {
        button_id = gameRefresh;
    } else {
        button_id = event.target.id;
    }

    if (button_id === "game1") {
        drawAll()
        document.querySelector("canvas").style.display = "block";
    } else if (button_id === "username") {
        document.getElementById("title").innerHTML = "Choose your Username";
    } else if (button_id == "home"){
        document.getElementById("title").innerHTML = "";
        document.getElementById("underGame").innerHTML = "";
        document.querySelector("canvas").style.display = "none";
    }
    
}

function drawAll() {
    request = window.requestAnimationFrame(drawAll);
    context.clearRect(0,0,500,300);
    context.fillRect(50, 300-average, 20, 20);
}


navigator.mediaDevices.getUserMedia({
    audio: true
  })
    .then(function(stream) {
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      const microphone = audioContext.createMediaStreamSource(stream);
      const scriptProcessor = audioContext.createScriptProcessor(2048, 1, 1);
  
      analyser.smoothingTimeConstant = .8;
      analyser.fftSize = 1024;
  
      microphone.connect(analyser);
      analyser.connect(scriptProcessor);
      scriptProcessor.connect(audioContext.destination);
      scriptProcessor.onaudioprocess = function() {
        const array = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(array);
        const arraySum = array.reduce((a, value) => a + value, 0);
        average = arraySum / array.length;
        console.log(Math.round(average));


        //colorPids(average);
      };
    })
    .catch(function(err) {
      /* handle the error */
      console.error(err);
    });

