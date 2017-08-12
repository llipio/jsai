const Car = {
  getX: () => {
  },
  getY: () => {
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
}

const sensors = {
  front: new Sensor('sensor_2'),
};


function moveWall()
{
    var getWallX = document.getElementById('wall').offsetLeft;
    var getWallY = document.getElementById('wall').offsetTop;
    
    var getAIX = sensors.front.getRightX();
    var getAIY = document.getElementById('ai').offsetTop;
    
    var successRate = Math.floor((avoided/(avoided+crash)*100));   
    
    document.getElementById('topDebug').innerHTML = "&nbsp;["+c+"]<br>&nbsp;Wall ("+getWallX+","+getWallY+")<br>&nbsp;AI ("+getAIX+","+getAIY+")<br>&nbsp;Walls: "+walls+" Avoided: "+avoided+" Crash: "+crash+" Success rate: "+successRate+"%";
        
    if(getWallX <= 0)
    {
        
        walls++;
        
    }else{
            getWallX = getWallX-20;
            document.getElementById('wall').style.left = getWallX+'px';
         }
    
}

// move car up or down, make sure it stays inbound
function moveCar(direction)
{
    //auto correct
    if(aiPos < 50){aiPos = 50;}
    if(aiPos > 200){aiPos = 200;}
    
    if(direction == 'down')
    {
     	aiPos=aiPos+10;   
    }else{ 
     		aiPos=aiPos-10;   
    	 }    
    
    
    document.getElementById('ai').style.marginTop = aiPos+"px";
}

function checkCollision()
{
  var getWallX = document.getElementById('wall').offsetLeft;
  var getAIX = sensors.front.getRightX();
    
  var getWallY = document.getElementById('wall').offsetTop+100;
  var getAIY = document.getElementById('ai').offsetTop;
        
    if(getWallX < getAIX && getAIY >= getWallY-100 && getAIY < getWallY || getWallX < getAIX && getWallY-100 > getAIY && getWallY-100 < getAIY+50)
    {
     	//moveCar('down');        	 
        document.getElementById('sensor_2').style.backgroundColor = 'red';
        //decide if the car was hit
        if(getWallX < 100){crash++;}
        
    }else{
        	document.getElementById('sensor_2').style.backgroundColor = 'white';
        	if(getWallX < 100){avoided++;}
    	 }
    
}

