import { useEffect, useState } from 'react';
import { Pipette } from 'lucide-react';
import { ColorSwatch } from './ColorSwatch';
import { Input } from './Input';
import { normalizeHex } from '@/utils/color/format';
import { cn } from '@/utils/cn';

interface ColorPickerFieldProps {
  value: string;
  onChange: (hex: string) => void;
  label?: string;
  placeholder?: string;
  ariaLabel?: string;
  swatchSize?: 'sm' | 'md' | 'lg' | 'xl';
  uppercaseInput?: boolean;
  className?: string;
}

/** Swatch (click to open the native color picker) + a free-text hex/rgb/hsl input, so anyone who doesn't know a color code by heart can still pick one visually. */
export function ColorPickerField({
  value,
  onChange,
  label,
  placeholder,
  ariaLabel,
  swatchSize = 'lg',
  uppercaseInput = true,
  className,
}: ColorPickerFieldProps) {
  const [text, setText] = useState(value);

  useEffect(() => {
    setText(value);
  }, [value]);

  const handleTextChange = (raw: string) => {
    setText(raw);
    const normalized = normalizeHex(raw);
    if (normalized) onChange(normalized);
  };

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className="relative shrink-0">
        <ColorSwatch hex={value} size={swatchSize} copyOnClick={false} />
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label={`Pick ${(label ?? ariaLabel ?? 'color').toLowerCase()} visually`}
          className="absolute inset-0 size-full cursor-pointer opacity-0"
        />
      </div>
      <div className="min-w-0 flex-1">
        <Input
          label={label}
          value={text}
          onChange={(e) => handleTextChange(e.target.value)}
          onBlur={() => setText(value)}
          prefix={<Pipette className="size-4 text-[var(--text-tertiary)]" />}
          placeholder={placeholder}
          aria-label={!label ? ariaLabel : undefined}
          className={cn('font-mono', uppercaseInput && 'uppercase')}
        />
      </div>
    </div>
  );
}
