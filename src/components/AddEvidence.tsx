import React, { useState } from 'react';
import { useWalletKit } from '@mysten/wallet-kit';
import { TransactionBlock } from '@mysten/sui.js/transactions';

interface AddEvidenceProps {
    packageId: string;
}

export default function AddEvidence({ packageId }: AddEvidenceProps) {
    const { signAndExecuteTransactionBlock } = useWalletKit();
    const [formData, setFormData] = useState({
        caseNo: '',
        firNo: '',
        ipfs: '',
        content: '',
        access: true,
        head: '',
        latitude: '',
        longitude: ''
    });
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setStatus(null);

        try {
            const tx = new TransactionBlock();
            
            // Convert strings to appropriate types
            const caseNo = BigInt(formData.caseNo);
            const firNo = BigInt(formData.firNo);
            const latitude = BigInt(formData.latitude);
            const longitude = BigInt(formData.longitude);
            
            // Create transaction
            tx.moveCall({
                target: `${packageId}::evidence_system::add_evidence`,
                arguments: [
                    tx.pure(caseNo),
                    tx.pure(firNo),
                    tx.pure(formData.ipfs),
                    tx.pure(formData.content),
                    tx.pure(formData.access),
                    tx.pure(formData.head),
                    tx.pure(latitude),
                    tx.pure(longitude)
                ]
            });

            const result = await signAndExecuteTransactionBlock({
                transactionBlock: tx
            });

            setStatus({
                type: 'success',
                message: `Evidence added successfully! Transaction ID: ${result.digest}`
            });
            
            // Reset form
            setFormData({
                caseNo: '',
                firNo: '',
                ipfs: '',
                content: '',
                access: true,
                head: '',
                latitude: '',
                longitude: ''
            });

        } catch (error) {
            setStatus({
                type: 'error',
                message: `Error adding evidence: ${error instanceof Error ? error.message : String(error)}`
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold mb-6">Add New Evidence</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Case Number</label>
                        <input
                            type="number"
                            value={formData.caseNo}
                            onChange={(e) => setFormData(prev => ({ ...prev, caseNo: e.target.value }))}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700">FIR Number</label>
                        <input
                            type="number"
                            value={formData.firNo}
                            onChange={(e) => setFormData(prev => ({ ...prev, firNo: e.target.value }))}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">IPFS Hash</label>
                    <input
                        type="text"
                        value={formData.ipfs}
                        onChange={(e) => setFormData(prev => ({ ...prev, ipfs: e.target.value }))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Content</label>
                    <textarea
                        value={formData.content}
                        onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                        rows={4}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Head Address</label>
                    <input
                        type="text"
                        value={formData.head}
                        onChange={(e) => setFormData(prev => ({ ...prev, head: e.target.value }))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Latitude</label>
                        <input
                            type="number"
                            step="any"
                            value={formData.latitude}
                            onChange={(e) => setFormData(prev => ({ ...prev, latitude: e.target.value }))}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Longitude</label>
                        <input
                            type="number"
                            step="any"
                            value={formData.longitude}
                            onChange={(e) => setFormData(prev => ({ ...prev, longitude: e.target.value }))}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required
                        />
                    </div>
                </div>

                <div className="flex items-center">
                    <input
                        type="checkbox"
                        checked={formData.access}
                        onChange={(e) => setFormData(prev => ({ ...prev, access: e.target.checked }))}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-900">
                        Public Access
                    </label>
                </div>

                {status && (
                    <div className={`p-4 rounded-md ${status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                        {status.message}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {loading ? 'Adding Evidence...' : 'Add Evidence'}
                </button>
            </form>
        </div>
    );
} 