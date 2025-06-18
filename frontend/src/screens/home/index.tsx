import { ColorSwatch, Group } from '@mantine/core';
import { Button } from '@/components/ui/button';
import { useEffect, useRef, useState, useCallback } from 'react';
import axios from 'axios';
import Draggable from 'react-draggable';
import { SWATCHES } from '@/constants';
import { ThemeToggle } from '@/components/theme';
import { HistoryPanel } from '@/components/history';
import { useKeyboardShortcuts, ShortcutsHelpModal } from '@/components/keyboard-shortcuts';
import { LatexRenderer } from '@/components/latex';

interface GeneratedResult {
    expression: string;
    answer: string;
}

interface Response {
    expr: string;
    result: string;
    assign: boolean;
}

interface HistoryItem {
    expression: string;
    result: string;
    timestamp: Date;
}

export default function Home() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [color, setColor] = useState('rgb(255, 255, 255)');
    const [reset, setReset] = useState(false);
    const [dictOfVars, setDictOfVars] = useState({});
    const [result, setResult] = useState<GeneratedResult>();
    const [latexPosition, setLatexPosition] = useState({ x: 10, y: 200 });
    const [latexExpressions, setLatexExpressions] = useState<Array<{latex: string; position: {x: number, y: number}}>>([]); 
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false);
    const { registerShortcut } = useKeyboardShortcuts();

    const shortcuts = [
        { key: 'r', description: 'Reset canvas', modifiers: { ctrl: true } },
        { key: 'Enter', description: 'Run calculation' },
        { key: 'h', description: 'Toggle history panel', modifiers: { ctrl: true } },
        { key: '?', description: 'Show keyboard shortcuts', modifiers: { shift: true } },
        { key: 'c', description: 'Clear canvas', modifiers: { ctrl: true } },
        { key: 'Escape', description: 'Close open panels' }
    ];

    // Wrap resetCanvas in useCallback
    const resetCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        }
    }, []);

    // Wrap runRoute in useCallback
    const runRoute = useCallback(async () => {
        const canvas = canvasRef.current;
        if (canvas) {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/calculate`, {
                image: canvas.toDataURL('image/png'),
                dict_of_vars: dictOfVars
            });

            const resp = await response.data;
            console.log('Response:', resp);

            resp.data.forEach((data: Response) => {
                if (data.assign) {
                    setDictOfVars((prev) => ({
                        ...prev,
                        [data.expr]: data.result
                    }));
                }
            });

            // Get bounding box for non-transparent pixels
            const ctx = canvas.getContext('2d');
            const imageData = ctx!.getImageData(0, 0, canvas.width, canvas.height);
            let minX = canvas.width, minY = canvas.height, maxX = 0, maxY = 0;

            for (let y = 0; y < canvas.height; y++) {
                for (let x = 0; x < canvas.width; x++) {
                    const i = (y * canvas.width + x) * 4;
                    if (imageData.data[i + 3] > 0) { // If pixel is not transparent
                        minX = Math.min(minX, x);
                        minY = Math.min(minY, y);
                        maxX = Math.max(maxX, x);
                        maxY = Math.max(maxY, y);
                    }
                }
            }

            setLatexPosition({ x: (minX + maxX) / 2, y: (minY + maxY) / 2 });

            resp.data.forEach((data: Response) => {
                setTimeout(() => {
                    setResult({
                        expression: data.expr,
                        answer: data.result
                    });
                }, 1000);
            });
        }
    }, [dictOfVars]);

    // Register keyboard shortcuts with fixed dependencies
    useEffect(() => {
        // Register reset shortcut (Ctrl+R)
        registerShortcut('r', () => setReset(true), { ctrl: true });
        
        // Register run shortcut (Enter)
        registerShortcut('Enter', runRoute);
        
        // Register history toggle shortcut (Ctrl+H)
        registerShortcut('h', () => setIsHistoryOpen(!isHistoryOpen), { ctrl: true });
        
        // Register shortcuts help modal shortcut (Shift+?)
        registerShortcut('?', () => setIsShortcutsModalOpen(true), { shift: true });
        
        // Register clear canvas shortcut (Ctrl+C)
        registerShortcut('c', resetCanvas, { ctrl: true });
        
        // Register escape shortcut to close any open modals/panels
        registerShortcut('Escape', () => {
            if (isShortcutsModalOpen) setIsShortcutsModalOpen(false);
            else if (isHistoryOpen) setIsHistoryOpen(false);
        });
    }, [isHistoryOpen, isShortcutsModalOpen, registerShortcut, runRoute, resetCanvas]);

    // ✅ Memoized function to prevent re-creation on re-renders
    const addLatexExpression = useCallback((expression: string, answer: string, position: {x: number, y: number}) => {
        const latexFormula = `${expression} = ${answer}`;
        setLatexExpressions(prev => [...prev, { latex: latexFormula, position }]);

        // Clear the canvas
        resetCanvas();
    }, [resetCanvas]);

    useEffect(() => {
        if (result) {
            addLatexExpression(result.expression, result.answer, latexPosition);
            
            // Add to history
            setHistory(prev => [
                {
                    expression: result.expression,
                    result: result.answer,
                    timestamp: new Date()
                },
                ...prev
            ]);
        }
    }, [result, addLatexExpression, latexPosition]);

    useEffect(() => {
        if (reset) {
            resetCanvas();
            setLatexExpressions([]);
            setResult(undefined);
            setDictOfVars({});
            setReset(false);
        }
    }, [reset]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight - canvas.offsetTop;
                ctx.lineCap = 'round';
                ctx.lineWidth = 3;
            }
        }

        // Load history from localStorage if available
        const savedHistory = localStorage.getItem('calculationHistory');
        if (savedHistory) {
            try {
                const parsedHistory = JSON.parse(savedHistory);
                // Convert string timestamps back to Date objects
                setHistory(parsedHistory.map((item: Record<string, unknown>) => ({
                    ...item,
                    timestamp: new Date(item.timestamp as string)
                })));
            } catch (error) {
                console.error('Failed to parse history:', error);
            }
        }
    }, []);

    // Save history to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('calculationHistory', JSON.stringify(history));
    }, [history]);

    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (canvas) {
            canvas.style.background = 'black';
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.beginPath();
                ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
                setIsDrawing(true);
            }
        }
    };

    const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.strokeStyle = color;
                ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
                ctx.stroke();
            }
        }
    };

    const stopDrawing = () => setIsDrawing(false);

    const handleClearHistory = () => {
        setHistory([]);
    };

    const handleReuseHistoryItem = (item: HistoryItem) => {
        setResult({
            expression: item.expression,
            answer: item.result
        });
    };

    return (
        <>
            <div className='grid grid-cols-5 gap-2'>
                <Button onClick={() => setReset(true)} className='z-20 bg-black dark:bg-white text-white dark:text-black'>
                    Reset
                </Button>
                <Group className='z-20'>
                    {SWATCHES.map((swatch) => (
                        <ColorSwatch key={swatch} color={swatch} onClick={() => setColor(swatch)} />
                    ))}
                </Group>
                <Button onClick={runRoute} className='z-20 bg-black dark:bg-white text-white dark:text-black'>
                    Run
                </Button>
                <Button
                    onClick={() => setIsHistoryOpen(!isHistoryOpen)}
                    className="z-20 bg-black dark:bg-white text-white dark:text-black"
                >
                    History
                </Button>
                <div className="flex justify-end z-20 gap-2">
                    <Button
                        onClick={() => setIsShortcutsModalOpen(true)}
                        className="z-20 bg-black dark:bg-white text-white dark:text-black"
                    >
                        ⌨️ Shortcuts
                    </Button>
                    <ThemeToggle />
                </div>
            </div>
            <canvas
                ref={canvasRef}
                id='canvas'
                className='absolute top-0 left-0 w-full h-full dark:bg-gray-900'
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseOut={stopDrawing}
            />

            {latexExpressions.map((item, index) => (
                <Draggable 
                    key={index} 
                    defaultPosition={item.position} 
                    onStop={(e, data) => {
                        const newExpressions = [...latexExpressions];
                        newExpressions[index] = {
                            ...newExpressions[index],
                            position: { x: data.x, y: data.y }
                        };
                        setLatexExpressions(newExpressions);
                    }}
                >
                    <div className="absolute p-2 bg-black dark:bg-gray-800 text-white dark:text-gray-100 rounded shadow-md">
                        <LatexRenderer 
                            latex={item.latex} 
                            className="latex-content" 
                            inline={false}
                        />
                    </div>
                </Draggable>
            ))}

            <HistoryPanel
                history={history}
                onReuse={handleReuseHistoryItem}
                onClear={handleClearHistory}
                isOpen={isHistoryOpen}
                onToggle={() => setIsHistoryOpen(!isHistoryOpen)}
            />

            <ShortcutsHelpModal
                isOpen={isShortcutsModalOpen}
                onClose={() => setIsShortcutsModalOpen(false)}
                shortcuts={shortcuts}
            />
        </>
    );
}
