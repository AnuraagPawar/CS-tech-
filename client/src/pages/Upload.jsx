import { useState } from 'react';
import { FaCloudUploadAlt, FaCheckCircle, FaExclamationTriangle, FaCog } from 'react-icons/fa';
import api from '../services/api';
import { toast } from 'react-toastify';

const Upload = () => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [result, setResult] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setResult(null);
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) {
            toast.error('No Data Source Selected');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        setUploading(true);
        try {
            const { data } = await api.post('/upload', formData);
            setResult({ type: 'success', message: data.message, details: data });
            toast.success('Data Distribution Matrix Executed Successfully');
            setFile(null);
        } catch (error) {
            console.log(error);
            const msg = error.response?.data?.message || 'Uplink Failed';
            setResult({ type: 'error', message: msg });
            toast.error(msg);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-white tracking-wide mb-2">Data Ingestion Protocol</h1>
                <p className="text-gray-400">Initialize secure file transfer and run automatic distribution algorithms.</p>
            </div>

            <div className="glass-panel p-1 rounded-2xl relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-neon-blue via-neon-purple to-neon-blue opacity-50 blur-lg group-hover:opacity-80 transition-opacity duration-500 rounded-2xl animate-gradient-x"></div>

                <div className="bg-deep-space relative rounded-xl p-10 text-center">
                    <div className="border-2 border-dashed border-gray-600 rounded-xl p-12 hover:border-neon-blue transition-colors duration-300 relative overflow-hidden group/zone">

                        <div className="relative z-10">
                            <div className="w-20 h-20 bg-gray-800 rounded-full mx-auto flex items-center justify-center mb-6 group-hover/zone:scale-110 transition-transform duration-300 shadow-lg group-hover/zone:shadow-[0_0_20px_rgba(0,243,255,0.4)]">
                                <FaCloudUploadAlt className="text-4xl text-neon-blue" />
                            </div>

                            <p className="text-gray-300 mb-6 font-medium">
                                Drag system files here or initiate manual selection.
                                <br />
                                <span className="text-xs text-gray-500 uppercase tracking-widest mt-2 block">Supported Formats: CSV, XLSX</span>
                            </p>

                            <input
                                type="file"
                                onChange={handleFileChange}
                                accept=".csv, .xlsx, .xls"
                                className="hidden"
                                id="file-upload"
                            />
                            <label
                                htmlFor="file-upload"
                                className="inline-block px-8 py-3 rounded-lg border border-neon-blue text-neon-blue hover:bg-neon-blue hover:text-black font-bold uppercase tracking-widest text-xs cursor-pointer transition-all duration-300 shadow-[0_0_10px_rgba(0,243,255,0.1)] hover:shadow-[0_0_20px_rgba(0,243,255,0.5)]"
                            >
                                Select Data Source
                            </label>
                            {file && (
                                <div className="mt-6 p-3 bg-neon-blue/10 rounded-lg border border-neon-blue/30 inline-flex items-center space-x-2 animate-pulse">
                                    <FaCog className="text-neon-blue animate-spin" />
                                    <span className="text-neon-blue font-mono text-sm">{file.name}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end">
                        <button
                            onClick={handleUpload}
                            disabled={!file || uploading}
                            className={`w-full py-4 font-bold tracking-widest text-black uppercase bg-gradient-to-r from-neon-blue to-neon-purple rounded-lg hover:shadow-[0_0_30px_rgba(0,243,255,0.5)] transform hover:scale-[1.01] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3`}
                        >
                            {uploading ? (
                                <>
                                    <FaCog className="animate-spin text-xl" />
                                    <span>Processing Distribution Algorithm...</span>
                                </>
                            ) : (
                                <span>Execute Protocol</span>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-panel p-6 rounded-xl border border-white/5">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center">
                        <FaExclamationTriangle className="mr-2 text-yellow-500" />
                        System Prerequisites
                    </h3>
                    <ul className="space-y-3 text-sm text-gray-400">
                        <li className="flex items-center"><span className="w-1.5 h-1.5 bg-neon-purple rounded-full mr-3"></span>At least 1 Active Agent Required (Distributed Automatically)</li>
                        <li className="flex items-center"><span className="w-1.5 h-1.5 bg-neon-purple rounded-full mr-3"></span>File Headers: Name, Number (or FirstName, Phone)</li>
                        <li className="flex items-center"><span className="w-1.5 h-1.5 bg-neon-purple rounded-full mr-3"></span>Algorithmic Equal Splitting</li>
                    </ul>
                </div>

                
                {result && (
                    <div className={`glass-panel p-6 rounded-xl border ${result.type === 'success' ? 'border-green-500/50 bg-green-500/5' : 'border-red-500/50 bg-red-500/5'}`}>
                        <div className="flex items-start">
                            <span className={`text-2xl mr-4 ${result.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                                {result.type === 'success' ? <FaCheckCircle /> : <FaExclamationTriangle />}
                            </span>
                            <div>
                                <h4 className={`font-bold ${result.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                                    {result.type === 'success' ? 'Protocol Successful' : 'Protocol Failed'}
                                </h4>
                                <p className="text-gray-300 text-sm mt-1">{result.message}</p>
                                {result.details && (
                                    <div className="mt-3 p-3 bg-black/40 rounded border border-white/5">
                                        <p className="text-xs font-mono text-neon-blue">
                                            &gt; Records Processed: {result.details.totalRecords}<br />
                                            &gt; Status: {result.details.distribution}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Upload;
