const gameCanvas = document.getElementById("gameCanvas");
gameCanvas.width = 200;
const neuralCanvas = document.getElementById("neuralCanvas");
neuralCanvas.width = 300;

const gameCtx = gameCanvas.getContext("2d");
const neuralCtx = neuralCanvas.getContext("2d");

const road = new Road(gameCanvas.width * 0.5, gameCanvas.width * 0.9);
const car = new Car(road.getLaneCenter(1), 400, 30, 50, CONTROL_TYPE.AI, 5);
const N = 100;
const cars = generateCars(N);
const traffic = [
  new Car(road.getLaneCenter(0), 100, 30, 50, CONTROL_TYPE.DUMMY),
  new Car(road.getLaneCenter(2), -100, 30, 50, CONTROL_TYPE.DUMMY, 4),
  new Car(road.getLaneCenter(1), -500, 30, 50, CONTROL_TYPE.DUMMY, 4),
  new Car(road.getLaneCenter(2), -500, 30, 50, CONTROL_TYPE.DUMMY, 4),
];

let most_successful_car_index = 0;
let most_successful_car_score = 100000;
let damaged_car_set = new Set();
let max_survival_time = 1000;

loadModel();
animate();

function generateCars(N) {
  const cars = [];
  for (let i = 0; i < N; i++) {
    cars.push(new Car(road.getLaneCenter(1), 400, 30, 50, CONTROL_TYPE.AI, 5));
  }
  return cars;
}

function saveModel() {
  console.log("saved!");
  localStorage.setItem(
    "bestBrain",
    JSON.stringify(cars[most_successful_car_index].brain)
  );
}

function discardModel() {
  localStorage.removeItem("bestBrain");
}

function loadModel() {
  const bestBrain = localStorage.getItem("bestBrain");
  if (bestBrain) {
    cars[0].brain = JSON.parse(bestBrain);
    for (let i = 1; i < cars.length; i++) {
      cars[i].brain = NeuralNetwork.mutate(JSON.parse(bestBrain), 0.5);
    }
  }
}

function animate() {
  gameCanvas.height = window.innerHeight;
  neuralCanvas.height = window.innerHeight;

  for (let i = 0; i < traffic.length; i++) {
    traffic[i].update(road.borders, []);
  }

  for (let i = 0; i < cars.length; i++) {
    cars[i].update(road.borders, traffic);

    if (cars[i].position.y < most_successful_car_score) {
      most_successful_car_score = cars[i].position.y;
      most_successful_car_index = i;
    }

    if (cars[i].damaged) {
      damaged_car_set.add(i);
      if (damaged_car_set.size == cars.length - 1) {
        console.log("find the best model!");
        saveModel();
      }
    }
  }

  // car.update(road.borders, traffic);

  gameCtx.save();
  gameCtx.translate(
    0,
    -cars[most_successful_car_index].y + gameCanvas.height * 0.75
  );

  road.draw(gameCtx);
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].draw(gameCtx, "gray");
  }

  gameCtx.globalAlpha = 0.2;

  for (let i = 0; i < cars.length; i++) {
    if (i == most_successful_car_index) cars[i].draw(gameCtx, "blue", true);
    else cars[i].draw(gameCtx, "blue");
  }

  // car.draw(gameCtx, "blue");

  gameCtx.restore();

  gameCtx.globalAlpha = 1;
  Visualizer.drawNetwork(neuralCtx, cars[most_successful_car_index].brain);
  requestAnimationFrame(animate);
}
