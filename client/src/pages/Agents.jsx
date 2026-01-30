import { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaList, FaEye, FaEyeSlash } from 'react-icons/fa';
import api from '../services/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Agents = () => {
    const [agents, setAgents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        id: '',
        name: '',
        email: '',
        mobile: '',
        password: ''
    });

    const fetchAgents = async () => {
        try {
            const { data } = await api.get('/agents');
            setAgents(data);
        } catch (error) {
            toast.error('Failed to fetch agents');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAgents();
    }, []);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const openModal = (agent = null) => {
        if (agent) {
            setIsEdit(true);
            setFormData({
                id: agent._id,
                name: agent.name,
                email: agent.email,
                mobile: agent.mobile,
                password: ''
            });
        } else {
            setIsEdit(false);
            setFormData({ id: '', name: '', email: '', mobile: '', password: '' });
        }
        setShowPassword(false);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setFormData({ id: '', name: '', email: '', mobile: '', password: '' });
        setShowPassword(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!/^\d{10}$/.test(formData.mobile)) {
                toast.error('Mobile number must be exactly 10 digits');
                return;
            }

            if (isEdit) {
                const updateData = {
                    name: formData.name,
                    email: formData.email,
                    mobile: formData.mobile
                };
                if (formData.password) updateData.password = formData.password;

                await api.put(`/agents/${formData.id}`, updateData);
                toast.success('Agent Identity Updated');
            } else {
                await api.post('/agents', formData);
                toast.success('New Agent Initialized');
            }
            closeModal();
            fetchAgents();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Operation failed');
        }
    };

    const handleViewLeads = (agent) => {
        navigate(`/agents/${agent._id}/tasks`);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Terminate Agent Protocol? This action cannot be undone.')) {
            try {
                await api.delete(`/agents/${id}`);
                toast.success('Agent Terminated');
                fetchAgents();
            } catch (error) {
                toast.error('Termination Failed');
            }
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-wide">Field Agents</h1>
                    <p className="text-gray-400 text-sm">Manage operative profiles and assignments.</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="btn-neon px-6 py-3 rounded-lg flex items-center font-bold tracking-wider"
                >
                    <FaPlus className="mr-2" /> Initialize Agent
                </button>
            </div>

            {loading ? (
                <div className="text-neon-blue font-mono animate-pulse">Scanning Agent Database...</div>
            ) : (
                <div className="glass-panel rounded-2xl overflow-hidden">
                    <table className="min-w-full leading-normal">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/10 text-left">
                                <th className="px-5 py-4 text-xs font-bold text-neon-blue uppercase tracking-wider">
                                    Identity
                                </th>
                                <th className="px-5 py-4 text-xs font-bold text-neon-blue uppercase tracking-wider">
                                    Contact Uplink
                                </th>
                                <th className="px-5 py-4 text-xs font-bold text-neon-blue uppercase tracking-wider">
                                    Secure Mobile
                                </th>
                                <th className="px-5 py-4 text-xs font-bold text-neon-blue uppercase tracking-wider text-right">
                                    Protocols
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {agents.map((agent) => (
                                <tr key={agent._id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-5 py-4 text-sm font-medium text-white">
                                        {agent.name}
                                    </td>
                                    <td className="px-5 py-4 text-sm text-gray-300 font-mono">
                                        {agent.email}
                                    </td>
                                    <td className="px-5 py-4 text-sm text-gray-300 font-mono">
                                        {agent.mobile}
                                    </td>
                                    <td className="px-5 py-4 text-sm text-right">
                                        <button
                                            onClick={() => handleViewLeads(agent)}
                                            className="text-green-400 hover:text-green-300 mx-2 transition-colors p-2 hover:bg-green-400/10 rounded-full"
                                            title="View Assignments"
                                        >
                                            <FaList />
                                        </button>
                                        <button
                                            onClick={() => openModal(agent)}
                                            className="text-neon-blue hover:text-white mx-2 transition-colors p-2 hover:bg-neon-blue/10 rounded-full"
                                            title="Edit Profile"
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(agent._id)}
                                            className="text-red-500 hover:text-red-400 mx-2 transition-colors p-2 hover:bg-red-500/10 rounded-full"
                                            title="Terminate"
                                        >
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {agents.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="px-5 py-10 text-center text-gray-500">
                                        No active field agents detected. Initialize new operatives.
                                        <br />
                                        <span className="text-neon-purple text-xs uppercase tracking-widest mt-2 block">
                                            Warning: 5 Agents Required for Distribution Protocol
                                        </span>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                    <div className="glass-panel bg-black/90 rounded-2xl p-8 w-full max-w-md border border-neon-purple/20 shadow-[0_0_50px_rgba(188,19,254,0.1)]">
                        <h2 className="text-2xl font-bold mb-6 text-white tracking-wide">
                            {isEdit ? 'Update Profile' : 'Initialize Profile'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-gray-400 text-xs font-bold mb-2 uppercase tracking-widest">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-lg text-white focus:border-neon-purple outline-none focus:shadow-[0_0_10px_rgba(188,19,254,0.2)] transition-all"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-400 text-xs font-bold mb-2 uppercase tracking-widest">Email Uplink</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-lg text-white focus:border-neon-purple outline-none focus:shadow-[0_0_10px_rgba(188,19,254,0.2)] transition-all"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-400 text-xs font-bold mb-2 uppercase tracking-widest">Mobile Frequency</label>
                                <input
                                    type="text"
                                    name="mobile"
                                    value={formData.mobile}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-lg text-white focus:border-neon-purple outline-none focus:shadow-[0_0_10px_rgba(188,19,254,0.2)] transition-all"
                                    required
                                    maxLength="10"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-400 text-xs font-bold mb-2 uppercase tracking-widest">
                                    Access Cipher {isEdit && '(Leave blank to keep)'}
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-lg text-white focus:border-neon-purple outline-none focus:shadow-[0_0_10px_rgba(188,19,254,0.2)] transition-all pr-12"
                                        required={!isEdit}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-3 text-gray-400 hover:text-white"
                                    >
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                            </div>
                            <div className="flex justify-end space-x-4 mt-8">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-6 py-3 border border-gray-600 text-gray-400 rounded-lg hover:border-white hover:text-white transition-colors uppercase text-xs font-bold tracking-widest"
                                >
                                    Abort
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-3 bg-gradient-to-r from-neon-purple to-pink-600 text-white rounded-lg font-bold uppercase tracking-widest text-xs hover:shadow-[0_0_20px_rgba(188,19,254,0.4)] transition-all"
                                >
                                    {isEdit ? 'Update' : 'Initialize'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Agents;
