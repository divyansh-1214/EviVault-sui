import React, { useState } from 'react';
import { useWalletKit } from '@mysten/wallet-kit';
import { SuiClient, getFullnodeUrl } from '@mysten/sui.js/client';

interface ViewReportProps {
    packageId: string;
}

interface Report {
    reportId: string;
    caseNo: string;
    firNo: string;
    ipfs: string;
    content: string;
    head: string;
    date: string;
    access: boolean;
    latitude: string;
    longitude: string;
}

const client = new SuiClient({ url: getFullnodeUrl('testnet') });

export default function ViewReport({ packageId }: ViewReportProps) {
    const [reportId, setReportId] = useState('');
    const [report, setReport] = useState<Report | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { currentAccount } = useWalletKit();

    const fetchReport = async () => {
        if (!reportId) return;
        
        setLoading(true);
        setError(null);
        setReport(null);

        try {
            // First get the system state object
            const stateResponse = await client.getObject({
                id: packageId,
                options: {
                    showContent: true
                }
            });

            if (!stateResponse.data) {
                throw new Error('Failed to fetch system state');
            }

            // Call the get_report function
            const moveCallTxb = {
                packageObjectId: packageId,
                module: 'evidence_system',
                function: 'get_report',
                typeArguments: [],
                arguments: [reportId]
            };

            const result = await client.devInspectTransactionBlock({
                transactionBlock: moveCallTxb,
                sender: currentAccount?.address || ''
            });

            if (result.error) {
                throw new Error(result.error);
            }

            // Parse the returned data
            const returnValues = result.results?.[0]?.returnValues;
            if (!returnValues || returnValues.length < 10) {
                throw new Error('Invalid response format');
            }

            // Format the report data
            const reportData: Report = {
                reportId: returnValues[0],
                caseNo: returnValues[1],
                firNo: returnValues[2],
                ipfs: returnValues[3],
                content: returnValues[4],
                head: returnValues[5],
                date: new Date(Number(returnValues[6]) * 1000).toLocaleString(),
                access: returnValues[7],
                latitude: returnValues[8],
                longitude: returnValues[9]
            };

            setReport(reportData);

        } catch (err) {
            setError(`Error fetching report: ${err instanceof Error ? err.message : String(err)}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold mb-6">View Report</h2>
            
            <div className="mb-6">
                <div className="flex gap-4">
                    <input
                        type="number"
                        value={reportId}
                        onChange={(e) => setReportId(e.target.value)}
                        placeholder="Enter Report ID"
                        className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    <button
                        onClick={fetchReport}
                        disabled={loading || !reportId}
                        className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'Loading...' : 'Fetch Report'}
                    </button>
                </div>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md">
                    {error}
                </div>
            )}

            {report && (
                <div className="bg-white shadow rounded-lg p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Report ID</h3>
                            <p className="mt-1 text-sm text-gray-900">{report.reportId}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Case Number</h3>
                            <p className="mt-1 text-sm text-gray-900">{report.caseNo}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">FIR Number</h3>
                            <p className="mt-1 text-sm text-gray-900">{report.firNo}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Date</h3>
                            <p className="mt-1 text-sm text-gray-900">{report.date}</p>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-medium text-gray-500">IPFS Hash</h3>
                        <p className="mt-1 text-sm text-gray-900 break-all">{report.ipfs}</p>
                    </div>

                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Content</h3>
                        <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{report.content}</p>
                    </div>

                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Head Address</h3>
                        <p className="mt-1 text-sm text-gray-900 break-all">{report.head}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Latitude</h3>
                            <p className="mt-1 text-sm text-gray-900">{report.latitude}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Longitude</h3>
                            <p className="mt-1 text-sm text-gray-900">{report.longitude}</p>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Access</h3>
                        <p className="mt-1 text-sm text-gray-900">
                            {report.access ? 'Public' : 'Private'}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
} 