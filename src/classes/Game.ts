import { getRandomColor, getRandomCoords } from '../utils';
import Ball from './Ball';
import MouseController from './MouseController';
import Settings from './Settings';

class Game {
  ctx: CanvasRenderingContext2D;
  settings: Settings;
  mouseController: MouseController;
  balls: Ball[];
  handleLeftClick: (ball: Ball) => void;

  constructor(ctx: CanvasRenderingContext2D, handleLeftClick: (ball: Ball) => void) {
    this.ctx = ctx;
    this.settings = new Settings();
    this.mouseController = new MouseController(this.checkBallClick.bind(this));
    this.balls = this.createBalls();
    this.handleLeftClick = handleLeftClick;
  }

  init() {
    this.draw();
    this.animate();
  }

  update() {
    this.balls.forEach(ball => ball.update());
    this.checkLeftCursorBumping();
    this.handleBallsBumping();
    this.slowDownBalls();
  }

  findCursorBumpingBall(offsetX: number, offsetY: number) {
    return this.balls.find(
      ball =>
        Math.sqrt(Math.pow(ball.x - offsetX, 2) + Math.pow(ball.y - offsetY, 2)) <= this.settings.ballRadius
    );
  }

  checkBallClick(e: MouseEvent) {
    const ball = this.findCursorBumpingBall(e.offsetX, e.offsetY);

    if (ball) this.handleLeftClick(ball);
  }

  checkLeftCursorBumping() {
    if (!this.mouseController.leftBtnPressed || this.mouseController.ctrlLeftBtnPressed) return;

    const ball = this.findCursorBumpingBall(this.mouseController.x, this.mouseController.y);

    if (!ball) return;

    const xDiff = ball.x - this.mouseController.x;
    const yDiff = ball.y - this.mouseController.y;

    ball.dx = (xDiff / 50) * this.settings.touchSpeed;
    ball.dy = (yDiff / 50) * this.settings.touchSpeed;
  }

  handleBallsBumping() {
    for (let i = 0; i < this.balls.length; i++) {
      for (let j = i + 1; j < this.balls.length; j++) {
        // Calculating distance between two balls
        const ballsDistance = this.balls[i].getBallsDistance(this.balls[j]);

        if (ballsDistance <= this.settings.ballRadius * 2) {
          // Normal vector
          const normalVector = { x: this.balls[i].x - this.balls[j].x, y: this.balls[i].y - this.balls[j].y };

          // Minimum distance
          const distanceCoeff = (this.settings.ballRadius * 2 - ballsDistance) / ballsDistance;
          const minDistance = { x: normalVector.x * distanceCoeff, y: normalVector.y * distanceCoeff };

          // Correcting positions of the balls
          this.balls[i].x += minDistance.x / 2;
					this.balls[i].y += minDistance.y / 2;
					this.balls[j].x -= minDistance.x / 2;
					this.balls[j].y -= minDistance.y / 2;

          // Unit normal vector
          const unitNormalVector = {
            x: normalVector.x / ballsDistance,
            y: normalVector.y / ballsDistance
          };

          // Unit tangent vector
          const unitTangentVector = {
            x: -unitNormalVector.y,
            y: unitNormalVector.x
          };

          // Project velocity onto the normal vector and onto the tangent vector
          const vector1n = this.balls[i].dx * unitNormalVector.x + this.balls[i].dy * unitNormalVector.y;
          const vector1t = this.balls[i].dx * unitTangentVector.x + this.balls[i].dy * unitTangentVector.y;
          const vector2n = this.balls[j].dx * unitNormalVector.x + this.balls[j].dy * unitNormalVector.y;
          const vector2t = this.balls[j].dx * unitTangentVector.x + this.balls[j].dy * unitTangentVector.y;

          // New normal velocities
          let vector1nTag = vector2n;
          let vector2nTag = vector1n;

          // Scalar normal and tangential velocities into vectors
          const convertedVector1nTag = {
            x: unitNormalVector.x * vector1nTag,
            y: unitNormalVector.y * vector1nTag
          };
          const convertedVector1tTag = {
            x: unitTangentVector.x * vector1t,
            y: unitTangentVector.y * vector1t
          };
          const convertedVector2nTag = {
            x: unitNormalVector.x * vector2nTag,
            y: unitNormalVector.y * vector2nTag
          };
          const convertedVector2tTag = {
            x: unitTangentVector.x * vector2t,
            y: unitTangentVector.y * vector2t
          };

          // Update velocities
          this.balls[i].dx = convertedVector1nTag.x + convertedVector1tTag.x;
          this.balls[i].dy = convertedVector1nTag.y + convertedVector1tTag.y;
          this.balls[j].dx = convertedVector2nTag.x + convertedVector2tTag.x;
          this.balls[j].dy = convertedVector2nTag.y + convertedVector2tTag.y;
        }
      }
    }
  }

  slowDownBalls() {
    this.balls.forEach(ball => ball.slowDown());
  }

  draw() {
    this.clear();
    this.drawBackground();
    this.drawBalls();
  }

  drawBackground() {
    const ctx = this.ctx;
    ctx.fillStyle = '#003300';
    ctx.fillRect(0, 0, this.settings.canvasWidth, this.settings.canvasHeight);
    ctx.strokeStyle = '#663300';
    ctx.lineWidth = this.settings.wallWidth;
    ctx.strokeRect(
      ctx.lineWidth / 2,
      ctx.lineWidth / 2,
      this.settings.canvasWidth - ctx.lineWidth,
      this.settings.canvasHeight - ctx.lineWidth
    );
  }

  createBalls() {
    const minXCoord = this.settings.wallWidth + this.settings.ballRadius;
    const minYCoord = minXCoord;
    const maxXCoord = this.settings.canvasWidth - this.settings.wallWidth - this.settings.ballRadius;
    const maxYCoord = this.settings.canvasHeight - this.settings.wallWidth - this.settings.ballRadius;

    return new Array(this.settings.ballsNumber).fill(null).reduce((balls: Ball[]) => {
      let coords: { x: number; y: number };
      let isCrossingCoords: boolean;

      do {
        isCrossingCoords = false;

        coords = getRandomCoords(minXCoord, maxXCoord, minYCoord, maxYCoord);

        isCrossingCoords = balls.some(
          ball =>
            Math.sqrt(Math.abs(ball.x - coords.x) ** 2 + Math.abs(ball.y - coords.y) ** 2) <
            this.settings.ballRadius * 2
        );
      } while (isCrossingCoords);

      balls.push(new Ball(this.ctx, coords.x, coords.y, getRandomColor()));
      return balls;
    }, []);
  }

  drawBalls() {
    this.balls.forEach(ball => ball.draw());
  }

  clear() {
    this.ctx.clearRect(0, 0, this.settings.canvasWidth, this.settings.canvasHeight);
  }
  animate() {
    this.update();
    this.draw();

    requestAnimationFrame(this.animate.bind(this));
  }
}

export default Game;
