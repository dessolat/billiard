class MouseController {
  x: number;
  y: number;
  mouseOverCanvas: boolean;
  leftBtnPressed: boolean;
  ctrlLeftBtnPressed: boolean;

  constructor(handleLeftClick: (e: MouseEvent) => void) {
    this.x = 0;
    this.y = 0;
    this.mouseOverCanvas = false;
    this.leftBtnPressed = false;
    this.ctrlLeftBtnPressed = false;

    const canvas = document.querySelector('canvas') as HTMLCanvasElement;

    canvas.onmousemove = this.handleMouseMove.bind(this);
    canvas.onmouseleave = this.handleMouseLeave.bind(this);
    canvas.onmousedown = e => this.handleMouseDown(e, handleLeftClick);
    canvas.onmouseup = this.handleMouseUp.bind(this);
  }

  handleMouseMove(e: MouseEvent) {
    this.x = e.offsetX;
    this.y = e.offsetY;
    this.mouseOverCanvas = true;
  }

  handleMouseLeave() {
    this.mouseOverCanvas = false;
  }

  handleMouseDown(e: MouseEvent, callback: (e: MouseEvent) => void) {
    if (e.button === 0) {
      this.leftBtnPressed = true;

      if (e.ctrlKey) {
        this.ctrlLeftBtnPressed = true;
        callback(e);
      }
    }
  }

  handleMouseUp(e: MouseEvent) {
    if (e.button === 0) {
      this.leftBtnPressed = false;
      this.ctrlLeftBtnPressed = false;
    }
  }
}

export default MouseController;
