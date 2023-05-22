class Car {
  constructor(
    x,
    y,
    width,
    height,
    control_type = CONTROL_TYPE.PLAYER,
    maxSpeed = 3
  ) {
    this.position = new Vector(x, y); // position of the car
    this.size = new Vector(width, height); // size of the car

    this.front = new Vector(0, -1); // front of the car
    this.top_angle = new Vector(0, -1).angle;
    this.control_type = control_type; // control type of the car

    this.speed = 0; // speed of the car
    this.acceleration = 0.2; // acceleration of the car
    this.maxSpeed = maxSpeed; // maximum speed of the car
    this.maxReverseSpeed = -2; // maximum reverse speed of the car
    this.friction = 0.05; // friction of the car
    this.angularSpeed = 0.03; // angular speed of the car

    this.polygon = this.#createPolygon();

    if (control_type != CONTROL_TYPE.DUMMY) {
      this.sensor = new Sensor(this); // sensor of the car
      if (control_type == CONTROL_TYPE.AI) {
        this.brain = new NeuralNetwork([this.sensor.rayCount, 6, 4]);
      }
    }

    this.control = new Control(control_type);

    this.damaged = false;
  }

  get x() {
    return this.position.x;
  }

  set x(value) {
    this.position.x = value;
  }

  get y() {
    return this.position.y;
  }

  set y(value) {
    this.position.y = value;
  }

  get width() {
    return this.size.x;
  }

  get height() {
    return this.size.y;
  }

  get angle() {
    return this.front.angle - this.top_angle;
  }

  #assessDamage(roadBorders, traffic) {
    for (let i = 0; i < roadBorders.length; i++) {
      if (polysIntersect(this.polygon, roadBorders[i])) {
        this.damaged = true;
        return true;
      }
    }
    for (let i = 0; i < traffic.length; i++) {
      if (polysIntersect(this.polygon, traffic[i].polygon)) {
        this.damaged = true;
        return true;
      }
    }
    return false;
  }

  #createPolygon() {
    const points = [];
    const rad = Math.hypot(this.width, this.height) * 0.5;
    const alpha = Math.atan2(this.height, this.width);

    points.push({
      x: this.x + Math.cos(this.angle - alpha) * rad,
      y: this.y + Math.sin(this.angle - alpha) * rad,
    });
    points.push({
      x: this.x + Math.cos(this.angle + alpha) * rad,
      y: this.y + Math.sin(this.angle + alpha) * rad,
    });
    points.push({
      x: this.x + Math.cos(Math.PI + this.angle - alpha) * rad,
      y: this.y + Math.sin(Math.PI + this.angle - alpha) * rad,
    });
    points.push({
      x: this.x + Math.cos(Math.PI + this.angle + alpha) * rad,
      y: this.y + Math.sin(Math.PI + this.angle + alpha) * rad,
    });

    return points;
  }

  #move() {
    if (this.control.forward) {
      this.speed += this.acceleration;
    } else if (this.control.back) {
      this.speed -= this.acceleration;
    }
    if (this.speed > this.maxSpeed) {
      this.speed = this.maxSpeed;
    } else if (this.speed < this.maxReverseSpeed) {
      this.speed = this.maxReverseSpeed;
    }

    let flip = 0;
    if (this.speed != 0) {
      flip = this.speed > 0 ? 1 : -1;
    }

    if (this.control.left) {
      this.front.angle -= this.angularSpeed * flip;
    } else if (this.control.right) {
      this.front.angle += this.angularSpeed * flip;
    }

    if (this.speed > 0) {
      this.speed -= Math.min(this.speed, this.friction);
    } else if (this.speed < 0) {
      this.speed += Math.min(-this.speed, this.friction);
    }

    this.position = this.position.add(this.front.multiply(this.speed));
  }

  update(roadBorders, traffic) {
    if (!this.damaged) {
      this.#move();
      this.polygon = this.#createPolygon();
      if (this.control_type != CONTROL_TYPE.DUMMY) {
        this.sensor.update(roadBorders, traffic);
        if (this.control_type == CONTROL_TYPE.AI) {
          const offsets = this.sensor.readings.map((s) =>
            s == null ? 0 : 1 - s.offset
          );
          const outputs = NeuralNetwork.feedForward(offsets, this.brain);

          this.control.forward = outputs[0];
          this.control.left = outputs[1];
          this.control.right = outputs[2];
          this.control.back = outputs[3];
        }
      }
      this.#assessDamage(roadBorders, traffic);
    }
  }

  draw(ctx, style, drawSensor = false) {
    if (this.damaged) {
      ctx.fillStyle = "red";
    } else {
      ctx.fillStyle = style;
    }

    ctx.beginPath();
    ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
    for (let i = 1; i < this.polygon.length; i++) {
      ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
    }
    ctx.fill();

    if (drawSensor && this.control_type != CONTROL_TYPE.DUMMY) {
      this.sensor.draw(ctx);
    }
  }
}
