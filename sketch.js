//Create variables here
var dogImage, happyDogImage, database, food, foodStock, foodObj, feed, addFood, fedTime, lastFed;
var gameState;

function preload(){ 
  sadDog=loadImage("Images/Dog.png"); 
  happyDog=loadImage("Images/happy dog.png"); 
  garden=loadImage("Images/Garden.png"); 
  washroom=loadImage("Images/Wash Room.png"); 
  bedroom=loadImage("Images/Bed Room.png"); 
}

function setup() { 
  database=firebase.database(); 
  createCanvas(1000,400); 
  foodObj = new Food(); 
  foodStock=database.ref('Food'); 
  foodStock.on("value",readStock); 
  dog=createSprite(800,200,150,150); 
  dog.addImage(sadDog); 
  dog.scale=0.15; 
  feed=createButton("Feed the dog"); 
  feed.position(700,95); 
  feed.mousePressed(feedDog); 
  addFood=createButton("Add Food"); 
  addFood.position(800,95); 
  addFood.mousePressed(addFoods); 
}

function draw() { 
  currentTime=hour(); 
  if(currentTime==(lastFed+1)){ update("Playing"); 
  foodObj.garden(); 
}else if(currentTime==(lastFed+2)){ update("Sleeping"); 
foodObj.bedroom(); 
}else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){ update("Bathing"); 
foodObj.washroom(); 
}else{ update("Hungry");
foodObj.display(); 
} if(gameState!="Hungry"){ feed.hide(); 
  addFood.hide(); 
  dog.remove(); 
}else{ feed.show(); 
  addFood.show(); 
  dog.addImage(sadDog); 
} drawSprites(); 
}

function writeStock(foodStock){
      foodStock-=1;
      database.ref('/').set({
      Food: foodStock
  });
}

function readStock(data){ 
  foodS=data.val(); 
  foodObj.updateFoodStock(foodS); 
}

function feedDog(){ 
  dog.addImage(happyDog); 
  foodObj.updateFoodStock(foodObj.getFoodStock()-1); 
  database.ref('/').update({ Food:foodObj.getFoodStock(), FeedTime:hour() }) 
}

function addFoods(){ 
  foodS++; database.ref('/').update({ Food:foodS }) 
}

function update(state){ 
  database.ref('/').update({ gameState:state }) 
}

function feedDog(){ 
  dog.addImage(happyDog); 
  foodObj.updateFoodStock(foodObj.getFoodStock()-1); 
  database.ref('/').update({ Food:foodObj.getFoodStock(), FeedTime:hour(), gameState:"Hungry" }) 
}