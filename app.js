var c = 0;
var aiPos = 0;

var walls = 0;
var avoided = 0;
var crash = 0;

// CONSTANTS
const INTERVAL = 20; // milliseconds
const LEARN_BUFFER = 1;

function tick() {
  c++;
  document.getElementById('stepsDone').value = c;
  moveWall(); //move wall to the left
  checkCollision();
  experience();
}

const Game = {
  interval: '',
  height: 300,
  stopSimulation: () => {
    clearInterval(Game.interval);
    c = 0;
    Wall.reset();
    Car.reset();
    document.getElementById('stepsDone').value = c;
    aiPos = 0;
    walls = 0;
    crash = 0;
    avoided = 0;
  },
  getZone: (item) => {
    return item.getCenter() <= 150 ? '0' : '1';
  }
}

function runSim(state) {
  if(state == 1) {
    if(c > 100) {
      runSim('0'); //force stop
    } else{
      Game.interval = setInterval("tick();", INTERVAL);
    } 
  } else {
    Game.stopSimulation();
  }
}

var lastWallCount = 0;
var lastAvoided = 0;
var lastCrash = 0;

const DB = {
  tryzone: 0,
  getExperience(aizone, wallzone, tryzone) {
    const buildvar = aizone+wallzone+tryzone; // ec 010
    return document.getElementById('succ_'+buildvar).innerHTML;
  },
  setExperienceVal(key, val) {
    document.getElementById('succ_'+key).innerHTML = val;
  },
  setTryZone: (next) => {
    DB.tryzone = next;
  },
  setRandomTryzone: () => {
    DB.tryzone = Math.floor(Math.random() * 2);//random between 0 and 1
  },
  getAllTryzones: () => {
    return [0,1];
  },
}

function experience() {
  var aizone;
  var wallzone;

  //get wall and ai zone
  var getWallY = Wall.getY();
  var getAIY = Car.getY();

  wallzone = Game.getZone(Wall);
  aizone = Game.getZone(Car);

  // update Stats
  Stats.setWallZone(wallzone);
  Stats.setCarZone(aizone);
  Stats.setTryZone(DB.tryzone);

  //read from experience 'database'
  let buildvar = aizone+wallzone+DB.tryzone; // ec 010
  let experienceDB = DB.getExperience(aizone, wallzone, DB.tryzone);

  const tryVals = DB.getAllTryzones().map( (t) => {
    return {
      try: t,
      val: parseInt(DB.getExperience(aizone, wallzone, t))
    };
  });

  tryVals.sort((a,b) => {
    return b.val - a.val;
  });

  const bestTry = tryVals[0];
  if(bestTry.val > DB.getExperience(aizone, wallzone, DB.tryzone)) {
    DB.setTryZone(bestTry.try);
    buildvar = aizone+wallzone+bestTry.try;
    experienceDB = bestTry.val;
  }

  //move AI
  DB.tryzone ? Car.move('down') : Car.move('up');

  //update DB only when wall is leftmost
  if(lastWallCount != walls) {
    //do update
    if(lastAvoided != avoided) {
      DB.setExperienceVal(buildvar, parseInt(experienceDB) + 1);
      lastAvoided = avoided;
    }

    if(lastCrash != crash) {
      DB.setExperienceVal(buildvar, parseInt(experienceDB) - 1);
      lastCrash = crash;
    }

    lastWallCount = walls;
    DB.setRandomTryzone();

    Wall.setRandomPosition();
  }
}
