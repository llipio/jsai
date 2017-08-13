const Car = {
  element: document.getElementById('ai'),
  height: 50,
  width: 100,
  getX: () => {
  },
  getY: () => {
    return Car.element.offsetTop;
  },
  getYBottom: () => {
    return Car.element.offsetTop + Car.height;
  },
  move: (direction) => {
    // boundaries
    if(aiPos < 50){aiPos = 50;}
    if(aiPos > 200){aiPos = 200;}

    aiPos = direction == 'down' ? aiPos + 10 : aiPos - 10;
    
    Car.element.style.marginTop = aiPos+"px";
  },
  getCenter: () => {
    return Car.getY() - 100 + 25;
  },
  reset: () => {
    Car.element.style.marginTop = "50px";
  },
};

const Wall = {
  width: 100,
  element: document.getElementById('wall'),
  getX: () => {
    return document.getElementById('wall').offsetLeft;
  },
  getY: () => {
    return document.getElementById('wall').offsetTop;
  },
  getYBottom: () => {
    return document.getElementById('wall').offsetTop + Wall.width;
  },
  moveLeft: () => {
    const wallX = Wall.getX();
    if (wallX <= 0) {
      Stats.increaseWallCount();
    } else {
      document.getElementById('wall').style.left = `${Wall.getX() - 20}px`;
    }
  },
  reset: () => {
    Wall.element.style.left = null;
    Wall.element.style.right = '0px';
  },
  getCenter: () => {
    return Wall.getY() - 100 + 50;
  },
  setRandomPosition: () => {
    //randomize wall position
    const randomWallYPos = Math.floor(Math.random() * (200 + 1) + 0);
    Wall.element.style.marginTop = randomWallYPos+"px";  
    Wall.element.style.left = null;
    Wall.element.style.right = '0px';
  },
};

class Sensor {
  constructor(name) {
    this.name = name;
    this.element = document.getElementById(name);
    this.width = 500;
  }
  getRightX() {
    return this.element.offsetLeft+this.width;
  }
  markDanger() {
    this.element.style.backgroundColor = 'red';
  }
  markSafe() {
    this.element.style.backgroundColor = 'white';
  }
}

const sensors = {
  front: new Sensor('sensor_2'),
};

const Stats = {
  getWallCount: () => {
  },
  increaseWallCount: () => {
    walls++;
  },
  setWallZone: (val) => {
    document.getElementById('t_wall_zone').innerHTML = val;
  },
  setCarZone: (val) => {
    document.getElementById('t_ai_zone').innerHTML = val;
  },
  updateDebug: () => {
    var getWallX = Wall.getX();
    var getWallY = Wall.getY();
    
    var getAIX = sensors.front.getRightX();
    var getAIY = Car.getY();
    
    var successRate = Math.floor((avoided/(avoided+crash)*100));   
    document.getElementById('topDebug').innerHTML = "&nbsp;["+c+"]<br>&nbsp;Wall ("+getWallX+","+getWallY+")<br>&nbsp;AI ("+getAIX+","+getAIY+")<br>&nbsp;Walls: "+walls+" Avoided: "+avoided+" Crash: "+crash+" Success rate: "+successRate+"%";
  },
  setTryZone: (tz) => {
    document.getElementById('t_trying').innerHTML = tz;
  }
}


function moveWall() {
  Stats.updateDebug();
  Wall.moveLeft();
}

function checkCollision()
{
  const frontSensorX = sensors.front.getRightX();
  const wallX = Wall.getX();
  const wallY = Wall.getY();
  const carY = Car.getY();
  if(wallX < frontSensorX) { // wall is in front sensor range
    if(carY >= wallY && carY < Wall.getYBottom()
    || carY < wallY && Car.getYBottom() > wallY) {
      sensors.front.markDanger();
      //decide if the car was hit
      if(wallX < Car.width){crash++;}
      return;
    }
  }
  sensors.front.markSafe();
  if(wallX < 100){avoided++;}
}

