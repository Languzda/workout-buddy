import { Link, useLocation } from 'react-router';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { useTraining } from '@/hooks/useTraining';

const Navigation = () => {
  const location = useLocation();
  const { getActiveTrainingId } = useTraining();
  const hasActiveTraining = getActiveTrainingId() !== null;

  const navItems = [
    {
      label: 'Treningi',
      href: '/trainings',
      active: location.pathname.startsWith('/trainings'),
    },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-background border-b border-border shadow-sm p-4">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          <div className="flex items-center min-w-0">
            <Link
              to="/"
              className="text-lg sm:text-xl font-bold text-primary hover:text-primary/80 transition-colors truncate"
            >
              Workout Buddy
            </Link>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
            {navItems.map((item) => (
              <Link key={item.href} to={item.href}>
                <Button
                  variant={item.active ? 'default' : 'ghost'}
                  size="sm"
                  className={cn(
                    'transition-all duration-200 text-xs sm:text-sm px-2 sm:px-4',
                    item.active && 'shadow-sm',
                  )}
                >
                  {item.label}
                </Button>
              </Link>
            ))}

            {hasActiveTraining && (
              <Link to="/">
                <Button
                  variant={location.pathname === '/' ? 'secondary' : 'outline'}
                  size="sm"
                  className="transition-all duration-200 text-xs sm:text-sm px-2 sm:px-4"
                >
                  Aktywny
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
