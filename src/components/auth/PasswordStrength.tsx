import React from 'react';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface PasswordStrengthProps {
  password: string;
  className?: string;
}

const PasswordStrength: React.FC<PasswordStrengthProps> = ({ password, className = '' }) => {
  const getStrength = (pwd: string): number => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^a-zA-Z0-9]/.test(pwd)) score++;
    return score;
  };

  const strength = getStrength(password);
  const color = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'][strength] || 'bg-gray-500';

  const strengthText = ['Weak', 'Weak', 'Fair', 'Good', 'Strong'][strength] || 'Enter password';

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center gap-2 text-sm">
        <span className="font-medium">Password Strength:</span>
        <span className={`font-semibold capitalize ${['text-red-600', 'text-orange-600', 'text-yellow-600', 'text-blue-600', 'text-green-600'][strength] || 'text-gray-500'}`}>
          {strengthText}
        </span>
      </div>
      <Progress value={(strength / 5) * 100} className="h-2">
        <div className={`h-full ${color} transition-all duration-200 rounded-full`} />
      </Progress>
      {strength < 4 && (
        <ul className="text-xs text-muted-foreground space-y-1">
          {password.length < 8 && <li className="flex items-center gap-1"><AlertCircle className="w-3 h-3" />8+ characters</li>}
          !/[a-z]/.test(password) && <li className="flex items-center gap-1"><AlertCircle className="w-3 h-3" />Lowercase letter</li>
          !/[A-Z]/.test(password) && <li className="flex items-center gap-1"><AlertCircle className="w-3 h-3" />Uppercase letter</li>
          !/[0-9]/.test(password) && <li className="flex items-center gap-1"><AlertCircle className="w-3 h-3" />Number</li>
          !/[^a-zA-Z0-9]/.test(password) && <li className="flex items-center gap-1"><AlertCircle className="w-3 h-3" />Special character</li>
        </ul>
      )}
      {strength === 5 && (
        <div className="flex items-center gap-2 text-xs text-green-600">
          <CheckCircle2 className="w-4 h-4" />
          Strong password!
        </div>
      )}
    </div>
  );
};

export default PasswordStrength;

