import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(email, password);
            toast.success('Access Granted: Admin Protocol Initiated');
            navigate('/');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Access Denied');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-deep-space">
            
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-neon-blue opacity-10 blur-[150px] rounded-full animate-pulse"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-neon-purple opacity-10 blur-[150px] rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="relative z-10 w-full max-w-md p-10 glass-panel rounded-2xl border-t border-l border-white/10 shadow-2xl">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple tracking-wider neon-text uppercase font-sans">
                        Nexus Admin
                    </h1>
                    <p className="text-gray-400 text-sm mt-2 tracking-widest uppercase">System Entry Portal</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="group">
                        <label className="block text-xs font-bold text-neon-blue uppercase tracking-widest mb-1 group-focus-within:text-white transition-colors">
                            Identity Key (Email)
                        </label>
                        <input
                            type="email"
                            required
                            className="w-full px-4 py-3 bg-black/40 border border-gray-700 rounded-lg text-white focus:border-neon-blue focus:shadow-[0_0_15px_rgba(0,243,255,0.3)] transition-all outline-none"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@nexus.com"
                        />
                    </div>

                    <div className="group">
                        <label className="block text-xs font-bold text-neon-purple uppercase tracking-widest mb-1 group-focus-within:text-white transition-colors">
                            Security Cipher (Password)
                        </label>
                        <input
                            type="password"
                            required
                            className="w-full px-4 py-3 bg-black/40 border border-gray-700 rounded-lg text-white focus:border-neon-purple focus:shadow-[0_0_15px_rgba(188,19,254,0.3)] transition-all outline-none"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 mt-4 font-bold tracking-widest text-black uppercase bg-gradient-to-r from-neon-blue to-neon-purple rounded-lg hover:shadow-[0_0_30px_rgba(0,243,255,0.5)] transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Authenticating...' : 'Initialize Session'}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <div className="text-[10px] text-gray-500 uppercase tracking-[0.2em] animate-pulse">
                        Restricted Access // Secure Connection
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
