let source;

let pieces = [];
let cols = 3;
let rows = 3;
let tiles = [];
let board = [];
let finished = false;
let canvas;



function preload() {
  let thumbnail = document.querySelector(".thumbnail");
  start = addToPanel("New Game");
  giveUp = addToPanel("Give Up");
  info = addToPanel("Help");
  let wrapper = document.querySelector("#wrapper");

  start.mousePressed(() => {
    fullscreen(true);
    newGame();
    wrapper.scrollIntoView();
  });

  giveUp.mousePressed(() => {
    finishPuzzle();
    wrapper.scrollIntoView();
  });

  info.addClass("info");
  info.mouseOver( () => {
    let element = document.querySelector(".info");
    let data = element.getBoundingClientRect();
    let { left, top} = data;
    thumbnail.style.left = left + 10 + "px";
    thumbnail.style.top = top + 25 + "px";
    thumbnail.style.visibility = "visible";
    thumbnail.style.opacity = "1";

  })

  info.mouseOut( () => {
   
    thumbnail.style.visibility = "hidden";
    thumbnail.style.opacity = "0";
  })


  source = loadImage("dexter.jpg");
}

function addToPanel(panelText) {
  panelElement = createDiv(panelText);
  panelElement.parent("panel");
  return panelElement;
}

function setup() {
  source.resize(0, displayHeight);
  canvas = createCanvas(source.width, source.height);
  canvas.parent("wrapper");

  w = width / cols;
  h = height / rows;
 
  canvas.hide();

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let x = i * w;
      let y = j * h;
      let img = createImage(w, h);
      let index = i + j * cols;
      board.push(index);
      img.copy(source, x, y, w, h, 0, 0, w, h);
      let tile = new Tile(index, img);
      tiles.push(tile);
    }
  }

  board.pop();
  tiles.pop();
  board.push(-1);
  simpleShuffle(board);
}

function finishPuzzle() {
 
  board = [];
  
  tiles.forEach((tile) => {
    board.push(tile.index);
  });
  console.log(tiles)
  board.push(-1);
  
  
}

function newGame() {

 let filtered = board.filter(tile =>  {return tile!= -1});
 shuffle(filtered,true)
 board = filtered;
 board.push(-1);
 let i = floor(Math.random() * 3);
 let j = floor(Math.random() * 3);
 console.log(i,' ',j);
 move(i, j, board);

}

function swap(i, j, arr) {
  let temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
}

function simpleShuffle(arr) {
  shuffle(arr, true);
 
}

function mousePressed() {
  let i = floor(mouseX / w);
  let j = floor(mouseY / h);
  move(i, j, board);
}

function move(i, j, arr) {
  let blank = findBlank();
  let blankCol = blank % cols;
  let blankRow = floor(blank / rows);

  if (isNeighbor(i, j, blankCol, blankRow)) {
    swap(blank, i + j * cols, arr);
  }
}

function isNeighbor(i, j, x, y) {
  if (i !== x && j !== y) {
    return false;
  }

  if (abs(i - x) == 1 || abs(j - y) == 1) {
    return true;
  }
  return false;
}

function findBlank() {
  for (let index = 0; index < board.length; index++) {
    const element = board[index];
    if (element == -1) return index;
  }
}

function draw() {
  if (!fullscreen()) {
    canvas.hide();
  } else {
    background("black");
    canvas.show();
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        let index = i + j * cols;
        let x = i * w;
        let y = j * h;
        let tilesIndex = [board[index]];
        if (tilesIndex > -1 ) {
          let img = tiles[tilesIndex].img;
          image(img, x, y, w, h);
          
        }
        noFill();
        rect(x, y, w, h);
      }
    }
  }
}
