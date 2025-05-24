import React, { useState } from 'react';
import { useWalletKit } from '@mysten/wallet-kit';
import { SuiClient, getFullnodeUrl } from '@mysten/sui.js/client';
import { TransactionBlock } from '@mysten/sui.js/transactions';

const PACKAGE_ID = '0x54419cdac955854ee74e49e1dd23ace8ffd736e1440c3dfed0e99166665123d8';
const SYSTEM_STATE_ID = '0xf44820d3eb6dfe52e563b70861083fadee7f6d9bd3be630ab40297ff953a9a35';
const ADD_EVIDENCE_FN = `${PACKAGE_ID}::EvidenceSystem::add_evidence`;

const client = new SuiClient({ url: getFullnodeUrl('testnet') });

interface AddEvidenceForm {
    caseNo: string;
    firNo: string;
    ipfsHash: string;
    content: string;
    access: boolean;
    head: string;
    latitude: string;
    longitude: string;
}

export default function AddEvidence() {
    const { signTransactionBlock } = useWalletKit();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    
    const [formData, setFormData] = useState<AddEvidenceForm>({
        caseNo: '',
        firNo: '',
        ipfsHash: '',
        content: '',
        access: true,
        head: '',
        latitude: '',
        longitude: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const validateForm = (): boolean => {
        if (!formData.caseNo || isNaN(Number(formData.caseNo))) {
            setError('Valid Case Number is required');
            return false;
        }
        if (!formData.firNo || isNaN(Number(formData.firNo))) {
            setError('Valid FIR Number is required');
            return false;
        }
        if (!formData.ipfsHash) {
            setError('IPFS Hash is required');
            return false;
        }
        if (!formData.content) {
            setError('Content is required');
            return false;
        }
        if (!formData.head || !formData.head.startsWith('0x')) {
            setError('Valid Head Address is required (must start with 0x)');
            return false;
        }
        if (!formData.latitude || isNaN(Number(formData.latitude))) {
            setError('Valid Latitude is required');
            return false;
        }
        if (!formData.longitude || isNaN(Number(formData.longitude))) {
            setError('Valid Longitude is required');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        if (!validateForm()) {
            return;
        }

        try {
            setLoading(true);

            const tx = new TransactionBlock();
            
            // Convert string inputs to appropriate types
            const ipfsBytes = new TextEncoder().encode(formData.ipfsHash);
            const contentBytes = new TextEncoder().encode(formData.content);

            // Call the add_evidence function
            tx.moveCall({
                target: ADD_EVIDENCE_FN,
                arguments: [
                    tx.object(SYSTEM_STATE_ID),
                    tx.pure(Number(formData.caseNo)),
                    tx.pure(Number(formData.firNo)),
                    tx.pure(Array.from(ipfsBytes)),
                    tx.pure(Array.from(contentBytes)),
                    tx.pure(formData.access),
                    tx.pure(formData.head),
                    tx.pure(Number(formData.latitude)),
                    tx.pure(Number(formData.longitude))
                ]
            });

            tx.setGasBudget(100_000_000);

            // Sign and execute the transaction
            const { signature, transactionBlockBytes } = await signTransactionBlock({
                transactionBlock: tx,
            });

            const response = await client.executeTransactionBlock({
                transactionBlock: transactionBlockBytes,
                signature,
                options: {
                    showEffects: true,
                    showEvents: true
                }
            });

            console.log('Transaction response:', response);
            setSuccess(true);
            
            // Reset form after successful submission
            setFormData({
                caseNo: '',
                firNo: '',
                ipfsHash: '',
                content: '',
                access: true,
                head: '',
                latitude: '',
                longitude: ''
            });

        } catch (err) {
            console.error('Error adding evidence:', err);
            setError(`Error adding evidence: ${err instanceof Error ? err.message : String(err)}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">Add New Evidence</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Case Number</label>
                    <input
                        type="number"
                        name="caseNo"
                        value={formData.caseNo}
                        onChange={handleInputChange}
                        placeholder="Enter Case Number"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">FIR Number</label>
                    <input
                        type="number"
                        name="firNo"
                        value={formData.firNo}
                        onChange={handleInputChange}
                        placeholder="Enter FIR Number"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">IPFS Hash</label>
                    <input
                        type="text"
                        name="ipfsHash"
                        value={formData.ipfsHash}
                        onChange={handleInputChange}
                        placeholder="Enter IPFS Hash"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Content</label>
                    <input
                        type="text"
                        name="content"
                        value={formData.content}
                        onChange={handleInputChange}
                        placeholder="Enter Content"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Head Address</label>
                    <input
                        type="text"
                        name="head"
                        value={formData.head}
                        onChange={handleInputChange}
                        placeholder="Enter Head Address (0x...)"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Latitude</label>
                    <input
                        type="number"
                        name="latitude"
                        value={formData.latitude}
                        onChange={handleInputChange}
                        placeholder="Enter Latitude"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Longitude</label>
                    <input
                        type="number"
                        name="longitude"
                        value={formData.longitude}
                        onChange={handleInputChange}
                        placeholder="Enter Longitude"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>

                <div className="flex items-center">
                    <input
                        type="checkbox"
                        name="access"
                        checked={formData.access}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-900">
                        Access Enabled
                    </label>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {loading ? 'Adding Evidence...' : 'Add Evidence'}
                </button>
            </form>

            {error && (
                <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
                    {error}
                </div>
            )}

            {success && (
                <div className="mt-4 p-3 bg-green-100 text-green-700 rounded">
                    Evidence added successfully!
                </div>
            )}
        </div>
    );
} 