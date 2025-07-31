
import React from 'react';

export const TrustBadges: React.FC = () => {
  const badges = [
    {
      text: 'SSL Secured',
      description: '256-bit encryption'
    },
    {
      text: 'GDPR Ready',
      description: 'Data protection'
    },
    {
      text: '99% Success Rate',
      description: 'Proven track record'
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        {badges.map((badge, index) => (
          <div
            key={index}
            className="flex items-center gap-1.5 text-sm p-2 rounded-md hover:text-[#4A90E2] transition-all duration-300"
          >
            <svg className="w-4 h-4 text-accent-green" fill="none" viewBox="0 0 24 24">
              <use href="/assets/sprite.svg#icon-tick" />
            </svg>
            <span className="text-neutral-50">{badge.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
