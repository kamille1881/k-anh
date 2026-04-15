import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { ShieldCheck, Target, Lightbulb, TrendingUp } from 'lucide-react';
import { getFinancialAdvice, formatCurrency } from '../utils/financeUtils';
import { motion, AnimatePresence } from 'motion/react';

export default function Analysis() {
  const { totalIncome, totalExpense, savingsRate, transactions } = useFinance();
  const [expandedSection, setExpandedSection] = React.useState<'fixed' | 'variable' | null>(null);

  const now = new Date();
  const currentMonthStr = now.toISOString().substring(0, 7);
  const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthStr = lastMonthDate.toISOString().substring(0, 7);

  const currentMonthTransactions = transactions.filter(t => t.date.startsWith(currentMonthStr));
  const lastMonthTransactions = transactions.filter(t => t.date.startsWith(lastMonthStr));

  const currentExpense = currentMonthTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const lastExpense = lastMonthTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

  const expenseDiff = currentExpense - lastExpense;
  const expenseChangePercent = lastExpense > 0 ? (expenseDiff / lastExpense) * 100 : 0;

  const fixedCategories = ['Học phí', 'Nhà trọ', 'Đi lại'];
  
  const fixedTransactions = currentMonthTransactions.filter(t => t.type === 'expense' && fixedCategories.includes(t.category));
  const variableTransactions = currentMonthTransactions.filter(t => t.type === 'expense' && !fixedCategories.includes(t.category));

  const fixedExpenses = fixedTransactions.reduce((sum, t) => sum + t.amount, 0);
  const variableExpenses = currentExpense - fixedExpenses;

  const fixedRatio = currentExpense > 0 ? (fixedExpenses / currentExpense) * 100 : 0;
  const variableRatio = currentExpense > 0 ? (variableExpenses / currentExpense) * 100 : 0;

  const advice = getFinancialAdvice(savingsRate, fixedRatio);
  
  const trendAdvice = expenseChangePercent > 0 
    ? `Chi tiêu của bạn tăng ${expenseChangePercent.toFixed(1)}% so với tháng trước. Hãy kiểm tra các khoản chi biến đổi.`
    : lastExpense > 0 
      ? `Tuyệt vời! Chi tiêu của bạn giảm ${Math.abs(expenseChangePercent).toFixed(1)}% so với tháng trước.`
      : "Đây là tháng đầu tiên bạn ghi chép chi tiêu. Hãy duy trì để có dữ liệu so sánh.";

  const metrics = [
    { label: 'Tỷ lệ tiết kiệm', value: `${savingsRate.toFixed(1)}%`, desc: 'Phần thu nhập còn lại sau chi tiêu', icon: ShieldCheck, color: 'text-emerald-500' },
    { label: 'Chi tiêu cố định', value: `${fixedRatio.toFixed(1)}%`, desc: 'Học phí, nhà trọ, đi lại', icon: Target, color: 'text-blue-500' },
    { label: 'Chi tiêu biến đổi', value: `${variableRatio.toFixed(1)}%`, desc: 'Ăn uống, giải trí, khác', icon: Lightbulb, color: 'text-amber-500' },
  ];

  const renderTransactionList = (list: any[]) => (
    <div className="mt-4 space-y-2 max-h-60 overflow-y-auto pr-2">
      {list.map(t => (
        <div key={t.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl text-sm">
          <div>
            <p className="font-bold text-slate-900">{t.description}</p>
            <p className="text-[10px] text-slate-500">{t.date} • {t.category}</p>
          </div>
          <p className="font-bold text-red-500">{formatCurrency(t.amount)}</p>
        </div>
      ))}
      {list.length === 0 && <p className="text-center py-4 text-slate-400 text-xs">Không có giao dịch nào.</p>}
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Phân tích tài chính</h1>
        <p className="text-slate-500">Đánh giá sức khỏe tài chính và nhận lời khuyên từ chuyên gia.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metrics.map((m, idx) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="p-6 bg-white rounded-3xl shadow-sm border border-slate-100"
          >
            <div className={`p-3 w-fit rounded-2xl bg-slate-50 mb-4 ${m.color}`}>
              <m.icon className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-medium text-slate-500 mb-1">{m.label}</h3>
            <p className="text-3xl font-black text-slate-900 mb-2">{m.value}</p>
            <p className="text-xs text-slate-400">{m.desc}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-8 bg-slate-900 text-white rounded-3xl shadow-xl relative overflow-hidden"
        >
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-emerald-400 mb-4">
              <TrendingUp className="w-5 h-5" />
              <span className="font-bold uppercase tracking-wider text-xs">Lời khuyên chuyên gia</span>
            </div>
            <h3 className="text-2xl font-bold mb-4">Cải thiện tài chính của bạn</h3>
            <p className="text-slate-400 leading-relaxed mb-4">
              {advice}
            </p>
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10 mb-6">
              <p className="text-sm text-emerald-400 font-medium mb-1">Xu hướng chi tiêu:</p>
              <p className="text-slate-300 text-sm">{trendAdvice}</p>
            </div>
            <button className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-all">
              Xem chi tiết lộ trình
            </button>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-3xl rounded-full -mr-32 -mt-32" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="p-8 bg-white rounded-3xl shadow-sm border border-slate-100"
        >
          <h3 className="text-xl font-bold text-slate-900 mb-6">Cơ cấu chi tiêu</h3>
          <div className="space-y-6">
            <div 
              className="cursor-pointer group"
              onClick={() => setExpandedSection(expandedSection === 'fixed' ? null : 'fixed')}
            >
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-500 group-hover:text-blue-500 transition-colors">Cố định {expandedSection === 'fixed' ? '▲' : '▼'}</span>
                <span className="font-bold text-slate-900">{formatCurrency(fixedExpenses)}</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full">
                <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${fixedRatio}%` }} />
              </div>
              <AnimatePresence>
                {expandedSection === 'fixed' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    {renderTransactionList(fixedTransactions)}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <div 
              className="cursor-pointer group"
              onClick={() => setExpandedSection(expandedSection === 'variable' ? null : 'variable')}
            >
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-500 group-hover:text-amber-500 transition-colors">Biến đổi {expandedSection === 'variable' ? '▲' : '▼'}</span>
                <span className="font-bold text-slate-900">{formatCurrency(variableExpenses)}</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full">
                <div className="h-full bg-amber-500 rounded-full transition-all" style={{ width: `${variableRatio}%` }} />
              </div>
              <AnimatePresence>
                {expandedSection === 'variable' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    {renderTransactionList(variableTransactions)}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
