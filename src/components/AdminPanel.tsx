import React, { useState } from 'react';
import { useWalletKit } from '@mysten/wallet-kit';
import { TransactionBlock } from '@mysten/sui.js/transactions';

interface AdminPanelProps {
    packageId: string;
}

export default function AdminPanel({ packageId }: AdminPanelProps) {
    const { signAndExecuteTransactionBlock } = useWalletKit();
    const [newPeon, setNewPeon] = useState('');
    const [newSHO, setNewSHO] = useState('');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    const handleChangePeon = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setStatus(null);

        try {
            const tx = new TransactionBlock();
            
            tx.moveCall({
                target: `${packageId}::evidence_system::change_peon`,
                arguments: [tx.pure(newPeon)]
            });

            const result = await signAndExecuteTransactionBlock({
                transactionBlock: tx
            });

            setStatus({
                type: 'success',
                message: `Peon address changed successfully! Transaction ID: ${result.digest}`
            });
            setNewPeon('');

        } catch (error) {
            setStatus({
                type: 'error',
                message: `Error changing Peon address: ${error instanceof Error ? error.message : String(error)}`
            });
        } finally {
            setLoading(false);
        }
    };

    const handleChangeSHO = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setStatus(null);

        try {
            const tx = new TransactionBlock();
            
            tx.moveCall({
                target: `${packageId}::evidence_system::change_sho`,
                arguments: [tx.pure(newSHO)]
            });

            const result = await signAndExecuteTransactionBlock({
                transactionBlock: tx
            });

            setStatus({
                type: 'success',
                message: `SHO address changed successfully! Transaction ID: ${result.digest}`
            });
            setNewSHO('');

        } catch (error) {
            setStatus({
                type: 'error',
                message: `Error changing SHO address: ${error instanceof Error ? error.message : String(error)}`
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold mb-6">Admin Panel</h2>

            <div className="space-y-8">
                {/* Change Peon Form */}
                <div className="bg-white shadow rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Change Peon Address</h3>
                    <form onSubmit={handleChangePeon} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                New Peon Address
                            </label>
                            <input
                                type="text"
                                value={newPeon}
                                onChange={(e) => setNewPeon(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                placeholder="Enter new Peon address"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading || !newPeon}
                            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {loading ? 'Changing...' : 'Change Peon Address'}
                        </button>
                    </form>
                </div>

                {/* Change SHO Form */}
                <div className="bg-white shadow rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Change SHO Address</h3>
                    <form onSubmit={handleChangeSHO} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                New SHO Address
                            </label>
                            <input
                                type="text"
                                value={newSHO}
                                onChange={(e) => setNewSHO(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                placeholder="Enter new SHO address"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading || !newSHO}
                            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {loading ? 'Changing...' : 'Change SHO Address'}
                        </button>
                    </form>
                </div>

                {status && (
                    <div className={`p-4 rounded-md ${status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                        {status.message}
                    </div>
                )}
            </div>
        </div>
    );
} 