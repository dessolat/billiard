import Settings from './Settings';

class Ball {
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  dx: number;
  dy: number;
  color: string;
  settings: Settings;

  constructor(ctx: CanvasRenderingContext2D, x: number, y: number, color: string) {
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.dx = 0;
    this.dy = 0;
    this.color = color;
    this.settings = new Settings();
  }

  update() {
    this.move();
		this.handleWallBumping()
  }

  move() {
    this.x += this.dx;
    this.y += this.dy;
  }

  slowDown() {
    if (Math.abs(this.dx) > 0.05 || Math.abs(this.dy) > 0.05) {
      this.dx *= this.settings.slowdownFactor;
      this.dy *= this.settings.slowdownFactor;
    } else {
      this.dx = 0;
      this.dy = 0;
    }
  }

	handleWallBumping() {
    const { canvasWidth, canvasHeight, wallWidth, ballRadius } = this.settings;

		const edgeXLeft = wallWidth + ballRadius;
    const edgeXRight = canvasWidth - wallWidth - ballRadius;
		
    if (this.x > edgeXRight || this.x < edgeXLeft) {
			if (this.x > edgeXRight) this.x -= (this.x - edgeXRight) * 2;
      if (this.x < edgeXLeft) this.x += (edgeXLeft - this.x) * 2;
			
			// Updating X veocity
      this.dx = -this.dx;
    }

    const edgeYTop = wallWidth + ballRadius;
    const edgeYBottom = canvasHeight - wallWidth - ballRadius;
		
    if (this.y > edgeYBottom || this.y < edgeYTop) {
			if (this.y > edgeYBottom) this.y -= (this.y - edgeYBottom) * 2;
      if (this.y < edgeYTop) this.y += (edgeYTop - this.y) * 2;
			
			// Updating Y velocity
      this.dy = -this.dy;
    }
	}
	
	getBallsDistance(ball: Ball) {
		return Math.sqrt(Math.pow(this.x - ball.x, 2) + Math.pow(this.y - ball.y, 2));
	}

  draw() {
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.settings.ballRadius, 0, 2 * Math.PI);
    this.ctx.fillStyle = this.color;
    this.ctx.strokeStyle = 'white';
    this.ctx.lineWidth = 1;
    this.ctx.stroke();
    this.ctx.fill();
    this.ctx.closePath();
  }
}

export default Ball;
