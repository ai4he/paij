import { useRef, useState } from 'react';

export function PinInput({ value, onChange, disabled }) {
  const inputRefs = [useRef(), useRef(), useRef(), useRef()];
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const handleChange = (index, e) => {
    const digit = e.target.value.replace(/\D/g, '').slice(-1);
    const newValue = value.split('');

    // Ensure array has 4 slots
    while (newValue.length < 4) newValue.push('');

    newValue[index] = digit;
    const newPin = newValue.join('').slice(0, 4);
    onChange(newPin);

    // Auto-focus next input
    if (digit && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace - move to previous input
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }

    // Handle arrow keys
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
    if (e.key === 'ArrowRight' && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4);
    onChange(pastedData);

    // Focus the appropriate input after paste
    const focusIndex = Math.min(pastedData.length, 3);
    inputRefs[focusIndex].current?.focus();
  };

  const handleFocus = (index) => {
    setFocusedIndex(index);
    // Select the content when focusing
    inputRefs[index].current?.select();
  };

  return (
    <div className="flex justify-center gap-3">
      {[0, 1, 2, 3].map((index) => (
        <input
          key={index}
          ref={inputRefs[index]}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={value[index] || ''}
          onChange={(e) => handleChange(index, e)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          onFocus={() => handleFocus(index)}
          onBlur={() => setFocusedIndex(-1)}
          disabled={disabled}
          className={`h-14 w-12 rounded-lg border-2 text-center text-2xl font-semibold transition-all
            ${focusedIndex === index
              ? 'border-primary-500 ring-2 ring-primary-200'
              : 'border-gray-300'
            }
            ${disabled ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-900'}
            focus:outline-none`}
          autoFocus={index === 0}
        />
      ))}
    </div>
  );
}
