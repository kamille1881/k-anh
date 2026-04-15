import React from 'react';
import { useFinance, Category } from '../context/FinanceContext';
import { PieChart, AlertCircle, Plus, Edit2 } from 'lucide-react';
import { formatCurrency } from '../utils/financeUtils';
import { motion } from 'motion/react';

export default function Budget() {
  const { budgets, transactions, updateBudget } = useFinance();
  const [isEditing, setIsEditing] = React.useState<Category | null>(null);
  const [newLimit, setNewLimit] = React.useState('');

  const expenseCategories: Category[] = ['Học phí', 'Ăn uống', 'Nhà trọ', 'Đi lại', 'Giải trí', 'Đầu tư', 'Khác'];

  const getSpentAmount = (category: Category) => {
    return transactions
      .filter(t => t.type === 'expense' && t.category === category)
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const handleUpdate = (category: Category) => {
    if (!newLimit) return;
    updateBudget(category, parseFloat(newLimit));
    setIsEditing(null);
    setNewLimit('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Lập ngân sách</h1>
        <p className="text-slate-500">Thiết lập hạn mức chi tiêu để kiểm soát tài chính tốt hơn.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {expenseCategories.map((cat, idx) => {
          const budget = budgets.find(b => b.category === cat);
          const spent = getSpentAmount(cat);
          const limit = budget?.limit || 0;
          const percent = limit > 0 ? (spent / limit) * 100 : 0;
          const isOver = percent > 100;

          return (
            <motion.div
              key={cat}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="p-6 bg-white rounded-3xl shadow-sm border border-slate-100"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-100 rounded-xl">
                    <PieChart className="w-5 h-5 text-slate-500" />
                  </div>
                  <h3 className="font-bold text-slate-900">{cat}</h3>
                </div>
                <button 
                  onClick={() => {
                    setIsEditing(cat);
                    setNewLimit(limit.toString());
                  }}
                  className="p-2 text-slate-400 hover:text-emerald-500 hover:bg-emerald-500/10 rounded-lg transition-all"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>

              {isEditing === cat ? (
                <div className="flex gap-2 mb-4">
                  <input
                    type="number"
                    value={newLimit}
                    onChange={(e) => setNewLimit(e.target.value)}
                    className="flex-1 px-4 py-2 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500"
                    placeholder="Nhập hạn mức..."
                  />
                  <button 
                    onClick={() => handleUpdate(cat)}
                    className="px-4 py-2 bg-emerald-500 text-white rounded-xl font-bold"
                  >
                    Lưu
                  </button>
                </div>
              ) : (
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-500">Đã chi: {formatCurrency(spent)}</span>
                  <span className="font-bold text-slate-900">Hạn mức: {limit > 0 ? formatCurrency(limit) : 'Chưa thiết lập'}</span>
                </div>
              )}

              <div className="relative h-3 bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(percent, 100)}%` }}
                  className={`h-full rounded-full ${isOver ? 'bg-red-500' : percent > 80 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                />
              </div>

              <div className="flex items-center justify-between mt-2">
                <span className="text-xs font-medium text-slate-400">{percent.toFixed(1)}% đã sử dụng</span>
                {isOver && (
                  <div className="flex items-center gap-1 text-red-500 text-xs font-bold">
                    <AlertCircle className="w-3 h-3" />
                    Vượt ngân sách!
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
