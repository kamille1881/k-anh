import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { Archive, ArrowUpRight, ArrowDownLeft, Wallet } from 'lucide-react';
import { formatCurrency } from '../utils/financeUtils';
import { motion } from 'motion/react';

export default function ArchivePage() {
  const { transactions } = useFinance();

  // Group transactions by month
  const monthlyArchive = transactions.reduce((acc, t) => {
    const month = t.date.substring(0, 7); // YYYY-MM
    if (!acc[month]) {
      acc[month] = {
        month,
        income: 0,
        expense: 0,
        transactions: []
      };
    }
    if (t.type === 'income') acc[month].income += t.amount;
    else acc[month].expense += t.amount;
    acc[month].transactions.push(t);
    return acc;
  }, {} as Record<string, any>);

  const sortedMonths = Object.values(monthlyArchive).sort((a: any, b: any) => b.month.localeCompare(a.month));

  const getComparison = (currentIdx: number) => {
    if (currentIdx >= sortedMonths.length - 1) return null;
    const current = sortedMonths[currentIdx] as any;
    const previous = sortedMonths[currentIdx + 1] as any;
    const diff = current.expense - previous.expense;
    const percent = previous.expense > 0 ? (diff / previous.expense) * 100 : 0;
    return { diff, percent };
  };

  const totalBalanceAllMonths = sortedMonths.reduce((sum: number, m: any) => sum + (Number(m.income) - Number(m.expense)), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Lưu trữ giao dịch</h1>
          <p className="text-slate-500">Xem lại lịch sử thu chi được phân loại theo từng tháng.</p>
        </div>
      </div>

      {/* Summary Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-8 bg-slate-900 text-white rounded-3xl shadow-xl relative overflow-hidden"
      >
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <p className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-1">Tổng kết số dư các tháng</p>
            <h2 className="text-4xl font-black">{formatCurrency(totalBalanceAllMonths as number)}</h2>
          </div>
          <div className="flex gap-4">
            <div className="px-4 py-2 bg-white/10 rounded-2xl backdrop-blur-md">
              <p className="text-xs text-slate-400 mb-1">Số tháng lưu trữ</p>
              <p className="font-bold">{sortedMonths.length} tháng</p>
            </div>
            <div className="px-4 py-2 bg-white/10 rounded-2xl backdrop-blur-md">
              <p className="text-xs text-slate-400 mb-1">Tổng giao dịch</p>
              <p className="font-bold">{transactions.length}</p>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-3xl rounded-full -mr-32 -mt-32" />
      </motion.div>

      {/* Monthly List */}
      <div className="space-y-4">
        {sortedMonths.map((m: any, idx: number) => {
          const comparison = getComparison(idx);
          return (
            <motion.div
              key={m.month}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden"
            >
              <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-2xl">
                    <Archive className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Tháng {m.month.split('-')[1]} - {m.month.split('-')[0]}</h3>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-slate-500">{m.transactions.length} giao dịch</p>
                      {comparison && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${comparison.percent > 0 ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                          {comparison.percent > 0 ? '↑' : '↓'} {Math.abs(comparison.percent).toFixed(1)}% chi tiêu
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              
              <div className="grid grid-cols-3 gap-4 md:gap-8">
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Thu nhập</p>
                  <p className="text-emerald-500 font-bold text-sm">{formatCurrency(Number(m.income))}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Chi tiêu</p>
                  <p className="text-red-500 font-bold text-sm">{formatCurrency(Number(m.expense))}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Số dư</p>
                  <p className="text-blue-500 font-bold text-sm">{formatCurrency(Number(m.income) - Number(m.expense))}</p>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
        
        {sortedMonths.length === 0 && (
          <div className="py-20 text-center text-slate-400">
            <Archive className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p>Chưa có dữ liệu lưu trữ.</p>
          </div>
        )}
      </div>
    </div>
  );
}
