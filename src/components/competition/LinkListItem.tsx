
import React from 'react';
import { Link } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';

interface LinkListItemProps {
  icon: LucideIcon;
  title: React.ReactNode;
  to?: string;
  href?: string;
  rightText?: string;
  iconClassName?: string;
}

const LinkListItem: React.FC<LinkListItemProps> = ({
  icon: Icon,
  title,
  to,
  href,
  rightText,
  iconClassName = "text-forest"
}) => {
  const content = (
    <>
      <div className="flex items-center gap-3">
        <Icon size={20} className={iconClassName} />
        <span className="font-medium">{title}</span>
      </div>
      <div className="flex items-center gap-2">
        {rightText && <span className="text-sm text-gray-500">{rightText}</span>}
        <div className="text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m9 18 6-6-6-6"/>
          </svg>
        </div>
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

export default LinkListItem;
