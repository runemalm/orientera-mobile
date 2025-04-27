
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    // Event handlers to fix stuck active states on mobile
    const touchStartRef = React.useRef(false);
    
    const handleTouchStart = (e: React.TouchEvent<HTMLButtonElement>) => {
      touchStartRef.current = true;
      if (props.onTouchStart) {
        props.onTouchStart(e);
      }
    };
    
    const handleTouchEnd = (e: React.TouchEvent<HTMLButtonElement>) => {
      if (touchStartRef.current) {
        touchStartRef.current = false;
        // Force blur to remove any stuck active/focus states
        if (e.currentTarget) {
          e.currentTarget.blur();
          
          // Add a slight delay before removing any visual feedback
          setTimeout(() => {
            if (e.currentTarget) {
              e.currentTarget.classList.remove('active', 'focus');
              
              // Try to force style update
              e.currentTarget.style.backgroundColor = '';
              e.currentTarget.style.backgroundColor = null as any;
              
              // Trigger reflow
              void e.currentTarget.offsetHeight;
            }
          }, 10);
        }
      }
      if (props.onTouchEnd) {
        props.onTouchEnd(e);
      }
    };
    
    // Also handle touch cancel events
    const handleTouchCancel = (e: React.TouchEvent<HTMLButtonElement>) => {
      touchStartRef.current = false;
      
      if (e.currentTarget) {
        e.currentTarget.blur();
      }
      
      if (props.onTouchCancel) {
        props.onTouchCancel(e);
      }
    };

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchCancel}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
