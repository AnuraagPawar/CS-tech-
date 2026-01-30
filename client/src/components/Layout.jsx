import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = () => {
    return (
        <div className="flex bg-deep-space min-h-screen text-gray-200 font-sans selection:bg-neon-blue selection:text-black">
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[20%] right-[30%] w-[600px] h-[600px] bg-neon-purple opacity-[0.03] blur-[150px] rounded-full"></div>
                <div className="absolute bottom-[10%] left-[10%] w-[500px] h-[500px] bg-neon-blue opacity-[0.03] blur-[150px] rounded-full"></div>
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]"></div>
            </div>

            <Sidebar />

            <div className="flex-1 flex flex-col overflow-hidden relative z-10 backdrop-blur-sm">
                <header className="h-20 border-b border-white/5 flex items-center justify-between px-10 bg-black/20 backdrop-filter backdrop-blur-md">
                    <div>
                        <h2 className="text-2xl font-bold text-white tracking-widest uppercase">
                            System<span className="text-neon-blue">Dashboard</span>
                        </h2>
                        <p className="text-xs text-gray-500 tracking-[0.2em] uppercase mt-1">Status: Online // Secure</p>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="px-4 py-1 rounded-full border border-neon-blue/30 bg-neon-blue/10 text-neon-blue text-xs font-bold tracking-widest uppercase animate-pulse">
                            Live
                        </div>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 border border-white/20 flex items-center justify-center shadow-lg">
                            <span className="font-bold text-white text-xs">AD</span>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-x-hidden overflow-y-auto p-10 scrollbar-thin scrollbar-thumb-neon-blue/20 scrollbar-track-transparent">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;
