import { Link, useLocation } from "wouter";
import { Home, ListChecks, Syringe, Book, Settings, Heart } from "lucide-react";

const Navigation = () => {
  const [location] = useLocation();

  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/tasks", icon: ListChecks, label: "Tasks" },
    { path: "/vaccines", icon: Syringe, label: "Vaccines" },
    { path: "/diary", icon: Book, label: "Diary" },
  ];

  return (
    <>
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 text-white p-4 sticky top-0 z-50 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <span className="text-2xl">🐾</span>
            </div>
            <div>
              <h1 className="text-xl font-bold">Pet Routine Tracker</h1>
              <p className="text-xs text-white/80">Keep your pets happy & healthy</p>
            </div>
          </div>
          <button className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 backdrop-blur-sm">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-200/50 z-50 max-w-md mx-auto shadow-2xl">
        <div className="flex justify-around py-3">
          {navItems.map((item) => {
            const isActive = location === item.path;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex flex-col items-center py-2 px-4 transition-all duration-200 rounded-xl ${
                  isActive
                    ? "text-purple-600 bg-purple-50 scale-105"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Icon className={`w-6 h-6 mb-1 ${isActive ? 'drop-shadow-sm' : ''}`} />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default Navigation;
