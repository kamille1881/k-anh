import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { 
  LayoutDashboard, 
  ArrowUpRight, 
  ArrowDownLeft, 
  PieChart, 
  Archive, 
  TrendingUp,
  Settings, 
  Menu, 
  X,
  Moon,
  Sun,
  LogOut,
  Edit2,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../utils/cn';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const { userName, updateUserName, logout } = useFinance();
  const [isOpen, setIsOpen] = React.useState(false);
  const [isEditingName, setIsEditingName] = React.useState(false);
  const [tempName, setTempName] = React.useState(userName);

  const handleSaveName = () => {
    if (tempName.trim()) {
      updateUserName(tempName.trim());
      setIsEditingName(false);
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'Tổng quan', icon: LayoutDashboard },
    { id: 'transactions', label: 'Giao dịch', icon: ArrowUpRight },
    { id: 'budget', label: 'Ngân sách', icon: PieChart },
    { id: 'archive', label: 'Lưu trữ', icon: Archive },
    { id: 'analysis', label: 'Phân tích', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md"
      >
        <Menu className="w-6 h-6 text-slate-600" />
      </button>

      {/* Sidebar Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="lg:hidden fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Container */}
      <motion.aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white flex flex-col transition-transform duration-300 lg:translate-x-0",
          !isOpen && "-translate-x-full"
        )}
      >
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            {isEditingName ? (
              <div className="flex items-center gap-1">
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  onBlur={handleSaveName}
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                  autoFocus
                  className="w-full bg-slate-800 text-white text-sm font-bold px-2 py-1 rounded border border-emerald-500 outline-none"
                />
                <button onClick={handleSaveName} className="text-emerald-500">
                  <Check className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between group">
                <div className="min-w-0">
                  <h1 className="font-bold text-sm leading-tight truncate">{userName}</h1>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider">Tài khoản</p>
                </div>
                <button 
                  onClick={() => {
                    setTempName(userName);
                    setIsEditingName(true);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-800 rounded transition-all"
                >
                  <Edit2 className="w-3 h-3 text-slate-400" />
                </button>
              </div>
            )}
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-1 hover:bg-slate-800 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsOpen(false);
              }}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                activeTab === item.id 
                  ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" 
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5",
                activeTab === item.id ? "text-white" : "text-slate-500 group-hover:text-slate-300"
              )} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-2">
          <button 
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-500 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Đăng xuất</span>
          </button>
        </div>
      </motion.aside>
    </>
  );
}
