export function getRandomColor() {
  let letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export function getRandomCoords(
  minX: number,
  maxX: number,
  minY: number,
  maxY: number
): { x: number; y: number } {
  return {
    x: Math.floor(Math.random() * (maxX - minX + 1)) + minX,
    y: Math.floor(Math.random() * (maxY - minY + 1)) + minY
  };
}
