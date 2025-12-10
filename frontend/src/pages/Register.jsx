import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser, loginUser, getCurrentUser } from '../services/authService';
import { useAuth } from "../context/AuthContext";

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try{
            await registerUser(username, email, password1, password2);
            const loginData = await loginUser(username, password1);
            const userData = await getCurrentUser(loginData.key);
            login(loginData.key, userData);
            navigate('/dashboard');
        } catch (err){
            setError(err.response?.data?.username?.[0] ||
                err.response?.data?.password1?.[0] ||
                'Registration failed');
        }
    };

    return(
        <div className="min-h-screen flex items-center justify-center bg-base-200">
            <div className="card w-96 bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title justify-center text-2xl mb-4">Register</h2>
                    {error && <div className='alert alert-error text-sm'>{error}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className="form-control">
                            <label className='label'>
                                <span className="label-text">Username</span>
                            </label>
                            <input
                                type="text"
                                className="input input-bordered"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className='form-control'>
                            <label className='label'>
                                <span className="label-text">Email</span>
                            </label>
                            <input
                                type="email"
                                className="input input-bordered"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className='form-control'>
                            <label className="label">
                                <span className="label-text">Password</span>
                            </label>
                            <input
                                type="password"
                                className="input input-bordered"
                                value={password1}
                                onChange={(e) => setPassword1(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Confirm Password</span>
                            </label>
                            <input
                                type="password"
                                className="input input-bordered"
                                value={password2}
                                onChange={(e) => setPassword2(e.target.value)}
                                required
                            />
                        </div>
                        <div className='form-control mt-6'>
                            <button type="submit" className='btn btn-primary'>Register</button>
                        </div>
                    </form>
                    <p className="text-center mt-4">
                        Already have an account? <Link to="/login" className='link link-primary'>Login</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;