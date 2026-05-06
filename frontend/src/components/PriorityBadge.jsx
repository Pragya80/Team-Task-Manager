import React from 'react';

const PriorityBadge = ({ priority }) => {
  const config = {
    low: { label: 'Low', className: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400' },
    medium: { label: 'Medium', className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' },
    high: { label: 'High', className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' },
  };

  const { label, className } = config[priority] || config.medium;

  return (
    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${className} ring-opacity-20`}>
      {label}
    </span>
  );
};

export default PriorityBadge;
