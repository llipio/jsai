var c = 0;
var aiPos = 0;

var walls = 0;
var avoided = 0;
var crash = 0;

// CONSTANTS
const INTERVAL = 20; // milliseconds

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
var tryzone = 0;

function experience() {
  var aizone;
  var wallzone;

  //get wall and ai zone
  var getWallY = Wall.getY();
  var getAIY = Car.getY();

  wallzone = Game.getZone(Wall);
  Stats.setWallZone(wallzone);
  aizone = Game.getZone(Car);
  Stats.setCarZone(aizone);

  //trying
  document.getElementById('t_trying').innerHTML = tryzone;

  //read from experience 'database'
  var buildvar = aizone+wallzone+tryzone;
  var experienceDB = document.getElementById('succ_'+buildvar).innerHTML;

  //read from 'DB' and decide
  if(tryzone == 0) {
    buildvarOther = aizone+wallzone+1;
    experienceDBOther = document.getElementById('succ_'+buildvarOther).innerHTML;
    if(parseInt(experienceDBOther) > parseInt(experienceDB)+parseInt(10)) {
      buildvar = buildvarOther;
      experienceDB = document.getElementById('succ_'+buildvar).innerHTML;
      tryzone = 1;
      }
    }

    if(tryzone == 1) {
      buildvarOther = aizone+wallzone+0;
      experienceDBOther = document.getElementById('succ_'+buildvarOther).innerHTML;
      if(parseInt(experienceDBOther) > parseInt(experienceDB)+parseInt(10)) {
        buildvar = buildvarOther;
        experienceDB = document.getElementById('succ_'+buildvar).innerHTML;
        tryzone = 0;
      }

    }

    //move AI
    tryzone ? Car.move('down') : Car.move('up');


      //update DB only when wall is leftmost
      if(lastWallCount != walls)
        {
          //do update
          if(lastAvoided != avoided)
            {
              experienceDB = parseInt(experienceDB)+parseInt(1);
              document.getElementById('succ_'+buildvar).innerHTML = experienceDB;
              lastAvoided = avoided;
            }

            if(lastCrash != crash)
              {
                experienceDB = parseInt(experienceDB)-parseInt(1);
                document.getElementById('succ_'+buildvar).innerHTML = experienceDB;
                lastCrash = crash;
              }

              lastWallCount = walls;
              tryzone = Math.floor(Math.random() * 2);//random between 0 and 1

              //randomize wall position
              var randomWallYPos = Math.floor(Math.random() * (200 + 1) + 0);
              document.getElementById('wall').style.marginTop = randomWallYPos+"px";  

              document.getElementById('wall').style.left = null;
              document.getElementById('wall').style.right = '0px';


        }

}
