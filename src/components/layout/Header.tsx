import {Link} from "react-router-dom";
import SearchBar from "./SearchBar.tsx";
import {LogOut, Plus, User} from "lucide-react";
import {useAuth} from "../../hooks/useAuth.ts";

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="bg-primary text-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-4 md:h-20 md:flex-row md:items-center md:justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="text-2xl">🤿</span>
          <span className="font-bold text-xl tracking-tighter group-hover:text-light transition-colors">
            Abyss-<span className="text-secondary">SOCIAL</span>
          </span>
        </Link>

        {isAuthenticated && user && (
            <div className="flex w-full flex-1 flex-col gap-4 md:mx-8 md:max-w-4xl md:flex-row md:items-center md:justify-end">
              <SearchBar />

              <nav className="flex items-center gap-6 font-medium md:gap-8">
                <Link to="/me" className="group relative flex items-center justify-center">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-white/60 text-white transition-all duration-300 group-hover:border-secondary group-hover:text-secondary group-hover:scale-110 group-hover:bg-secondary/5">
                    <User size={18} />
                  </div>
                  {/* Tooltip Profile */}
                  <span className="absolute -bottom-10 scale-0 rounded-lg bg-gray-900/90 px-3 py-1.5 text-xs text-white shadow-xl transition-all duration-200 group-hover:scale-100 origin-top">
                    Profil
                  </span>
                </Link>
                <Link to="/post/create" className="group relative flex items-center justify-center">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-white/60 text-white transition-all duration-300 group-hover:border-accent group-hover:text-accent group-hover:scale-110 group-hover:bg-accent/5">
                    <Plus size={18} className="transition-transform duration-300 group-hover:rotate-90" />
                  </div>
                  {/* create post tooltip */}
                  <span className="absolute -bottom-10 scale-0 whitespace-nowrap rounded-lg bg-gray-900/90 px-3 py-1.5 text-xs text-white shadow-xl transition-all duration-200 group-hover:scale-100 origin-top">
      Créer un post
    </span>
                </Link>
              {/* Logout Button */}
                <Link
                    to="/login"
                    onClick={handleLogout}
                    className="group relative flex items-center justify-center"
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-full text-white bg-accent transition-all duration-300 group-hover:scale-110">
                    <LogOut size={18} className="transition-transform duration-300 group-hover:-translate-x-1" />
                  </div>

                  {/* Tooltip LogOut */}
                  <span className="absolute -bottom-10 scale-0 whitespace-nowrap rounded-lg bg-gray-900/90 px-3 py-1.5 text-xs text-white shadow-xl transition-all duration-200 group-hover:scale-100 origin-top">
                    Déconnexion
                  </span>
                </Link>
              </nav>
            </div>
        )}
      </div>
    </header>
  );
};

export default Header;
