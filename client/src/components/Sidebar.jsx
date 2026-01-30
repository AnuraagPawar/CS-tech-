import { Link, useLocation } from 'react-router-dom';
import { FaUsers, FaFileUpload, FaChartPie, FaSignOutAlt, FaAtom } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import classNames from 'classnames';

const Sidebar = () => {
    const { pathname } = useLocation();
    const { logout } = useAuth();

    const navItems = [
        { name: 'Dashboard', path: '/', icon: <FaChartPie /> },
        { name: 'Agents', path: '/agents', icon: <FaUsers /> },
        { name: 'Distribution', path: '/upload', icon: <FaFileUpload /> },
    ];

    return (
        <div className="flex flex-col w-72 h-screen glass-panel border-r border-white/5 relative z-20">
            <div className="flex items-center justify-center h-24 border-b border-white/10 bg-gradient-to-r from-transparent via-white/5 to-transparent">
                <div className="flex items-center space-x-3">
                    <FaAtom className="text-3xl text-neon-blue animate-spin-slow" />
                    <h1 className="text-2xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-white uppercase font-sans">
                        Nexus
                    </h1>
                </div>
            </div>

            <nav className="flex-1 px-4 py-8 space-y-4">
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={classNames(
                            'flex items-center px-6 py-4 rounded-xl transition-all duration-300 group',
                            pathname === item.path
                                ? 'bg-gradient-to-r from-neon-blue/20 to-transparent border-l-4 border-neon-blue text-white shadow-[0_0_15px_rgba(0,243,255,0.2)]'
                                : 'text-gray-400 hover:text-white hover:bg-white/5 border-l-4 border-transparent'
                        )}
                    >
                        <span className={classNames("text-xl mr-4 transition-transform group-hover:scale-110", pathname === item.path ? "text-neon-blue" : "")}>
                            {item.icon}
                        </span>
                        <span className="font-medium tracking-wide">{item.name}</span>
                    </Link>
                ))}
            </nav>

            <div className="p-6 border-t border-white/10 bg-gradient-to-t from-black/50 to-transparent">
                <button
                    onClick={logout}
                    className="flex items-center justify-center w-full px-4 py-3 text-red-400 rounded-lg hover:bg-red-500/10 hover:text-red-300 hover:shadow-[0_0_10px_rgba(239,68,68,0.2)] transition-all duration-300 border border-transparent hover:border-red-500/30"
                >
                    <span className="text-xl mr-3"><FaSignOutAlt /></span>
                    <span className="font-medium tracking-wide">Disconnect</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
