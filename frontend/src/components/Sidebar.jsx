import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../services/authService';
import { BookOpen, LayoutDashboard, Package, Wand2, LogOut } from 'lucide-react';

const Sidebar = () => {
    const { token, logout} = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try{
            await logoutUser(token);
        } catch(err){
            console.error('Logout error', err);
        }
        logout();
        navigate('/login');
    };

    const navItems = [
        {path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard},
        {path: '/recipes', label: 'My Recipes', icon: BookOpen},
        {path: '/pantry', label: 'My Pantry', icon: Package},
        {path: '/wizard', label: 'Zero-Waste Wizard', icon: Wand2},
    ];

    return (
      <div className="w-64 min-h-screen bg-base-300 p-4 flex flex-col">
        <div className="mb-8">
          <img
            src="/lits-logo.png"
            alt="Lost in the Sauce"
            className="w-full"
          />
        </div>
        <nav className="flex-1">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`btn btn-ghost w-full justify-start gap-2 ${
                      location.pathname === item.path ? "btn-active" : ""
                    }`}
                  >
                    <IconComponent size={20} />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <button
          onClick={handleLogout}
          className="btn btn-outline btn-error w-full mt-4"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    );
};

export default Sidebar;