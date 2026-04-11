import React, { useState, useEffect } from 'react';
import styles from '../styles/Accessibility.module.css';

const ACCESSIBILITY_KEY = 'archval_accessibility';

/**
 * AccessibilityBar - Accessibility controls (contrast, text size, keyboard nav)
 */
export function AccessibilityBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [textSize, setTextSize] = useState('normal');
  const [reduceMotion, setReduceMotion] = useState(false);

  // Load preferences on mount
  useEffect(() => {
    const stored = localStorage.getItem(ACCESSIBILITY_KEY);
    if (stored) {
      const prefs = JSON.parse(stored);
      setHighContrast(prefs.highContrast);
      setTextSize(prefs.textSize);
      setReduceMotion(prefs.reduceMotion);
    }
  }, []);

  // Apply preferences to document
  useEffect(() => {
    const doc = document.documentElement;
    
    if (highContrast) {
      doc.classList.add('high-contrast');
    } else {
      doc.classList.remove('high-contrast');
    }

    doc.setAttribute('data-text-size', textSize);

    if (reduceMotion) {
      doc.classList.add('reduce-motion');
    } else {
      doc.classList.remove('reduce-motion');
    }

    // Save preferences
    localStorage.setItem(ACCESSIBILITY_KEY, JSON.stringify({
      highContrast,
      textSize,
      reduceMotion
    }));
  }, [highContrast, textSize, reduceMotion]);

  const handleReset = () => {
    setHighContrast(false);
    setTextSize('normal');
    setReduceMotion(false);
  };

  return (
    <>
      {/* Keyboard navigation skip link - must be outside the fixed bar */}
      <a href="#main" className={styles.skipLink}>
        Skip to main content
      </a>

      <div className={styles.bar}>
        <button
          className={styles.toggle}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Accessibility options"
          title="Accessibility Options"
        >
          ♿
        </button>

        {isOpen && (
          <div className={styles.panel}>
            <h3>Accessibility Options</h3>

            <label className={styles.option}>
              <input
                type="checkbox"
                checked={highContrast}
                onChange={(e) => setHighContrast(e.target.checked)}
                aria-label="High contrast mode"
              />
              <span>High Contrast</span>
            </label>

            <div className={styles.option}>
              <label htmlFor="text-size">Text Size:</label>
              <select
                id="text-size"
                value={textSize}
                onChange={(e) => setTextSize(e.target.value)}
                aria-label="Text size adjustment"
              >
                <option value="small">Small</option>
                <option value="normal">Normal</option>
                <option value="large">Large</option>
                <option value="xlarge">Extra Large</option>
              </select>
            </div>

            <label className={styles.option}>
              <input
                type="checkbox"
                checked={reduceMotion}
                onChange={(e) => setReduceMotion(e.target.checked)}
                aria-label="Reduce motion"
              />
              <span>Reduce Motion</span>
            </label>

            <button onClick={handleReset} className={styles.resetBtn}>
              Reset to Defaults
            </button>

            <button
              onClick={() => setIsOpen(false)}
              className={styles.closeBtn}
              aria-label="Close accessibility options"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </>
  );
}
