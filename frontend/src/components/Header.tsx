import React, { useState } from 'react';
import { Button } from './ui/button';
import { ChromePicker } from 'react-color';

interface HeaderProps {
  onReset: () => void;
  onRun: () => void;
  onColorChange: (color: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onReset, onRun, onColorChange }) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [currentColor, setCurrentColor] = useState('#ffffff');

  const handleColorChange = (color: any) => {
    setCurrentColor(color.hex);
    onColorChange(color.hex);
  };

  return (
    <div className="w-full bg-white dark:bg-gray-800 shadow-md p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Math Note AI</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Button
              variant="outline"
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="flex items-center space-x-2"
            >
              <div 
                className="w-4 h-4 rounded-full border border-gray-300"
                style={{ backgroundColor: currentColor }}
              />
              <span>Theme</span>
            </Button>
            
            {showColorPicker && (
              <div className="absolute right-0 mt-2 z-50">
                <div 
                  className="fixed inset-0"
                  onClick={() => setShowColorPicker(false)}
                />
                <ChromePicker
                  color={currentColor}
                  onChange={handleColorChange}
                />
              </div>
            )}
          </div>

          <Button
            variant="outline"
            onClick={onReset}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            Reset
          </Button>
          
          <Button
            onClick={onRun}
            className="bg-green-500 hover:bg-green-600 text-white"
          >
            Run
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Header; 