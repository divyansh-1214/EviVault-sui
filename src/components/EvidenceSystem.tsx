import React, { useState } from 'react';
import AddEvidence from './AddEvidence';
import AddReport from './AddReport';
import ViewEvidence from '../../../src/components/ViewEvidence';
import ViewReport from '../../../src/components/ViewReport';
import AdminPanel from './AdminPanel';
import { useWalletKit } from '@mysten/wallet-kit';

const PACKAGE_ID = '0xc8b758084b22b12dd4a8d08447e8b3d628a365aae4fab38a6e8839f7c9adacf5'; // Replace with your package ID

export default function EvidenceSystem() {
    const [activeTab, setActiveTab] = useState('addEvidence');
    const { currentAccount } = useWalletKit();

    const tabs = [
        { id: 'addEvidence', label: 'Add Evidence' },
        { id: 'addReport', label: 'Add Report' },
        { id: 'viewEvidence', label: 'View Evidence' },
        { id: 'viewReport', label: 'View Report' },
        { id: 'admin', label: 'Admin Panel' },
    ];

    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            {!currentAccount ? (
                <div className="text-center py-8">
                    <p className="text-xl text-gray-600">Please connect your wallet to use the system</p>
                </div>
            ) : (
                <>
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`
                                        py-4 px-1 border-b-2 font-medium text-sm
                                        ${activeTab === tab.id
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }
                                    `}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </div>

                    <div className="mt-6">
                        {activeTab === 'addEvidence' && <AddEvidence packageId={PACKAGE_ID} />}
                        {activeTab === 'addReport' && <AddReport packageId={PACKAGE_ID} />}
                        {activeTab === 'viewEvidence' && <ViewEvidence packageId={PACKAGE_ID} />}
                        {activeTab === 'viewReport' && <ViewReport packageId={PACKAGE_ID} />}
                        {activeTab === 'admin' && <AdminPanel packageId={PACKAGE_ID} />}
                    </div>
                </>
            )}
        </div>
    );
} 