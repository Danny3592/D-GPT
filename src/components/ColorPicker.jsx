
const ColorPicker = () => {
  const [color, setColor] = useState("#fff");

  return (
    <div>
      <SketchPicker 
        color={color} 
        onChange={(updatedColor) => setColor(updatedColor.hex)}
      />
      <p>選擇的顏色: {color}</p>
    </div>
  );
};

export default ColorPicker;
