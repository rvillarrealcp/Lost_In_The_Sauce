import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../services/authService';

const Dashboard = () => {
    const { user, token, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try{
            await logoutUser(token);
        } catch(err){
            console.error('Logout erro:', err);
        }
        logout();
        navigate('/login');
    };

    return (
        <div className='min-h-screen bg-base-200 p-8'>
            <div className='flex justify-between items-center mb-8'>
                <h1 className='text-3xl font-bold'>Dashboard</h1>
                <button onClick={handleLogout} className='btn btn-outline'>Logout</button>
            </div>
            <div className='card bg-base-100 shadow-xl'>
                <div className='card-body'>
                    <h2 className='card-title'>Welcome, {user?.username}!</h2>
                    <p>You're logged in. Your app is working.</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;