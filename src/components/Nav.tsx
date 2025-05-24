import ConnectWallet from './test';
import { WalletKitProvider } from '@mysten/wallet-kit';
import { Link } from 'react-router-dom';

function Nav() {
    return (
        <header className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
            <nav className="container mx-auto px-4 py-3">
                <div className="flex justify-between items-center">
                    <Link to="/" className="flex items-center space-x-2">
                        <span className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">EviVault</span>
                    </Link>
                    
                    <div className="hidden md:flex items-center space-x-8">
                        <div className="flex items-center space-x-6">
                            <Link to="/get" className="text-gray-300 hover:text-white transition-colors duration-200">GET Evidence</Link>
                            <Link to="/add" className="text-gray-300 hover:text-white transition-colors duration-200">ADD Evidence</Link>
                        </div>
                        
                        <WalletKitProvider>
                            <ConnectWallet />
                        </WalletKitProvider>
                    </div>
                </div>
            </nav>
        </header>
    );
}

export default Nav;