screen = {
  width: 700,
  height: 700,
};

/*****************/
/* MENU SECTION */
/****************/

menu = {
  inputButton1: {
    button: null,
    inputBox: null,
    type: "inputButton",
    text: "Resize",
    pos: {x: 10, y: 10},
    onMousePressed: function(){
      playing = false;
      button.html("Play");
      inputBox.value(matchNumericString(inputBox.value(), 4, 160, 120));
      grid = new Grid(parseInt(inputBox.value()));
      nextGrid = new Grid(parseInt(inputBox.value()));
      grid.flushDraw();
    }
  },

  button1: {
    button: null,
    type: "button",
    text: "Randomize",
    pos: {x: 10, y: 40},
    onMousePressed: function(){
      grid.randomizeCells();
      nextGrid.copyCells(grid);
      grid.drawAll();
    }
  },

  button2: {
    button: null,
    type: "button",
    text: "Clear",
    pos: {x: 10, y: 70},
    onMousePressed: function(){
      grid.clearCells();
      nextGrid.clearCells();
      grid.flushDraw();
    }
  },

  button3: {
    button: null,
    type: "button",
    text: "Play",
    pos: {x: 10, y: 100},
    onMousePressed: function(){
      togglePlay();
    }
  },
}

function createMenu(){
  for(let key in menu){
    let menuItem = menu[key];
    if(menuItem.type=="button"){
      button = createButton(menuItem.text);
      button.position(menuItem.pos.x, menuItem.pos.y);
      button.mousePressed(menuItem.onMousePressed);
      button.size(88);
      menuItem.button = button;
    }
    if(menuItem.type=="inputButton"){
      inputBox = createInput(grid.size.toString());
      inputBox.position(menuItem.pos.x, menuItem.pos.y);
      inputBox.size(35);
      menuItem.inputBox = inputBox;
      button = createButton(menuItem.text);
      button.position(menuItem.pos.x+inputBox.width, menuItem.pos.y);
      button.mousePressed(menuItem.onMousePressed);
      button.size(55);
      menuItem.button = button;
    }
  }
}

function matchNumericString(str, min, max, defaultValue) {
  /* Given an alphanumeric input, returns the matched numeric string clamped to (min, max) */

  matched = defaultValue;
  try{
    numstring = str.match(/[0-9]/g).join("");
    matched = Math.min(Math.max(parseInt(numstring), min), max);
  }
  catch(err){
  }
  return matched;
}

/****************/
/* GRID SECTION */
/****************/

class Grid {
  constructor(size){
    this.size = size
    this.cells = Array(size).fill().map(()=>Array(size).fill(0))
  }
  
  isAlive(i,j){
    return this.cells[mod(i,this.size)][mod(j,this.size)]==1;
  }
  
  flushDraw(){
    /* draws the grid with deadColor in the current frame buffer */
    let deadColor = color(65);

    //noStroke();
    strokeWeight(0.4);

    let width = screen.width
    let height = screen.height
    let size = this.size
    
    for(let i=0; i < size; i++){
      for(let j=0; j < size; j++){
        let c = deadColor;
        fill(c)
        square(j*width/size, i*height/size, width/size)
      }
    }
  }
  
  countNeighbors(i,j){
    let count = 0;
    if(this.isAlive(i-1,j-1)) count++;
    if(this.isAlive(i-1,j)) count++;
    if(this.isAlive(i-1,j+1)) count++;
    if(this.isAlive(i,j-1)) count++;
    if(this.isAlive(i,j+1)) count++;
    if(this.isAlive(i+1,j-1)) count++;
    if(this.isAlive(i+1,j)) count++;
    if(this.isAlive(i+1,j+1)) count++;
    return count;
  }
  
  randomizeCells(){
    for(let i=0; i< this.size; i++)
      for(let j=0; j< this.size; j++)
        this.cells[i][j] = Math.round(Math.random());
  }
  
  clearCells(){
    for(let i=0; i< this.size; i++)
      for(let j=0; j< this.size; j++)
        this.cells[i][j] = 0;
  }
  
  copyCells(other){
    for (var i = 0; i < this.size; i++)
      this.cells[i] = other.cells[i].slice();
  }
  
  killCell(i,j){
    this.cells[i][j] = 0;
  }
  
  reviveCell(i,j){
    this.cells[i][j] = 1;
  }
  
  draw(){
    /* draws evert cell that is different from nextCell */
    let deadColor = color(65);
    let aliveColor = color(255, 204, 0);

    //noStroke();
    strokeWeight(0.4);

    let width = screen.width
    let height = screen.height
    let size = this.size

    for(let i=0; i < size; i++){
      for(let j=0; j < size; j++){
        if(nextGrid.cells[i][j] != grid.cells[i][j]){
          let isAlive = nextGrid.isAlive(i, j);
          let c = isAlive ? aliveColor : deadColor;
          fill(c)
          square(j*width/size, i*height/size, width/size)
        }
      }
    }
  }

  drawCell(i,j){
    /* given i and j, draws cell */
    let deadColor = color(65);
    let aliveColor = color(255, 204, 0);

    strokeWeight(0.4);

    let width = screen.width
    let height = screen.height
    let size = this.size

    let isAlive = nextGrid.isAlive(i, j);
    let c = isAlive ? aliveColor : deadColor;
    fill(c)
    square(j*width/size, i*height/size, width/size)
  }
  
  drawAll(){
    /* draws every cell in the grid. Might be too expensive to be called in every frame */
    let deadColor = color(65);
    let aliveColor = color(255, 204, 0);

    //noStroke();
    strokeWeight(0.4);

    let width = screen.width
    let height = screen.height
    let size = this.size

    for(let i=0; i < size; i++){
      for(let j=0; j < size; j++){
        let isAlive = nextGrid.isAlive(i, j);
        let c = isAlive ? aliveColor : deadColor;
        fill(c)
        square(j*width/size, i*height/size, width/size)
      }
    }
  }
}

function mod(a,b) {
  return (b+(a%b))%b;
}

function nextStep(){
  /* Main Logic from Conway's Game of Life */
  for(let i=0; i < grid.size; i++){
    for(let j=0; j < grid.size; j++){
      let nNeighbors = grid.countNeighbors(i,j);
      if(grid.isAlive(i,j)){
        if(nNeighbors<2 || nNeighbors>3)
          nextGrid.killCell(i,j);
      }
      else if(nNeighbors == 3)
        nextGrid.reviveCell(i,j);
    }
  }
}

function togglePlay(){
  playing = !playing;
  if(playing) button.html("Pause");
  else button.html("Play");
}

grid = new Grid(120);
nextGrid = new Grid(120);
playing = false;

function setup() {
  createCanvas(screen.width, screen.height);
  createMenu()
  grid.flushDraw()
  //grid.randomizeCells();
  nextGrid.copyCells(grid);
}

/* Paints the grid using mouse input */
function paint(){
  if(mouseIsPressed){
    if(mouseX > 0 && mouseX < screen.width &&
      mouseY > 0 && mouseY < screen.height){
      let i = Math.floor(mouseY/(screen.height/grid.size));
      let j = Math.floor(mouseX/(screen.width/grid.size));
      if(mouseButton === LEFT){
        grid.cells[i][j] = 1;
        nextGrid.cells[i][j] = 1;
      }
      if(mouseButton === RIGHT){
        grid.cells[i][j] = 0;
        nextGrid.cells[i][j] = 0;
      }
      grid.drawCell(i,j);
    }
  }
}

/* Main Loop */
function draw() {
  paint();

  if(playing){
    nextStep();
    grid.draw();
    grid.copyCells(nextGrid);
  }
  else grid.draw();
  
  fill(0)
  rect(screen.width-65, 15, 60, 20)
  fill(255, 30, 30)
  text("FPS:  " + 
       int(getFrameRate()), screen.width-60, 30);
}