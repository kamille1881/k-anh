import React from 'react';
import { useFinance, Category } from '../context/FinanceContext';
import { X, Plus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TransactionModal({ isOpen, onClose }: TransactionModalProps) {
  const { addTransaction, categories, addCategory, deleteCategory } = useFinance();
  const [type, setType] = React.useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = React.useState('');
  const [category, setCategory] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [date, setDate] = React.useState(new Date().toISOString().split('T')[0]);
  const [newCategoryName, setNewCategoryName] = React.useState('');
  const [showAddCategory, setShowAddCategory] = React.useState(false);

  React.useEffect(() => {
    if (categories[type].length > 0) {
      setCategory(categories[type][0]);
    }
  }, [type, categories]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description || !category) return;

    addTransaction({
      type,
      amount: parseFloat(amount),
      category,
      description,
      date
    });
    
    // Reset form
    setAmount('');
    setDescription('');
    onClose();
  };

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      addCategory(type, newCategoryName.trim());
      setCategory(newCategoryName.trim());
      setNewCategoryName('');
      setShowAddCategory(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
          >
            <div className="p-6 border-b border-slate-100 flex items-center justify-between shrink-0">
              <h2 className="text-xl font-bold text-slate-900">Thêm giao dịch mới</h2>
              <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
              <div className="flex p-1 bg-slate-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setType('expense')}
                  className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                    type === 'expense' 
                      ? 'bg-white text-red-500 shadow-sm' 
                      : 'text-slate-500'
                  }`}
                >
                  Chi tiêu
                </button>
                <button
                  type="button"
                  onClick={() => setType('income')}
                  className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                    type === 'income' 
                      ? 'bg-white text-emerald-500 shadow-sm' 
                      : 'text-slate-500'
                  }`}
                >
                  Thu nhập
                </button>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Số tiền (VND)</label>
                <input
                  type="number"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0"
                  className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 text-lg font-bold"
                />
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Danh mục</label>
                    <button 
                      type="button"
                      onClick={() => setShowAddCategory(!showAddCategory)}
                      className="text-xs font-bold text-emerald-500 hover:underline"
                    >
                      {showAddCategory ? 'Hủy' : '+ Thêm mới'}
                    </button>
                  </div>
                  
                  {showAddCategory ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        placeholder="Tên danh mục..."
                        className="flex-1 px-4 py-2 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 text-sm"
                      />
                      <button
                        type="button"
                        onClick={handleAddCategory}
                        className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-sm font-bold"
                      >
                        Thêm
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="flex-1 px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500"
                      >
                        {categories[type].map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => deleteCategory(type, category)}
                        className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500/20 transition-colors"
                        title="Xóa danh mục này"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>
                
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Ngày</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Ghi chú</label>
                <input
                  type="text"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ví dụ: Ăn trưa tại canteen"
                  className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/30 transition-all flex items-center justify-center gap-2 mt-4 shrink-0"
              >
                <Plus className="w-5 h-5" />
                Xác nhận
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
