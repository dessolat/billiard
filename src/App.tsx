import { useEffect, useRef, useState } from 'react';
import Game from './classes/Game';
import Settings from './classes/Settings';
import Ball from './classes/Ball';
import ColorModal from './components/ColorModal/ColorModal';
import { type TColor } from './types';
import Header from './components/Header/Header';

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ballRef = useRef<Ball | null>(null);

  const [showColorModal, setColorModal] = useState(false);
  const [selectedColor, setSelectedColor] = useState<TColor | null>(null);

  useEffect(() => {
    if (canvasRef.current === null) return;

    const ctx = canvasRef.current.getContext('2d') as CanvasRenderingContext2D;

    new Game(ctx, handleLeftClick).init();
  }, []);

  useEffect(() => {
    if (!selectedColor || !ballRef.current) return;

    ballRef.current.color = selectedColor;

		setSelectedColor(null)
  }, [selectedColor]);

  const settings = new Settings();

  function handleLeftClick(ball: Ball) {
    ballRef.current = ball;
    setColorModal(true);
  }

  function handleColorSelect(color: TColor) {
    setSelectedColor(color);
		closeColorModal()
  }

	function closeColorModal() {
		setColorModal(false);
	}

  return (
    <div>
			<Header />
      <canvas width={settings.canvasWidth} height={settings.canvasHeight} ref={canvasRef}></canvas>
      {showColorModal && <ColorModal onSelect={handleColorSelect} onClose={closeColorModal}/>}
    </div>
  );
}

export default App;
