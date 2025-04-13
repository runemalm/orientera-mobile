
import React, { useState, useEffect, useRef, ReactNode } from 'react';
import { RefreshCw } from 'lucide-react';

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: ReactNode;
  pullDownThreshold?: number;
  loadingIndicator?: ReactNode;
}

const PullToRefresh: React.FC<PullToRefreshProps> = ({
  onRefresh,
  children,
  pullDownThreshold = 80,
  loadingIndicator
}) => {
  const [isPulling, setIsPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const startYRef = useRef<number | null>(null);
  const animationRef = useRef<ReturnType<typeof requestAnimationFrame> | null>(null);
  const isMouseDown = useRef<boolean>(false);

  // Clean up animation frame on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    // Only enable pull-to-refresh when at the top of the page
    if (window.scrollY === 0) {
      startYRef.current = e.touches[0].clientY;
      setIsPulling(true);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isPulling || startYRef.current === null) return;

    const currentY = e.touches[0].clientY;
    const diff = currentY - startYRef.current;

    // Only allow pulling down (positive diff)
    if (diff > 0) {
      // Add resistance to make it harder to pull down
      const resistance = 0.4;
      const newPullDistance = Math.min(diff * resistance, pullDownThreshold * 1.5);
      setPullDistance(newPullDistance);

      // Prevent default scrolling behavior when pulling
      e.preventDefault();
    }
  };

  // Mouse event handlers for desktop support
  const handleMouseDown = (e: React.MouseEvent) => {
    // Only enable pull-to-refresh when at the top of the page
    if (window.scrollY === 0) {
      startYRef.current = e.clientY;
      setIsPulling(true);
      isMouseDown.current = true;
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPulling || startYRef.current === null || !isMouseDown.current) return;

    const currentY = e.clientY;
    const diff = currentY - startYRef.current;

    // Only allow pulling down (positive diff)
    if (diff > 0) {
      // Add resistance to make it harder to pull down
      const resistance = 0.4;
      const newPullDistance = Math.min(diff * resistance, pullDownThreshold * 1.5);
      setPullDistance(newPullDistance);

      // Prevent default behavior
      e.preventDefault();
    }
  };

  const handleMouseUp = async () => {
    if (!isPulling || !isMouseDown.current) return;
    
    isMouseDown.current = false;
    
    if (pullDistance > pullDownThreshold) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
        resetPullState();
      }
    } else {
      resetPullState();
    }

    startYRef.current = null;
  };

  // Also handle mouse leave for better desktop experience
  const handleMouseLeave = () => {
    if (isMouseDown.current) {
      isMouseDown.current = false;
      resetPullState();
      startYRef.current = null;
    }
  };

  const resetPullState = () => {
    const resetAnimation = () => {
      setPullDistance((prevDistance) => {
        const newDistance = prevDistance * 0.85;

        if (newDistance < 1) {
          setPullDistance(0);
          setIsPulling(false);
          return 0;
        }

        animationRef.current = requestAnimationFrame(resetAnimation);
        return newDistance;
      });
    };

    animationRef.current = requestAnimationFrame(resetAnimation);
  };

  const handleTouchEnd = async () => {
    if (!isPulling) return;

    if (pullDistance > pullDownThreshold) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
        resetPullState();
      }
    } else {
      resetPullState();
    }

    startYRef.current = null;
  };

  const defaultLoadingIndicator = (
    <div className={`flex items-center justify-center h-${Math.max(16, pullDistance)}px transition-all duration-200`}>
      <RefreshCw
        className={`text-primary ${isRefreshing ? 'animate-spin' : ''}`}
        style={{
          transform: !isRefreshing ? `rotate(${(pullDistance / pullDownThreshold) * 360}deg)` : 'none',
          opacity: Math.min(1, pullDistance / (pullDownThreshold * 0.8))
        }}
      />
    </div>
  );

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      className="relative w-full"
      style={{ cursor: isPulling ? 'grabbing' : 'default' }}
    >
      <div
        className="transition-transform duration-200 w-full flex flex-col"
        style={{
          transform: `translateY(${pullDistance}px)`
        }}
      >
        <div
          className="absolute top-0 left-0 w-full overflow-hidden transform -translate-y-full flex justify-center items-center"
          style={{ height: `${pullDistance}px` }}
        >
          {loadingIndicator || defaultLoadingIndicator}
        </div>
        {children}
      </div>
    </div>
  );
};

export default PullToRefresh;
