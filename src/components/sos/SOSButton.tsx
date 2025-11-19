// src/components/sos/SOSButton.tsx
import React from 'react';
import { AlertCircle } from 'lucide-react';

interface SOSButtonProps {
  category: 'medical' | 'maternity' | 'injury' | 'safety' | 'disability';
  icon: string;
  label: string;
  color: string;
  onClick: () => void;
}

export default function SOSButton({ category, icon, label, color, onClick }: SOSButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`bg-${color}-50 hover:bg-${color}-100 border-2 border-${color}-300 p-6 rounded-xl transition-all transform hover:scale-105 hover:shadow-lg`}
    >
      <div className="text-4xl mb-2">{icon}</div>
      <div className="font-bold text-lg text-gray-800">{label}</div>
    </button>
  );
}