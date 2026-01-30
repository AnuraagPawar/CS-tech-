import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';
import { FaArrowLeft, FaMobileAlt, FaEnvelope } from 'react-icons/fa';

const AgentTasks = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [agent, setAgent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [agentRes, tasksRes] = await Promise.all([
                    api.get(`/agents/${id}`),
                    api.get(`/agents/${id}/records`)
                ]);

                setAgent(agentRes.data);
                setTasks(tasksRes.data);
            } catch (error) {
                toast.error('Failed to load agent data');
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchData();
    }, [id, navigate]);

    if (loading) return <div className="text-neon-blue font-mono animate-pulse p-10">Accessing Agent Logs...</div>;

    if (!agent) return <div className="text-red-500 p-10">Agent Not Found</div>;

    return (
        <div className="space-y-6">
            <button
                onClick={() => navigate('/agents')}
                className="flex items-center text-neon-blue hover:text-white transition-colors uppercase text-xs font-bold tracking-widest mb-4"
            >
                <FaArrowLeft className="mr-2" /> Back to Agents
            </button>

            <div className="glass-panel p-8 rounded-2xl border border-neon-blue/20">
                <div className="flex flex-col md:flex-row justify-between md:items-center mb-8 pb-6 border-b border-white/10">
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2">
                            <span className="text-neon-blue mr-2">//</span>
                            {agent.name}
                        </h1>
                        <div className="flex space-x-6 text-gray-400 mt-2">
                            <span className="flex items-center"><FaEnvelope className="mr-2 text-neon-purple" /> {agent.email}</span>
                            <span className="flex items-center"><FaMobileAlt className="mr-2 text-neon-purple" /> {agent.mobile}</span>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto rounded-lg border border-white/5">
                    <table className="min-w-full leading-normal">
                        <thead>
                            <tr className="bg-white/5 text-left">
                                <th className="px-5 py-4 text-xs font-bold text-neon-blue uppercase tracking-wider">Target Name</th>
                                <th className="px-5 py-4 text-xs font-bold text-neon-blue uppercase tracking-wider">Comms</th>
                                <th className="px-5 py-4 text-xs font-bold text-neon-blue uppercase tracking-wider">Intel</th>
                                <th className="px-5 py-4 text-xs font-bold text-neon-blue uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 bg-black/40">
                            {tasks.map((record) => (
                                <tr key={record._id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-5 py-4 text-sm text-white font-bold">{record.firstName}</td>
                                    <td className="px-5 py-4 text-sm text-gray-300 font-mono">{record.phone}</td>
                                    <td className="px-5 py-4 text-sm text-gray-400 italic max-w-md truncate">{record.notes}</td>
                                    <td className="px-5 py-4 text-sm">
                                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-500/10 text-green-400 border border-green-500/20">
                                            ACTIVE
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {tasks.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="px-5 py-12 text-center text-gray-500">
                                        No active directives assigned to this operative.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AgentTasks;
