import React from 'react';
import { Alert, AlertDescription } from './alert';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './button';

interface DatabaseErrorNotificationProps {
  error: Error | null;
  fallbackCount: number;
  onRetry: () => void;
  isRetrying: boolean;
  className?: string;
}

export function DatabaseErrorNotification({
  error,
  fallbackCount,
  onRetry,
  isRetrying,
  className = '',
}: DatabaseErrorNotificationProps) {
  if (!error) return null;

  return (
    <Alert className={`border-destructive/50 bg-destructive/10 text-destructive ${className}`}>
      <AlertCircle className="h-4 w-4" />
      <AlertDescription className="flex flex-col gap-2">
        Failed to fetch from database. Showing cached/mocks ({fallbackCount} available).
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          disabled={isRetrying}
          className="gap-2 h-8"
        >
          {isRetrying ? (
            <>
              <RefreshCw className="h-3 w-3 animate-spin" />
              Retrying...
            </>
          ) : (
            <>
              <RefreshCw className="h-3 w-3" />
              Retry
            </>
          )}
        </Button>
      </AlertDescription>
    </Alert>
  );
}

