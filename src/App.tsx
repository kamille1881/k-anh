import React from 'react';
import { FinanceProvider, useFinance } from './context/FinanceContext';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Budget from './pages/Budget';
import Archive from './pages/Archive';
import Analysis from './pages/Analysis';
import Login from './pages/Login';
import TransactionModal from './components/TransactionModal';
import { Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

function AppContent() {
  const { userName, isAuthenticated } = useFinance();
  const [activeTab, setActiveTab] = React.useState('dashboard');
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  if (!isAuthenticated) {
    return <Login />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'transactions': return <Transactions />;
      case 'budget': return <Budget />;
      case 'archive': return <Archive />;
      case 'analysis': return <Analysis />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 transition-colors duration-300">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-20 flex items-center justify-between px-6 sm:px-10 bg-white/80 backdrop-blur-md border-b border-slate-100 z-10">
          <div className="flex items-center gap-4 ml-auto">
            <div className="hidden md:flex flex-col items-end mr-2">
              <span className="text-sm font-bold text-slate-900 leading-none">{userName}</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider mt-1">Đang hoạt động</span>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">Giao dịch mới</span>
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="max-w-7xl mx-auto"
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <TransactionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}

export default function App() {
  return (
    <FinanceProvider>
      <AppContent />
    </FinanceProvider>
  );
}
