import { useEffect } from 'react';

export function MathJaxConfig() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.9/MathJax.js?config=TeX-MML-AM_CHTML';
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      window.MathJax.Hub.Config({
        tex2jax: { 
          inlineMath: [['$', '$'], ['\\(', '\\)']], 
          displayMath: [['$$', '$$'], ['\\[', '\\]']],
          processEscapes: true 
        },
        TeX: {
          equationNumbers: { autoNumber: "AMS" },
          extensions: ["AMSmath.js", "AMSsymbols.js", "noErrors.js", "noUndefined.js"]
        },
        messageStyle: "none",
        showMathMenu: false,
        styles: {
          ".MathJax": {
            "font-size": "120%"
          }
        }
      });
    };

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  return null;
}

export default MathJaxConfig; 