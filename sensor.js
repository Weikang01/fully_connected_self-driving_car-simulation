class Sensor {
  constructor(car) {
    this.car = car;
    this.rayCount = 10;
    this.rayLength = 150;
    this.raySpread = Math.PI;

    this.rays = [];
    this.readings = [];
  }

  #castRay() {
    this.rays = [];
    for (let i = 0; i < this.rayCount; i++) {
      const rayAngle = lerp(
        this.raySpread * 0.5,
        -this.raySpread * 0.5,
        this.rayCount == 1 ? 0.5 : i / (this.rayCount - 1)
      );

      const start = { x: this.car.x, y: this.car.y };
      const end = {
        x:
          this.car.x +
          Math.cos(this.car.front.angle + rayAngle) * this.rayLength,
        y:
          this.car.y +
          Math.sin(this.car.front.angle + rayAngle) * this.rayLength,
      };

      this.rays.push([start, end]);
    }
  }

  #getReading(ray, roadBorders, traffic) {
    let touches = [];
    for (let i = 0; i < roadBorders.length; i++) {
      const touch = getIntersection(
        ray[0], // start of ray
        ray[1], // end of ray
        roadBorders[i][0], // start of border
        roadBorders[i][1] // end of border
      );
      if (touch) {
        touches.push(touch);
      }
    }

    for (let i = 0; i < traffic.length; i++) {
      traffic[i].polygon.forEach((point, index) => {
        const nextPoint =
          traffic[i].polygon[(index + 1) % traffic[i].polygon.length];
        const touch = getIntersection(
          ray[0], // start of ray
          ray[1], // end of ray
          point, // start of border
          nextPoint // end of border
        );
        if (touch) {
          touches.push(touch);
        }
      });
    }

    if (touches.length == 0) {
      return null;
    } else {
      const offsets = touches.map((e) => e.offset);
      const closest = Math.min(...offsets);
      return touches.find((e) => e.offset == closest);
    }
  }

  update(roadBorders, traffic) {
    this.#castRay();
    this.readings = [];
    for (let i = 0; i < this.rayCount; i++) {
      this.readings.push(this.#getReading(this.rays[i], roadBorders, traffic));
    }
  }

  draw(ctx) {
    ctx.lineWidth = 2;

    for (let i = 0; i < this.rayCount; i++) {
      let end = this.rays[i][1];
      if (this.readings[i]) {
        end = this.readings[i];

        ctx.strokeStyle = "black";
        ctx.beginPath();
        ctx.moveTo(end.x, end.y);
        ctx.lineTo(this.rays[i][1].x, this.rays[i][1].y);
        ctx.stroke();
      }

      ctx.strokeStyle = "yellow";
      ctx.beginPath();
      ctx.moveTo(this.rays[i][0].x, this.rays[i][0].y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();
    }
  }
}
