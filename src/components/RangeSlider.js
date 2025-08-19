import React, { useState, useRef, useEffect } from 'react';

const RangeSlider = ({ 
  value, 
  onChange, 
  min = 1, 
  max = 10, 
  label, 
  className = "",
  disabled = false 
}) => {
  const [sliderValue, setSliderValue] = useState(value || 1);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef(null);
  const handleRef = useRef(null);

  useEffect(() => {
    setSliderValue(value || 1);
  }, [value]);

  const handleMouseDown = (e) => {
    if (disabled) return;
    setIsDragging(true);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !sliderRef.current) return;
    
    const rect = sliderRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    const percentage = Math.max(0, Math.min(1, x / width));
    const newValue = Math.round(min + percentage * (max - min));
    
    setSliderValue(newValue);
    onChange(newValue);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  const handleClick = (e) => {
    if (disabled) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    const percentage = Math.max(0, Math.min(1, x / width));
    const newValue = Math.round(min + percentage * (max - min));
    
    setSliderValue(newValue);
    onChange(newValue);
  };

  const percentage = ((sliderValue - min) / (max - min)) * 100;

  return (
    <div className={`${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-3">
          {label}
        </label>
      )}
      
      <div className="relative">
        {/* Slider Track Container */}
        <div
          ref={sliderRef}
          onClick={handleClick}
          className={`
            w-full h-3 bg-purple-200 rounded-full cursor-pointer relative
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          {/* Filled Track (Dark Green) */}
          <div
            className="h-full bg-green-700 rounded-full transition-all duration-200"
            style={{ width: `${percentage}%` }}
          />
          
          {/* Handle */}
          <div
            ref={handleRef}
            onMouseDown={handleMouseDown}
            className={`
              absolute top-1/2 w-5 h-5 bg-white border-2 border-green-700 rounded-full 
              transform -translate-y-1/2 cursor-pointer shadow-sm
              transition-all duration-200 hover:shadow-md
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
              ${isDragging ? 'scale-110 shadow-md' : ''}
            `}
            style={{ left: `${percentage}%` }}
          />
        </div>
        
        {/* Value Display */}
        <div className="mt-2 text-center">
          <span className="text-sm font-medium text-gray-900">
            {sliderValue}/{max}
          </span>
        </div>
      </div>
    </div>
  );
};

export default RangeSlider; 