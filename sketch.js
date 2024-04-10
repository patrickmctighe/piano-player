let notes = []; 
let markovChain = []; 
let lastNote = 0; 
let playedNotes = new Array(24).fill(false); 


let noteDuration = 0.5; 
let volumeDecayRate = 0.02; 


let noteNames = [ "A", "AS", "B", "C", "CS", "D", "DS", "E", "F", "FS", "G", "GS", "a", "as", "b", "c", "cs", "d", "ds", "e", "f", "fs", "g", "gs"];

function preload() {
  for (let i = 0; i < 24; i++) {
    let noteName = noteNames[i];
    notes[i] = loadSound(`notes/${noteName}.mp3`);
    markovChain[i] = [];
    for (let j = 0; j < 24; j++) {
      
      markovChain[i][j] = 1 / 24;

     
      if ((j - i + 24) % 24 === 7 || (j - i + 24) % 24 === 4) {
        markovChain[i][j] = 1 / 8;
      }
    }

   
    let sum = markovChain[i].reduce((a, b) => a + b, 0);
    for (let j = 0; j < 24; j++) {
      markovChain[i][j] /= sum;
    }
  }
}

function setup() {
  createCanvas(400, 400);
  let button = createButton('start');
  button.mousePressed(startAudio);


  let stopButton = createButton('stop');
  stopButton.mousePressed(stopAudio);
}

function startAudio() {
  if (getAudioContext().state !== 'running') {
    getAudioContext().resume();
  }
}


function stopAudio() {
  if (getAudioContext().state !== 'suspended') {
    getAudioContext().suspend();
  }
}

function playRandomNote() {

  let probabilities = markovChain[lastNote];
  let noteIndex = findRandom(probabilities);
  let note = notes[noteIndex];

 
  let volume = randomGaussian(0.7, 0.2);
  volume = constrain(volume, 0, 1); 
  note.setVolume(volume);

  note.play();
  lastNote = noteIndex;

 
  playedNotes[noteIndex] = true;

 
  let uniqueNotesPlayed = playedNotes.filter(note => note).length;
  console.log(`Number of unique notes played: ${uniqueNotesPlayed}${noteNames[noteIndex]}`);

}

function findRandom(probabilities) {
  let sum = 0;
  let r = random();
  for (let i = 0; i < probabilities.length; i++) {
    sum += probabilities[i];
    if (r < sum) return i;
  }
}

function draw() {
  background(220);

  for (let i = 0; i < playedNotes.length; i++) {
    if (playedNotes[i]) {
      let y = map(i, 0, playedNotes.length, height, 0); 
      ellipse(width / 2, y, 50); 
    }
  }
 
  if (random() < 0.03) { 
    playRandomNote();
  }
}