import { useId } from 'react';
import { cn } from '@/utils/cn';

interface SliderProps {
  label?: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
  formatValue?: (value: number) => string;
  className?: string;
  trackGradient?: string;
}

export function Slider({
  label,
  value,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  formatValue,
  className,
  trackGradient,
}: SliderProps) {
  const id = useId();
  const percent = ((value - min) / (max - min)) * 100;

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {label && (
        <div className="flex items-center justify-between">
          <label htmlFor={id} className="text-sm font-medium text-[var(--text-secondary)]">
            {label}
          </label>
          <span className="text-sm font-semibold tabular-nums text-[var(--text-primary)]">
            {formatValue ? formatValue(value) : value}
          </span>
        </div>
      )}
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="slider-input h-2 w-full cursor-pointer appearance-none rounded-full bg-[var(--glass-bg-strong)] outline-none"
        style={{
          background: trackGradient
            ? trackGradient
            : `linear-gradient(90deg, var(--color-primary-500) ${percent}%, var(--glass-bg-strong) ${percent}%)`,
        }}
      />
    </div>
  );
}
