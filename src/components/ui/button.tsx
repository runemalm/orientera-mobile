
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
    
    // Enhanced touch handling for mobile devices
    const touchStartRef = React.useRef(false);
    const buttonRef = React.useRef<HTMLButtonElement | null>(null);
    
    // Combined ref handling
    const handleRef = (el: HTMLButtonElement) => {
      buttonRef.current = el;
      if (typeof ref === 'function') {
        ref(el);
      } else if (ref) {
        ref.current = el;
      }
    };
    
    // Reset any stuck states when the component mounts or unmounts
    React.useEffect(() => {
      const current = buttonRef.current;
      
      return () => {
        // Clean up any potential stuck states on unmount
        if (current) {
          current.blur();
          current.classList.remove('active', 'focus', 'hover');
        }
      };
    }, []);
    
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
          // Add a small timeout to ensure the tap is registered before removing the visual feedback
          setTimeout(() => {
            if (e.currentTarget) {
              e.currentTarget.blur();
              
              // Reset any stuck states
              e.currentTarget.classList.remove('active', 'focus', 'hover');
              
              // Force style reset
              const btn = e.currentTarget as HTMLElement;
              const originalBg = window.getComputedStyle(btn).backgroundColor;
              
              // Use a style reset technique
              btn.style.transition = 'none';
              btn.style.backgroundColor = originalBg;
              
              // Trigger reflow
              void btn.offsetHeight;
              
              // Restore transition
              requestAnimationFrame(() => {
                if (btn) {
                  btn.style.transition = '';
                }
              });
            }
          }, 50);
        }
      }
      
      if (props.onTouchEnd) {
        props.onTouchEnd(e);
      }
    };
    
    // Handle touch cancel events
    const handleTouchCancel = (e: React.TouchEvent<HTMLButtonElement>) => {
      touchStartRef.current = false;
      
      if (e.currentTarget) {
        e.currentTarget.blur();
        e.currentTarget.classList.remove('active', 'focus', 'hover');
      }
      
      if (props.onTouchCancel) {
        props.onTouchCancel(e);
      }
    };
    
    // Ensure proper cleanup on page navigation
    React.useEffect(() => {
      const handleBeforeUnload = () => {
        if (buttonRef.current) {
          buttonRef.current.blur();
          buttonRef.current.classList.remove('active', 'focus', 'hover');
        }
      };
      
      window.addEventListener('beforeunload', handleBeforeUnload);
      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }, []);

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={handleRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchCancel}
        data-touch-button="true"
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
