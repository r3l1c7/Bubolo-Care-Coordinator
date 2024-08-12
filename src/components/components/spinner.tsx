import React from 'react';
import { Loader2 } from 'lucide-react';

const Spinner = () => {
  return (
    <div className="flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      <span className="ml-2 text-lg font-medium">Generating plan...</span>
    </div>
  );
};

export default Spinner;