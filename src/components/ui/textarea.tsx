
import * as React from 'react';

import {cn} from '@/lib/utils';
import { useLayoutEffect } from 'react';

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<'textarea'>>(
  ({className, ...props}, ref) => {
    const internalRef = React.useRef<HTMLTextAreaElement>(null);

    React.useImperativeHandle(ref, () => internalRef.current!);

    useLayoutEffect(() => {
      const textarea = internalRef.current;
      if (textarea) {
        textarea.style.height = '0px';
        const scrollHeight = textarea.scrollHeight;
        textarea.style.height = scrollHeight + 'px';
      }
    }, [props.value]);


    return (
      <textarea
        className={cn(
          'flex min-h-[40px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm resize-none overflow-y-hidden',
          className
        )}
        ref={internalRef}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';

export {Textarea};
