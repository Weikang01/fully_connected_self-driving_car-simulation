class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  get length() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  set length(value) {
    const factor = value / this.length;
    this.x *= factor;
    this.y *= factor;
  }

  get angle() {
    return Math.atan2(this.y, this.x);
  }

  set angle(value) {
    const length = this.length;
    this.x = Math.cos(value) * length;
    this.y = Math.sin(value) * length;
  }

  normalize() {
    const length = this.length;
    this.x /= length;
    this.y /= length;
  }

  add(vector) {
    return new Vector(this.x + vector.x, this.y + vector.y);
  }

  subtract(vector) {
    return new Vector(this.x - vector.x, this.y - vector.y);
  }

  multiply(value) {
    return new Vector(this.x * value, this.y * value);
  }

  divide(value) {
    return new Vector(this.x / value, this.y / value);
  }
}
