import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  PiggyBank,
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
  PieChart as PieChartIcon,
  BarChart3
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { formatCurrency } from '../utils/financeUtils';
import { motion } from 'motion/react';

export default function Dashboard() {
  const { transactions } = useFinance();
  const now = new Date();

  // Prepare data for monthly chart (Dynamic based on transactions)
  const getMonthlyTrend = () => {
    const monthsMap = new Map<string, { name: string, thu: number, chi: number, sortKey: string }>();
    
    // Add current month by default
    const currentMonthStr = now.toISOString().substring(0, 7);
    const currentMonthName = `T${now.getMonth() + 1}/${now.getFullYear().toString().slice(-2)}`;
    monthsMap.set(currentMonthStr, { name: currentMonthName, thu: 0, chi: 0, sortKey: currentMonthStr });

    // Add months from transactions
    transactions.forEach(t => {
      const monthStr = t.date.substring(0, 7);
      if (!monthsMap.has(monthStr)) {
        const [year, month] = monthStr.split('-');
        monthsMap.set(monthStr, { 
          name: `T${parseInt(month)}/${year.slice(-2)}`, 
          thu: 0, 
          chi: 0, 
          sortKey: monthStr 
        });
      }
      const data = monthsMap.get(monthStr)!;
      if (t.type === 'income') data.thu += t.amount;
      else data.chi += t.amount;
    });

    return Array.from(monthsMap.values())
      .sort((a, b) => a.sortKey.localeCompare(b.sortKey))
      .slice(-6); // Keep last 6 active months
  };

  const monthlyData = getMonthlyTrend();

  // Prepare data for category distribution (Current month only)
  const currentMonth = new Date().toISOString().substring(0, 7);
  const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthStr = lastMonthDate.toISOString().substring(0, 7);

  const currentMonthTransactions = transactions.filter(t => t.date.startsWith(currentMonth));
  const lastMonthTransactions = transactions.filter(t => t.date.startsWith(lastMonthStr));
  
  const currentMonthIncome = currentMonthTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const currentMonthExpense = currentMonthTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const lastMonthExpense = lastMonthTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const expenseDiff = currentMonthExpense - lastMonthExpense;
  const expenseChangePercent = lastMonthExpense > 0 ? (expenseDiff / lastMonthExpense) * 100 : 0;

  const currentMonthBalance = currentMonthIncome - currentMonthExpense;
  const currentMonthSavingsRate = currentMonthIncome > 0 ? ((currentMonthIncome - currentMonthExpense) / currentMonthIncome) * 100 : 0;

  const expenseTransactions = currentMonthTransactions.filter(t => t.type === 'expense');
  const categoryData = Object.entries(
    expenseTransactions.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }));

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#64748b'];

  const stats = [
    { label: 'Số dư tháng này', value: currentMonthBalance, icon: Wallet, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Tổng thu tháng', value: currentMonthIncome, icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { 
      label: 'Tổng chi tháng', 
      value: currentMonthExpense, 
      icon: TrendingDown, 
      color: 'text-red-500', 
      bg: 'bg-red-500/10',
      trend: lastMonthExpense > 0 ? {
        value: `${Math.abs(expenseChangePercent).toFixed(1)}%`,
        isUp: expenseChangePercent > 0,
        label: expenseChangePercent > 0 ? 'tăng' : 'giảm'
      } : null
    },
    { label: 'Tỷ lệ tiết kiệm', value: `${currentMonthSavingsRate.toFixed(1)}%`, icon: PiggyBank, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Chào mừng trở lại!</h1>
          <p className="text-slate-500">Đây là báo cáo tài chính của bạn trong tháng này.</p>
        </div>
        {transactions.length > 0 && lastMonthExpense > 0 && (
          <div className={`hidden sm:flex items-center gap-2 px-4 py-2 ${expenseChangePercent > 0 ? 'bg-red-500' : 'bg-emerald-500'} text-white rounded-xl font-medium shadow-lg shadow-emerald-500/20`}>
            {expenseChangePercent > 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}
            <span>{Math.abs(expenseChangePercent).toFixed(1)}% chi tiêu so với tháng trước</span>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="p-6 bg-white rounded-3xl shadow-sm border border-slate-100"
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-2xl ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-xl font-bold text-slate-900">
                    {typeof stat.value === 'number' ? formatCurrency(stat.value) : stat.value}
                  </p>
                  {stat.trend && (
                    <span className={`text-[10px] font-bold ${stat.trend.isUp ? 'text-red-500' : 'text-emerald-500'}`}>
                      {stat.trend.isUp ? '↑' : '↓'} {stat.trend.value}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-6 bg-white rounded-3xl shadow-sm border border-slate-100"
        >
          <h3 className="text-lg font-bold text-slate-900 mb-6">Xu hướng Thu - Chi</h3>
          <div className="h-[300px] w-full">
            {transactions.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    cursor={{ fill: '#f1f5f9' }}
                  />
                  <Bar dataKey="thu" fill="#10b981" radius={[4, 4, 0, 0]} name="Thu nhập" />
                  <Bar dataKey="chi" fill="#ef4444" radius={[4, 4, 0, 0]} name="Chi tiêu" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400">
                <BarChart3 className="w-12 h-12 mb-2 opacity-20" />
                <p>Chưa có dữ liệu thu chi</p>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="p-6 bg-white rounded-3xl shadow-sm border border-slate-100"
        >
          <h3 className="text-lg font-bold text-slate-900 mb-6">Phân bổ chi tiêu</h3>
          <div className="h-[300px] w-full">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400">
                <PieChartIcon className="w-12 h-12 mb-2 opacity-20" />
                <p>Chưa có dữ liệu chi tiêu</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">Giao dịch gần đây</h3>
          <button className="text-emerald-500 font-semibold text-sm hover:underline">Xem tất cả</button>
        </div>
        <div className="divide-y divide-slate-100">
          {transactions.slice(0, 5).map((t) => (
            <div key={t.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${t.type === 'income' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                  {t.type === 'income' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownLeft className="w-5 h-5" />}
                </div>
                <div>
                  <p className="font-bold text-slate-900">{t.description}</p>
                  <p className="text-xs text-slate-500">{t.category} • {t.date}</p>
                </div>
              </div>
              <p className={`font-bold ${t.type === 'income' ? 'text-emerald-500' : 'text-red-500'}`}>
                {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
              </p>
            </div>
          ))}
          {transactions.length === 0 && (
            <div className="p-12 text-center text-slate-400">
              <p>Chưa có giao dịch nào được ghi lại.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
