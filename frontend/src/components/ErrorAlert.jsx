import React from 'react';
import { AlertCircle, X } from 'lucide-react';

const ErrorAlert = ({ message, onDismiss }) => {
  if (!message) return null;

  return (
    <div className="rounded-lg bg-red-50 p-4 shadow-sm border border-red-100 dark:bg-red-950/20 dark:border-red-900/30 mb-6">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <AlertCircle className="h-5 w-5 text-red-500" aria-hidden="true" />
        </div>
        <div className="ml-3 flex-1 pt-0.5">
          <p className="text-sm font-medium text-red-800 dark:text-red-200">{message}</p>
        </div>
        {onDismiss && (
          <div className="ml-auto pl-3">
            <button
              type="button"
              onClick={onDismiss}
              className="inline-flex rounded-md bg-transparent text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 p-1.5 focus:outline-none"
            >
              <span className="sr-only">Dismiss</span>
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ErrorAlert;
