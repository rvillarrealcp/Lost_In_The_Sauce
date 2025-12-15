import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../services/authService';

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
        {path: '/dashboard', label: 'Dashboard', icon: '🏠'},
        {path: '/recipes', label: 'My Recipes', icon: '📖'},
        {path: '/pantry', label: 'My Pantry', icon: '🥫'},
        {path: '/wizard', label: 'Zero-Waste Wizard', icon: '🧙🏼‍♂️'},
    ];

    return (
      <div className="w-64 min-h-screen bg-base-300 p-4 flex flex-col">
        <div className="text-2xl font-bold mb-8 text-center">
          🍝Lost In The Sauce🍝
        </div>
        <nav className='flex-1'>
            <ul className='space-y-2'>
                {navItems.map(item => (
                    <li key={item.path}>
                        <Link
                        to={item.path}
                        className={`btn btn-ghost w-full justify-start gap-2 ${
                            location.pathname === item.path ? 'btn-active' : ''
                        }`}
                        >
                            <span>{item.icon}</span>
                            {item.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
        <button onClick={handleLogout} className='btn btn-outline btn-error w-full mt-4'>
            Logout
        </button>
      </div>
    );
};

export default Sidebar;