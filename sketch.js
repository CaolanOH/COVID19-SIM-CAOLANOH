let molecules = [];
let grid = [];
let graphArray = [];
let graphHeight = 210;
let colWidth, rowHeight;
let checkNum = 0;
let healthy;
let infected;
let timer = 1000;

let numberOfInfected;
let numberOfHealthy;
let numberOfImmune;
let numberOfVaccinator;

// The function setup defines the enviroment properties before the program starts.
// The canvas size is defined. molecule objects are created and pushed into an array call molecules.
// No parameters are required to fulfil this function and no returns
function setup() {
  createCanvas(1000, 1000);
  colWidth = width / obj.numCols;
  rowHeight = height / obj.numRows;
  molecules = [];


  for (let i = 0; i < obj.numOfMolecules; i++) {
    let randomNum = random();
    if(i < obj.numberOfVaccintors){
      molecules.push(new Vaccinator({
        _i:i,
        vx: (-5,5),
        vy: (-5,5)
      }));
    }else if (randomNum < obj.percentOfInfected) {
      molecules.push(new Infected({
        _i: i
      }));
    } else {
      molecules.push(new Healthy({
        _i: i
      }));
    }
  }




  gridify();
  checkLoop();
}

// The function draw continuously executes lines of code contained inside until program is ended.
// This function sets the background color. Iterates through the molecules array and renders each molecule
// and applies step. Iterates through the molecules array to reset molecule color.
// No parameters are required to fulfil this function and no returns
function draw() {

  background(238);

  

  immunity();


  splitObjectIntoGrid();

  obj.gridState ? drawGrid() : null;


  molecules.forEach((molecule) => {
    molecule.render();
    molecule.step();

  });




  drawgraph();

}

// The function checkIntersections checks if two molecules are intersecting. It takes in in one
// parameter(_collection) which is an array of molecules. It uses a nested loop to iterate
// through the array and splits the array into moleculeA(a) and moleculeB(b). If lineState(gui) is
// true a line is draw between the molecules in moleculeA and moleculeB. Inside an if statement the function
// isIntersecting is called and moleculeB is passed as a parameter to measure the distance between moleculeA and moleculeB.
// if the statement is true another if else statement checks if the moleculeA is infected or healthy and then the inverse of that condidtion.
// If the molecule is healthy and intersects an infected then it is replaced with an infected. The second else if checks if a Healthy objects
// intersects with a Vaccinator. If a Vaccinator touches a Healthy object it is replaced with a new Immune object
function checkIntersections(_collection) {

  for (let a = 0; a < _collection.length; a++) {
    for (let b = a + 1; b < _collection.length; b++) {
      let moleculeA = molecules[_collection[a]];
      let moleculeB = molecules[_collection[b]];
      if (obj.lineState) {
        stroke(125, 100);
        line(moleculeA.position.x, moleculeA.position.y, moleculeB.position.x, moleculeB.position.y);
      };
      if (moleculeA.isIntersecting(moleculeB)) {
        moleculeA.dock(moleculeB);

        if (moleculeA.constructor.name == "Infected" && moleculeB.constructor.name == "Healthy") {
          let randomNum = random();
          if (randomNum < obj.rateOfInfection) {
            let tempObj = new Infected({
              _i: moleculeB.index,
              px: moleculeB.position.x,
              py: moleculeB.position.y,
              vx: moleculeB.velocity.x,
              vy: moleculeB.velocity.y
            });
            //console.log(tempObj);
            molecules[moleculeB.index] = tempObj;
          }
        } else if (moleculeB.constructor.name == "Infected" && moleculeA.constructor.name == "Healthy") {
    moleculeB.dock(moleculeA);
          let randomNum = random();
          if (randomNum < obj.rateOfInfection) {
            let tempObj = new Infected({
              _i: moleculeA.index,
              px: moleculeA.position.x,
              py: moleculeA.position.y,
              vx: moleculeA.velocity.x,
              vy: moleculeA.velocity.y
            });
            //console.log(tempObj);
            molecules[moleculeA.index] = tempObj;
          }
        } else if(moleculeA.constructor.name == "Vaccinator" && moleculeB.constructor.name == "Healthy"){

              moleculeA.dock(moleculeB);
              let randomNum = random();
              if (randomNum < obj.rateOfVaccine) {
                let tempObj = new Immune({
                  _i: moleculeB.index,
                  px: moleculeB.position.x,
                  py: moleculeB.position.y,
                  vx: moleculeB.velocity.x,
                  vy: moleculeB.velocity.y
                });
                //console.log(tempObj);
                molecules[moleculeB.index] = tempObj;

}
      }
    }

    }
  }

}

// The function splitObjectIntoGrid uses a nested loop to iterate through numRows(j) and numCol(i).
//the molecule positions of each molecule in the molecules array are filter and the the indexes of those molecules are
// mapped to a new array called moleculeCollection. The function checkIntersections is called and moleculeCollection
// is passed through as a parameter. No parameters are required to fulfil this function and no returns
function splitObjectIntoGrid() {
  checkNum = 0;

  for (let j = 0; j < obj.numRows; j++) {
    for (let i = 0; i < obj.numCols; i++) {

      let moleculeCollection = molecules.filter(molecule =>
        molecule.position.x > (i * colWidth) &&
        molecule.position.x < ((i + 1) * colWidth) &&
        molecule.position.y > j * rowHeight &&
        molecule.position.y < (j + 1) * rowHeight
      ).map(molecule => molecule.index);


      checkIntersections(moleculeCollection);
    }
  }

}

// This function gridify equally spaces out a molecules x and y posistion so they are not touching
// when first drawn in the draw function. numDivision calculates the number of rows and cols needed.
// spacing calculate the spacings between each molecule. a loop iterates through the molecules array and takes
// each molecules index. colPos calculates the position of the molecule within a column and spaces across the canvas
// rowPos calculates the position of the molecule within a row and spaces down the canvas. Each molecules x positions
// is assigned colPos and y position assigned rowPos. No parameters required to fulfil the function and no returns
function gridify() {
  // number rows and cols necessary based on square root of numOfmolecules
  // ceil rounsd number up to nearest whole number
  let numDivision = ceil(Math.sqrt(obj.numOfMolecules));

  let spacingY = (width - (obj.maxMoleculeSize * 2)) / numDivision;
  let spacingX = (height - graphHeight - (obj.maxMoleculeSize * 2)) / numDivision;

  molecules.forEach((molecule, index) => {

    let colPos = (index % numDivision) * spacingY;
    let rowPos = floor(index / numDivision) * spacingX;
    //console.log(`The col pos ${colPos} and the row pos ${rowPos}`);
    molecule.position.x = colPos + (obj.maxMoleculeSize);
    molecule.position.y = rowPos + (obj.maxMoleculeSize);

  });
}

// This function drawGraph() displays information from the program. The number of Healthy, Infected, Immune and Vaccinated are
// filtered and assigned to their own variables. All classes have their graph heights mapped a new variables respective of the
// amount molecules set in obj.numOfMolecules. A grey rectangle is drawn as a back drop to display the information on.
// The number of Healthy, Infected, Immune and Vaccinators Objects are displayed using the textAlign(), textFont
// and textSize() p5 menthods. The .shift array function removes the first element of the graphArray after it has displayed.
// Objects containing the Healthy, Infected, Immune and Vaccinators height are pushed into the graphArray. Using a forEach loop
// The graphArray heights and indexes used to draw the draph using the p5 rect function.
function drawgraph() {

  let numInfected = molecules.filter(molecule => molecule.constructor.name == "Infected");
  let numHealthy = molecules.filter(molecule => molecule.constructor.name == "Healthy");
  let numImmune = molecules.filter(molecule => molecule.constructor.name == "Immune");
  let numVaccinator = molecules.filter(molecule => molecule.constructor.name == "Vaccinator");
  infectedHeight = map(numInfected.length, 0, obj.numOfMolecules, 0, graphHeight);
  healthyHeight = map(numHealthy.length, 0, obj.numOfMolecules, 0, graphHeight);
  immuneHeight = map(numImmune.length, 0, obj.numOfMolecules, 0, graphHeight);

  fill(153);
  rect(0, 800, 1000, 200);
  textAlign(LEFT);
  fill(0);
  textSize(24);
  textFont("Open Sans");
  text(`Number of Healthy : ${numHealthy.length}`, 10, 820);
  textAlign(LEFT);
  fill(0);
  textSize(24);
  textFont("Open Sans");
  text(`Number of Infected : ${numInfected.length}`, 10, 850);
  textAlign(LEFT);
  fill(0);
  textSize(24);
  textFont("Open Sans");
  text(`Number of Immune : ${numImmune.length}`, 10, 900);
  textAlign(LEFT);
  fill(0);
  textSize(24);
  textFont("Open Sans");
  text(`Number of Vaccinators : ${numVaccinator.length}`, 10, 950);


  if (graphArray.length >= 600) {
    graphArray.shift();

  }
  graphArray.push({
     numInfected: numInfected.length,
     numHealthy: numHealthy.length,
    numberOfImmune: numImmune.length,
    iHeight: infectedHeight,
    hHeight: healthyHeight,
    imHeight : immuneHeight

  });
  //console.log(graphArray);
  push();
  translate(400, 1000);

  graphArray.forEach(function(data, index) {
    noStroke();
    fill(232, 86, 63);
    rect(index, 0, 1, -data.iHeight);

    fill(188, 224, 138);
    rect(index, -data.iHeight, 1, -data.hHeight);

    fill(57, 130, 209);
    rect(index, -data.iHeight+-data.hHeight, 1, -data.imHeight);
  })
  pop();

}

// The function drawGrid draws a grid using a nested loop iterating columns(i)
// within rows(j). colWidth and rowWidth are calculated in the setup(). The style
// of grid is defined by fill, stroke and strokeWeight. There
// are no parameters required to fulfil the function and no returns
function drawGrid() {
  noFill();
  stroke(155, 155, 155, 50);
  strokeWeight(1);

  for (let j = 0; j < obj.numRows; j++) {
    for (let i = 0; i < obj.numCols; i++) {
      //
      rect(i * colWidth, j * rowHeight, colWidth, rowHeight)
    }
  }
}

// This function uses a forEach loop to iterate through the molecules array. If an infected objects lifelength + it's is longer
// than the current frameCount, the molecules parameters and assigned to a temporary object. A new Immune object
// is then spliced into the molecules array at its own index.
function immunity(){
  molecules.forEach((molecule) => {
  if (frameCount > molecule.dob + molecule.lifeLength) {
    //console.log(molecule.dob, molecule.lifeLength, frameCount);
      let tempObject = {
        _i: molecule.index,
        px: molecule.position.x,
        py: molecule.position.y
      }
      molecules.splice(tempObject._i, 1, new Immune (tempObject));
  }
});
}

// The function checkLoop stops and starts the program in the setup(). A statement
// checks if loopState(gui) is true. If it is it executes the function loop, if iterates
// not then it executes the functio noLoop
function checkLoop() {
  if (obj.loopState) {
    loop();
  } else {
    noLoop();
  }
}
