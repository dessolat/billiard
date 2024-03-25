class Settings {
  canvasWidth: number;
  canvasHeight: number;
  ballsNumber: number;
  ballRadius: number;
  wallWidth: number;
	touchSpeed: number;
	slowdownFactor: number;

  constructor() {
    this.canvasWidth = 1000;
    this.canvasHeight = 600;
    this.ballsNumber = 12;
    this.ballRadius = 20;
    this.wallWidth = 30;
		this.touchSpeed = 80
		this.slowdownFactor = 0.98;
  }
}

export default Settings;
