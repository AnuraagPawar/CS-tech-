import { useEffect, useState } from 'react';
import { FaUsers, FaDatabase, FaServer, FaMicrochip } from 'react-icons/fa';
import api from '../services/api';
import { toast } from 'react-toastify';

const Dashboard = () => {
    const [stats, setStats] = useState({ totalAgents: 0, totalRecords: 0 });
    const [loading, setLoading] = useState(true);
    const [systemLoad, setSystemLoad] = useState(12);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await api.get('/agents/stats');
                setStats(data);
            } catch (error) {
                toast.error('Data Uplink Failed');
            } finally {
                setLoading(false);
            }
        };

        fetchStats();

        const interval = setInterval(() => {
            setSystemLoad(prev => {
                const change = Math.floor(Math.random() * 10) - 5; // -5 to +5
                let newLoad = prev + change;
                if (newLoad < 10) newLoad = 10;
                if (newLoad > 45) newLoad = 45;
                return newLoad;
            });
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    if (loading) return <div className="text-neon-blue font-mono animate-pulse">Initializing Dashboard Data Stream...</div>;

    return (
        <div className="space-y-10">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2 tracking-wide">Mission Control</h1>
                <p className="text-gray-400">Overview of system resources and distribution metrics.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                
                <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group hover:bg-white/5 transition-all">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <FaUsers className="text-6xl text-neon-blue" />
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center space-x-2 text-neon-blue mb-2">
                            <FaUsers />
                            <span className="text-xs font-bold uppercase tracking-widest">Active Agents</span>
                        </div>
                        <h3 className="text-4xl font-bold text-white font-mono">{stats.totalAgents}</h3>
                        <div className="w-full h-1 bg-gray-800 mt-4 rounded-full overflow-hidden">
                            <div className="h-full bg-neon-blue w-[70%] shadow-[0_0_10px_#00f3ff]"></div>
                        </div>
                    </div>
                </div>

                <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group hover:bg-white/5 transition-all">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <FaDatabase className="text-6xl text-neon-purple" />
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center space-x-2 text-neon-purple mb-2">
                            <FaDatabase />
                            <span className="text-xs font-bold uppercase tracking-widest">Records Distributed</span>
                        </div>
                        <h3 className="text-4xl font-bold text-white font-mono">{stats.totalRecords}</h3>
                        <div className="w-full h-1 bg-gray-800 mt-4 rounded-full overflow-hidden">
                            <div className="h-full bg-neon-purple w-[85%] shadow-[0_0_10px_#bc13fe]"></div>
                        </div>
                    </div>
                </div>

                <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group hover:bg-white/5 transition-all">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <FaServer className="text-6xl text-green-400" />
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center space-x-2 text-green-400 mb-2">
                            <FaServer />
                            <span className="text-xs font-bold uppercase tracking-widest">System Load</span>
                        </div>
                        <h3 className="text-4xl font-bold text-white font-mono">{systemLoad}%</h3>
                        <div className="w-full h-1 bg-gray-800 mt-4 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-green-400 shadow-[0_0_10px_#4ade80] transition-all duration-1000 ease-in-out"
                                style={{ width: `${systemLoad}%` }}
                            ></div>
                        </div>
                    </div>
                </div>

                <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group hover:bg-white/5 transition-all">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <FaMicrochip className="text-6xl text-yellow-400" />
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center space-x-2 text-yellow-400 mb-2">
                            <FaMicrochip />
                            <span className="text-xs font-bold uppercase tracking-widest">Processing</span>
                        </div>
                        <h3 className="text-4xl font-bold text-white font-mono">Optimal</h3>
                        <div className="w-full h-1 bg-gray-800 mt-4 rounded-full overflow-hidden">
                            <div className="h-full bg-yellow-400 w-[95%] shadow-[0_0_10px_#facc15]"></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="glass-panel p-8 rounded-2xl border border-white/5 bg-gradient-to-br from-white/5 to-transparent">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                    <span className="w-2 h-8 bg-neon-blue mr-4 rounded-full shadow-[0_0_10px_#00f3ff]"></span>
                    System Directives
                </h2>
                <p className="text-gray-300 leading-relaxed max-w-2xl">
                    Welcome to the Nexus Distribution Hub. Ensure all agents are operational before initializing data protocols.
                    The system requires strict adherence to the 5-Agent-Matrix for equilibrium in data distribution.
                </p>
            </div>
        </div>
    );
};

export default Dashboard;
