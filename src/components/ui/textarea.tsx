
import * as React from 'react';
import {cn} from '@/lib/utils';

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<'textarea'>>(
  ({ className, value, ...props }, ref) => {
    const internalRef = React.useRef<HTMLTextAreaElement>(null);

    React.useImperativeHandle(ref, () => internalRef.current!, []);

    React.useLayoutEffect(() => {
      const textarea = internalRef.current;
      if (textarea) {
        // Temporarily shrink textarea to get the real scrollHeight
        textarea.style.height = '0px';
        const scrollHeight = textarea.scrollHeight;

        // Set the height to the scrollHeight, but don't exceed a max-height
        textarea.style.height = `${scrollHeight}px`;
      }
    }, [value]);

    return (
      <textarea
        className={cn(
          'flex min-h-[40px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none overflow-y-hidden max-h-48',
          className
        )}
        ref={internalRef}
        value={value}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';

export { Textarea };
