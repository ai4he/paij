export function MicButton({ isListening, isSupported, onClick, disabled, size = 'normal' }) {
  const sizeClasses = size === 'small'
    ? { button: 'p-2', icon: 'h-5 w-5' }
    : { button: 'p-3', icon: 'h-6 w-6' };

  if (!isSupported) {
    return (
      <button
        type="button"
        disabled
        className={`rounded-full bg-gray-100 text-gray-400 cursor-not-allowed ${sizeClasses.button}`}
        title="Speech-to-text not supported in this browser"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={sizeClasses.icon}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`rounded-full transition-all ${sizeClasses.button} ${
        isListening
          ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-200'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      title={isListening ? 'Stop recording' : 'Start speech-to-text'}
    >
      {isListening ? (
        // Stop icon when recording
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={sizeClasses.icon}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <rect x="6" y="6" width="8" height="8" rx="1" />
        </svg>
      ) : (
        // Microphone icon when not recording
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={sizeClasses.icon}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"
            clipRule="evenodd"
          />
        </svg>
      )}
    </button>
  );
}
