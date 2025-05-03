
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { CalendarCheck, Trophy, Clock } from 'lucide-react';

const SkeletonProfile: React.FC = () => {
  return (
    <>
      {/* Profile Card Skeleton */}
      <Card className="w-full border-primary/20">
        <CardHeader className="pb-2">
          <Skeleton className="h-6 w-44 mx-auto" />
        </CardHeader>
        <CardContent className="pb-6">
          <div className="flex flex-col items-center gap-4">
            <Skeleton className="h-20 w-20 rounded-full" />
            
            <div className="text-center space-y-2 w-full">
              <Skeleton className="h-6 w-40 mx-auto" />
              <Skeleton className="h-4 w-56 mx-auto" />
              <Skeleton className="h-4 w-48 mx-auto" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Features Card Skeleton */}
      <Card className="w-full">
        <CardHeader className="pb-2">
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="pb-6">
          <div className="grid grid-cols-1 gap-4">
            {/* Feature Item 1 */}
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-primary/10 p-2 mt-0.5">
                <CalendarCheck className="h-4 w-4 text-primary/40" />
              </div>
              <div className="flex-1">
                <Skeleton className="h-5 w-40 mb-2" />
                <Skeleton className="h-3 w-full" />
              </div>
            </div>
            
            {/* Feature Item 2 */}
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-primary/10 p-2 mt-0.5">
                <Trophy className="h-4 w-4 text-primary/40" />
              </div>
              <div className="flex-1">
                <Skeleton className="h-5 w-36 mb-2" />
                <Skeleton className="h-3 w-full" />
              </div>
            </div>
            
            {/* Feature Item 3 */}
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-primary/10 p-2 mt-0.5">
                <Clock className="h-4 w-4 text-primary/40" />
              </div>
              <div className="flex-1">
                <Skeleton className="h-5 w-44 mb-2" />
                <Skeleton className="h-3 w-full" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Skeleton */}
      <Card className="w-full bg-primary/5 border-primary/10">
        <CardContent className="p-6">
          <div className="space-y-4">
            <Skeleton className="h-5 w-32 mx-auto" />
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Skeleton className="h-8 w-16 mx-auto" />
                <Skeleton className="h-4 w-24 mx-auto" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-8 w-16 mx-auto" />
                <Skeleton className="h-4 w-24 mx-auto" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default SkeletonProfile;
