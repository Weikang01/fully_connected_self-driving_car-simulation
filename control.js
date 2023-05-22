CONTROL_TYPE = {
  DUMMY: 0,
  PLAYER: 1,
  AI: 2,
};

class Control {
  constructor(control_type) {
    this.forward = false;
    this.left = false;
    this.right = false;
    this.back = false;

    switch (control_type) {
      case CONTROL_TYPE.PLAYER:
        this.#addKeyboardListeners();
        break;
      case CONTROL_TYPE.DUMMY:
        this.forward = true;
        break;
      case CONTROL_TYPE.AI:
        break;
    }
  }

  #addKeyboardListeners() {
    document.onkeydown = (event) => {
      switch (event.key) {
        case "w":
        case "ArrowUp":
          this.forward = true;
          break;
        case "a":
        case "ArrowLeft":
          this.left = true;
          break;
        case "d":
        case "ArrowRight":
          this.right = true;
          break;
        case "s":
        case "ArrowDown":
          this.back = true;
          break;
      }
    };

    document.onkeyup = (event) => {
      switch (event.key) {
        case "w":
        case "ArrowUp":
          this.forward = false;
          break;
        case "a":
        case "ArrowLeft":
          this.left = false;
          break;
        case "d":
        case "ArrowRight":
          this.right = false;
          break;
        case "s":
        case "ArrowDown":
          this.back = false;
          break;
      }
    };
  }
}
