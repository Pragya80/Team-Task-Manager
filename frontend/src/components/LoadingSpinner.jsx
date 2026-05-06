import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ fullScreen = false }) => {
  const content = (
    <div className="flex flex-col items-center justify-center space-y-4">
      <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      <p className="text-sm text-gray-500 dark:text-gray-400">Loading...</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        {content}
      </div>
    );
  }

  return (
    <div className="flex p-8 items-center justify-center">
      {content}
    </div>
  );
};

export default LoadingSpinner;
