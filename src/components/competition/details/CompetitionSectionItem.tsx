
import React from 'react';
import { Link } from 'react-router-dom';
import { LucideIcon, ChevronRight } from 'lucide-react';

interface CompetitionSectionItemProps {
  icon: LucideIcon;
  title: string;
  count?: number;
  to?: string;
  href?: string;
  iconClassName?: string;
}

const CompetitionSectionItem: React.FC<CompetitionSectionItemProps> = ({
  icon: Icon,
  title,
  count,
  to,
  href,
  iconClassName = "text-forest"
}) => {
  const content = (
    <>
      <div className="flex items-center gap-3">
        <Icon size={20} className={iconClassName} />
        <span className="font-medium">{title}</span>
      </div>
      <div className="flex items-center gap-2">
        {count !== undefined && (
          <span className="text-sm text-gray-500">{count}</span>
        )}
        <ChevronRight className="text-gray-400" size={20} />
      </div>
    </>
  );

  if (to) {
    return (
      <Link to={to} className="flex items-center justify-between p-4">
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-between p-4"
      >
        {content}
      </a>
    );
  }

  return (
    <div className="flex items-center justify-between p-4">
      {content}
    </div>
  );
};

export default CompetitionSectionItem;

