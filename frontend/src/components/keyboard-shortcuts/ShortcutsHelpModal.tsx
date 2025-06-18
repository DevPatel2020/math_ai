import { Button } from '../ui/button';

interface ShortcutInfo {
  key: string;
  description: string;
  modifiers?: {
    ctrl?: boolean;
    alt?: boolean;
    shift?: boolean;
  };
}

interface ShortcutsHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  shortcuts: ShortcutInfo[];
}

export function ShortcutsHelpModal({ isOpen, onClose, shortcuts }: ShortcutsHelpModalProps) {
  if (!isOpen) return null;
  
  const formatShortcut = (shortcut: ShortcutInfo) => {
    const parts = [];
    
    if (shortcut.modifiers?.ctrl) parts.push("Ctrl");
    if (shortcut.modifiers?.alt) parts.push("Alt");
    if (shortcut.modifiers?.shift) parts.push("Shift");
    
    // Format the key to be more readable
    let key = shortcut.key;
    if (key === ' ') key = 'Space';
    else if (key.length === 1) key = key.toUpperCase();
    
    parts.push(key);
    
    return parts.join(' + ');
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Keyboard Shortcuts</h2>
          <Button 
            onClick={onClose}
            variant="ghost"
            className="h-8 w-8 p-0"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              strokeWidth={1.5} 
              stroke="currentColor" 
              className="w-6 h-6"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M6 18L18 6M6 6l12 12" 
              />
            </svg>
          </Button>
        </div>
        
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {shortcuts.map((shortcut, index) => (
            <div key={index} className="py-2 flex justify-between">
              <span>{shortcut.description}</span>
              <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm font-mono">
                {formatShortcut(shortcut)}
              </kbd>
            </div>
          ))}
        </div>
        
        <div className="mt-4 text-right">
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  );
} 