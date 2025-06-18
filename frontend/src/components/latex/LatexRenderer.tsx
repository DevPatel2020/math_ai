import { useEffect, useRef } from 'react';

interface LatexRendererProps {
  latex: string;
  className?: string;
  inline?: boolean;
}

export function LatexRenderer({ latex, className = '', inline = false }: LatexRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && window.MathJax) {
      // Use setTimeout to ensure the component is mounted
      setTimeout(() => {
        window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub, containerRef.current]);
      }, 0);
    }
  }, [latex]);

  const formattedLatex = inline 
    ? `\\(${latex}\\)` 
    : `\\[${latex}\\]`;

  return (
    <div 
      ref={containerRef} 
      className={className}
      dangerouslySetInnerHTML={{ __html: formattedLatex }}
    />
  );
} 