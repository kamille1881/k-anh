import { Transaction } from '../context/FinanceContext';

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
};

export const calculateForecast = (currentBalance: number, transactions: Transaction[], months: number) => {
  if (transactions.length === 0) return Array(months).fill(currentBalance);

  // Get unique months in transactions
  const monthsData = new Set(transactions.map(t => t.date.substring(0, 7)));
  const numMonths = monthsData.size || 1;

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const avgMonthlyIncome = totalIncome / numMonths;
  const avgMonthlyExpense = totalExpense / numMonths;
  const monthlySavings = avgMonthlyIncome - avgMonthlyExpense;

  const forecast = [];
  for (let i = 1; i <= months; i++) {
    forecast.push({
      month: `Tháng ${i}`,
      balance: currentBalance + monthlySavings * i,
    });
  }
  return forecast;
};

export const getFinancialAdvice = (savingsRate: number, expenseRatio: number) => {
  if (savingsRate < 0) {
    return "Cảnh báo: Bạn đang chi tiêu vượt quá thu nhập. Hãy xem xét cắt giảm các khoản chi không cần thiết như 'Giải trí' hoặc 'Ăn uống' ngoài.";
  }
  if (savingsRate < 10) {
    return "Tỷ lệ tiết kiệm của bạn hơi thấp. Hãy cố gắng áp dụng quy tắc 50/30/20 (50% nhu cầu, 30% mong muốn, 20% tiết kiệm).";
  }
  if (savingsRate > 30) {
    return "Tuyệt vời! Bạn đang quản lý tài chính rất tốt. Hãy cân nhắc trích một phần tiền tiết kiệm để 'Đầu tư' vào bản thân hoặc các kênh tài chính khác.";
  }
  return "Tình hình tài chính của bạn đang ổn định. Hãy duy trì thói quen ghi chép chi tiêu hàng ngày.";
};
