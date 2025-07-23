import { Link, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items = [] }) => {
  const location = useLocation();

  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [{ label: 'Home', href: '/' }];

    if (pathSegments.length === 0) {
      return breadcrumbs;
    }

    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;

      if (segment === 'project' && pathSegments[index + 1]) {
        return;
      }

      const label = segment.charAt(0).toUpperCase() + segment.slice(1);
      breadcrumbs.push({
        label,
        href: index === pathSegments.length - 1 ? undefined : currentPath,
      });
    });

    return breadcrumbs;
  };

  const breadcrumbItems = items.length > 0 ? items : generateBreadcrumbs();

  return (
    <nav aria-label='Breadcrumb' className='mb-6'>
      <ol className='flex items-center space-x-2 text-sm text-muted-foreground'>
        {breadcrumbItems.map((item, index) => (
          <li key={index} className='flex items-center '>
            {index > 0 && (
              <ChevronRight
                size={16}
                className='mx-2 text-muted-foreground/50'
              />
            )}

            {item.href ? (
              <Link
                to={item.href}
                className='text-secondary hover:text-primary transition-colors flex items-center gap-1'>
                {item.label}
              </Link>
            ) : (
              <span className='text-foreground font-medium flex items-center gap-1'>
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
