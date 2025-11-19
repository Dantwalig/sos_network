// src/components/sos/EmergencyCategoryCard.tsx
import React from 'react';

interface EmergencyCategoryCardProps {
  category: string;
  icon: string;
  label: string;
  color: string;
  onClick: () => void;
}

export default function EmergencyCategoryCard({
  category,
  icon,
  label,
  color,
  onClick
}: EmergencyCategoryCardProps) {
  const colorClasses = {
    red: 'bg-red-50 hover:bg-red-100 border-red-300',
    pink: 'bg-pink-50 hover:bg-pink-100 border-pink-300',
    orange: 'bg-orange-50 hover:bg-orange-100 border-orange-300',
    purple: 'bg-purple-50 hover:bg-purple-100 border-purple-300',
    blue: 'bg-blue-50 hover:bg-blue-100 border-blue-300',
  };

  return (
    <button
      onClick={onClick}
      className={`${colorClasses[color as keyof typeof colorClasses]} border-2 p-6 rounded-xl transition-all transform hover:scale-105 hover:shadow-lg`}
    >
      <div className="text-4xl mb-2">{icon}</div>
      <div className="font-bold text-lg text-gray-800">{label}</div>
    </button>
  );
}