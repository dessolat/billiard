import { TColor } from '../../types';
import cl from './ColorModal.module.scss';

type Props = {
  onSelect: (color: TColor) => void;
  onClose: () => void;
};

const ColorModal = ({ onSelect, onClose }: Props) => {
  const availableColors: TColor[] = ['red', 'green', 'blue'];

  const handleClick = (color: TColor) => () => {
    onSelect(color);
  };

  return (
    <div className={cl.modalBackground} onClick={onClose}>
      <div className={cl.modalWrapper} onClick={e => e.stopPropagation()}>
        <p>Select ball color:</p>
        <ul className={cl.colorList}>
          {availableColors.map(color => (
            <li
              key={color}
              className={cl.colorRow}
              style={{ backgroundColor: color }}
              onClick={handleClick(color)}></li>
          ))}
        </ul>
      </div>
    </div>
  );
};
export default ColorModal;
