import { Button } from '../ui/button';
import { HistoryItem, HistoryItemProps } from './HistoryItem';

export interface HistoryPanelProps {
  history: Omit<HistoryItemProps, 'onReuse'>[];
  onReuse: (item: Omit<HistoryItemProps, 'onReuse'>) => void;
  onClear: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

export function HistoryPanel({ 
  history, 
  onReuse, 
  onClear, 
  isOpen, 
  onToggle 
}: HistoryPanelProps) {
  return (
    <div className={`fixed top-14 right-0 h-[calc(100vh-3.5rem)] w-80 bg-white dark:bg-gray-900 shadow-lg transition-transform duration-300 ease-in-out z-50 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h2 className="text-lg font-semibold">Calculation History</h2>
        <Button 
          onClick={onClear} 
          variant="destructive" 
          className="h-8 px-2 text-xs"
        >
          Clear All
        </Button>
      </div>
      
      <div className="p-4 overflow-y-auto h-[calc(100%-4rem)]">
        {history.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 p-4">
            No calculation history yet
          </div>
        ) : (
          history.map((item, index) => (
            <HistoryItem 
              key={index} 
              {...item} 
              onReuse={() => onReuse(item)} 
            />
          ))
        )}
      </div>
      
      <button 
        onClick={onToggle}
        className={`absolute left-0 top-1/2 -translate-x-full -translate-y-1/2 bg-white dark:bg-gray-900 p-2 rounded-l-md shadow-md border border-gray-200 dark:border-gray-700 border-r-0`}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          strokeWidth={1.5} 
          stroke="currentColor" 
          className={`w-5 h-5 ${isOpen ? 'rotate-180' : ''}`}
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            d="M15.75 19.5 8.25 12l7.5-7.5" 
          />
        </svg>
      </button>
    </div>
  );
} 