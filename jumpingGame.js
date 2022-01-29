let request;
let fpsInterval = 1000 / 15;
let then = Date.now();

let playerImage = new Image();

let average = 0;
let canvas = document.getElementById("canvas")
let context = canvas.getContext("2d");

let jumpcount = 0;
let clicks = 0;

playerImage.src = "running.png";

let player = {
  x: 50,
  y: 200,
  height: 65,
  width: 65,
  frameX: 7,
  frameY: 0,
  xChange: 0,
  yChange: 0,
  health: 100,
  state: "running",
  up: 50,

};

document.addEventListener("DOMContentLoaded", init, false);


function init () {
    context.fillStyle = "lightblue";
    drawAll();
}


function drawAll() {

    request = window.requestAnimationFrame(drawAll);
    let now = Date.now();
    let elapsed = now - then;
    if (elapsed <= fpsInterval) {
        return;
    };
    then = now - (elapsed % fpsInterval);
    
    context.clearRect(0,0,512,320);
    context.fillRect(50, 300-average, 20, 20);
    context.fillRect(0, 0, 512, 320);
    if (player.health >0) {

      
      if(player.state == "running"){
        player.frameX = (player.frameX + 1) % 8;
        context.drawImage(playerImage,
        player.width * player.frameX, player.height * player.frameY,
        player.width, player.height,
        player.x, player.y, player.width, player.height);
      } else {
        player.y -= player.up
        player.up -= 10
        if (player.y > canvas.height){
            console.log(player.y)
            player.y = 400;
            player.up = 50;
        }
        player.frameX = (player.frameX + 1) % 8;
        //console.log("frameX", player.frameX)
        playerImage.src = "jumping.png";
        context.drawImage(playerImage,
        player.width * player.frameX, player.height * player.frameY,
        player.width-19, player.height,
        player.x, player.y, player.width-19, player.height/2);// source x of tc, sorcey of tc , source width, source height , dest x, dest y, destwidth, destheight
        if (player.frameX == 6){
        player.state = "running";
        player.width = 65
        player.frameX = 0;
        player.frameY = 0;
        player.height = 65;
        playerImage.src = "running.png";
        player.up = 50
        }
      }
      if (average > 40) {
        // checking if the average is greater than 100 and then swithching the source to 100
        player.state = "jumping";
        player.width = 80
        player.frameX = 0;
        player.frameY = 0;
        player.height = 144;
      }

    }

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
        //console.log(Math.round(average));


        //colorPids(average);
      };
    })
    .catch(function(err) {
      /* handle the error */
      console.error(err);
    });