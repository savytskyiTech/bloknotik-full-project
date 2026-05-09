import { Home, Calendar, User } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface BottomNavProps {
  activeTab: 'home' | 'schedule' | 'profile';
  onTabChange: (tab: 'home' | 'schedule' | 'profile') => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const tabs = [
    { id: 'home' as const, label: 'Головна', icon: Home },
    { id: 'schedule' as const, label: 'Розклад', icon: Calendar },
    { id: 'profile' as const, label: 'Профіль', icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 pb-safe bg-gradient-to-t from-background via-background/90 to-transparent pointer-events-none">
      <nav className="bg-white/80 backdrop-blur-xl border border-white/40 shadow-float rounded-3xl pointer-events-auto">
        <div className="flex justify-around items-center h-[72px] px-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={twMerge(
                  clsx(
                    'flex flex-col items-center justify-center gap-1 w-16 h-full relative transition-all duration-300',
                    isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground/70'
                  )
                )}
              >
                {isActive && (
                  <div className="absolute top-0 w-8 h-1 bg-primary rounded-b-full shadow-[0_0_10px_rgba(139,92,246,0.5)]" />
                )}
                <div className={clsx("p-1.5 rounded-xl transition-all duration-300", isActive && "bg-primary/10 mt-1")}>
                  <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span className={clsx("text-[10px] font-medium transition-all duration-300", isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 absolute bottom-2")}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
