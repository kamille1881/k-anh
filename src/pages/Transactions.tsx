import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { Search, Filter, Trash2, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { formatCurrency } from '../utils/financeUtils';
import { motion } from 'motion/react';

export default function Transactions() {
  const { transactions, deleteTransaction } = useFinance();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterType, setFilterType] = React.useState<'all' | 'income' | 'expense'>('all');
  const [filterDate, setFilterDate] = React.useState('');

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         t.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || t.type === filterType;
    const matchesDate = !filterDate || t.date === filterDate;
    return matchesSearch && matchesType && matchesDate;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Lịch sử giao dịch</h1>
          <p className="text-slate-500">Quản lý và theo dõi tất cả các khoản thu chi của bạn.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative md:col-span-2">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm theo mô tả hoặc danh mục..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 shadow-sm"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 shadow-sm appearance-none"
          >
            <option value="all">Tất cả loại</option>
            <option value="income">Chỉ thu nhập</option>
            <option value="expense">Chỉ chi tiêu</option>
          </select>
        </div>
        <div className="relative">
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="w-full px-4 py-3 bg-white border border-slate-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 shadow-sm"
          />
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Ngày</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Mô tả</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Danh mục</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Số tiền</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTransactions.map((t, idx) => (
                <motion.tr 
                  key={t.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm text-slate-600">{t.date}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${t.type === 'income' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                        {t.type === 'income' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}
                      </div>
                      <span className="font-bold text-slate-900">{t.description}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium">
                      {t.category}
                    </span>
                  </td>
                  <td className={`px-6 py-4 font-bold ${t.type === 'income' ? 'text-emerald-500' : 'text-red-500'}`}>
                    {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => deleteTransaction(t.id)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </motion.tr>
              ))}
              {filteredTransactions.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    Không tìm thấy giao dịch nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
