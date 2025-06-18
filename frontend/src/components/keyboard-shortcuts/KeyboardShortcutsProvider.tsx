import { createContext, useContext, useEffect, ReactNode, useRef, useCallback, useMemo } from 'react';

interface KeyboardShortcutsContextType {
  registerShortcut: (
    key: string, 
    callback: () => void, 
    modifiers?: {
      ctrl?: boolean;
      alt?: boolean;
      shift?: boolean;
    }
  ) => void;
  unregisterShortcut: (key: string) => void;
}

// Move context to a separate export
export const KeyboardShortcutsContext = createContext<KeyboardShortcutsContextType>({
  registerShortcut: () => {},
  unregisterShortcut: () => {},
});

export const useKeyboardShortcuts = () => useContext(KeyboardShortcutsContext);

interface ShortcutDefinition {
  key: string;
  callback: () => void;
  modifiers?: {
    ctrl?: boolean;
    alt?: boolean;
    shift?: boolean;
  };
}

export function KeyboardShortcutsProvider({ children }: { children: ReactNode }) {
  // Use useRef to keep shortcuts stable across renders
  const shortcutsRef = useRef(new Map<string, ShortcutDefinition>());

  // Use useCallback for stable function references
  const getShortcutId = useCallback((
    key: string, 
    modifiers?: {
      ctrl?: boolean;
      alt?: boolean;
      shift?: boolean;
    }
  ) => {
    const ctrl = modifiers?.ctrl ? 'ctrl+' : '';
    const alt = modifiers?.alt ? 'alt+' : '';
    const shift = modifiers?.shift ? 'shift+' : '';
    return `${ctrl}${alt}${shift}${key.toLowerCase()}`;
  }, []);

  const registerShortcut = useCallback((
    key: string, 
    callback: () => void,
    modifiers?: {
      ctrl?: boolean;
      alt?: boolean;
      shift?: boolean;
    }
  ) => {
    const shortcutId = getShortcutId(key, modifiers);
    shortcutsRef.current.set(shortcutId, { key, callback, modifiers });
  }, [getShortcutId]);

  const unregisterShortcut = useCallback((key: string, modifiers?: {
    ctrl?: boolean;
    alt?: boolean;
    shift?: boolean;
  }) => {
    const shortcutId = getShortcutId(key, modifiers);
    shortcutsRef.current.delete(shortcutId);
  }, [getShortcutId]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip if user is typing in an input, textarea, or contentEditable element
      if (
        e.target instanceof HTMLInputElement || 
        e.target instanceof HTMLTextAreaElement ||
        (e.target instanceof HTMLElement && e.target.isContentEditable)
      ) {
        return;
      }

      const key = e.key.toLowerCase();
      const shortcutId = getShortcutId(key, {
        ctrl: e.ctrlKey,
        alt: e.altKey,
        shift: e.shiftKey,
      });

      const shortcut = shortcutsRef.current.get(shortcutId);
      if (shortcut) {
        e.preventDefault();
        shortcut.callback();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [getShortcutId]);

  // Use useMemo instead of useCallback for contextValue
  const contextValue = useMemo(() => ({
    registerShortcut,
    unregisterShortcut
  }), [registerShortcut, unregisterShortcut]);

  return (
    <KeyboardShortcutsContext.Provider value={contextValue}>
      {children}
    </KeyboardShortcutsContext.Provider>
  );
} 