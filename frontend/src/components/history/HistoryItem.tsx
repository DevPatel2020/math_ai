import { Button } from '../ui/button';

export interface HistoryItemProps {
  expression: string;
  result: string;
  timestamp: Date;
  onReuse: () => void;
}

export function HistoryItem({ expression, result, timestamp, onReuse }: HistoryItemProps) {
  return (
    <div className="p-3 mb-2 rounded-md bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-start">
        <div>
          <div className="font-medium">{expression} = {result}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {timestamp.toLocaleTimeString()} - {timestamp.toLocaleDateString()}
          </div>
        </div>
        <Button 
          onClick={onReuse} 
          className="h-8 px-2 text-xs"
        >
          Reuse
        </Button>
      </div>
    </div>
  );
} 