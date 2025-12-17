import { useState} from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser, getCurrentUser } from '../services/authService';
import { useAuth } from '../context/AuthContext'
import ErrorAlert from '../components/ErrorAlert';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate()
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try{
          const loginData = await loginUser(username, password);
          console.log("Login response:", loginData); //debug statement
          const userData = await getCurrentUser(loginData.key);
          console.log("User data:", userData); //debug statement
          login(loginData.key, userData);
          navigate("/dashboard");
        } catch(err){
            console.error("Full error:", err); //debug statement
            setError("Invalid username or password");
        }
    };

    return (
      <div className="min-n-screen flex items-center justify-center bg-base-200">
        <div className="card w-96 bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title justify-center text-2xl mb-4">Login</h2>
            <ErrorAlert message={error} />
            <form onSubmit={handleSubmit}>
                <div className='form-control'>
                    <label className='label'>
                        <span className='label-text'>Username</span>
                    </label>
                    <input
                        type = 'text'
                        className='input input-bordered'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className='form-control'>
                    <label className='label'>
                        <span className='label-text'>Password</span>
                    </label>
                    <input 
                        type='password'
                        className='input input-bordered'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className='form-control mt-6'>
                    <button type='submit' className='btn btn-primary'>Login</button>
                </div>
            </form>
            <p className='text-center mt-4'>
                Don't have an account? <Link to='/register' className='link link-primary'>Register</Link>
            </p>
          </div>
        </div>
      </div>
    );
};

export default Login;