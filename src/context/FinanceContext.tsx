import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export type Category = 
  | 'Học phí' | 'Ăn uống' | 'Nhà trọ' | 'Đi lại' | 'Giải trí' | 'Đầu tư' | 'Khác'
  | 'Gia đình' | 'Làm thêm' | 'Học bổng';

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
}

export interface Budget {
  category: string;
  limit: number;
}

interface FinanceContextType {
  transactions: Transaction[];
  budgets: Budget[];
  categories: { income: string[], expense: string[] };
  userName: string;
  userEmail: string;
  isAuthenticated: boolean;
  login: (email: string, accountPass: string) => boolean;
  register: (email: string, emailPass: string, accountPass: string, studentName: string) => boolean;
  updateUserName: (name: string) => void;
  logout: () => void;
  addTransaction: (t: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, t: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  updateBudget: (category: string, limit: number) => void;
  addCategory: (type: 'income' | 'expense', name: string) => void;
  deleteCategory: (type: 'income' | 'expense', name: string) => void;
  totalIncome: number;
  totalExpense: number;
  balance: number;
  savingsRate: number;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export function FinanceProvider({ children }: { children: ReactNode }) {
  const [userEmail, setUserEmail] = useState(() => localStorage.getItem('currentUserEmail') || '');
  const [isAuthenticated, setIsAuthenticated] = useState(() => localStorage.getItem('isAuthenticated') === 'true');
  const [userName, setUserName] = useState(() => localStorage.getItem('userName') || '');

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<{ income: string[], expense: string[] }>({
    income: ['Gia đình', 'Làm thêm', 'Học bổng', 'Khác'],
    expense: ['Học phí', 'Ăn uống', 'Nhà trọ', 'Đi lại', 'Giải trí', 'Đầu tư', 'Khác']
  });
  const [budgets, setBudgets] = useState<Budget[]>([]);

  // Load user data when authenticated
  useEffect(() => {
    if (isAuthenticated && userEmail) {
      const savedTransactions = localStorage.getItem(`transactions_${userEmail}`);
      const savedCategories = localStorage.getItem(`categories_${userEmail}`);
      const savedBudgets = localStorage.getItem(`budgets_${userEmail}`);

      if (savedTransactions) setTransactions(JSON.parse(savedTransactions));
      else setTransactions([]);

      if (savedCategories) setCategories(JSON.parse(savedCategories));
      else setCategories({
        income: ['Gia đình', 'Làm thêm', 'Học bổng', 'Khác'],
        expense: ['Học phí', 'Ăn uống', 'Nhà trọ', 'Đi lại', 'Giải trí', 'Đầu tư', 'Khác']
      });

      if (savedBudgets) setBudgets(JSON.parse(savedBudgets));
      else setBudgets([]);
    }
  }, [isAuthenticated, userEmail]);

  // Save user data
  useEffect(() => {
    if (isAuthenticated && userEmail) {
      localStorage.setItem(`transactions_${userEmail}`, JSON.stringify(transactions));
    }
  }, [transactions, isAuthenticated, userEmail]);

  useEffect(() => {
    if (isAuthenticated && userEmail) {
      localStorage.setItem(`categories_${userEmail}`, JSON.stringify(categories));
    }
  }, [categories, isAuthenticated, userEmail]);

  useEffect(() => {
    if (isAuthenticated && userEmail) {
      localStorage.setItem(`budgets_${userEmail}`, JSON.stringify(budgets));
    }
  }, [budgets, isAuthenticated, userEmail]);

  useEffect(() => {
    localStorage.setItem('isAuthenticated', isAuthenticated.toString());
    localStorage.setItem('currentUserEmail', userEmail);
    localStorage.setItem('userName', userName);
  }, [isAuthenticated, userEmail, userName]);

  const addTransaction = (t: Omit<Transaction, 'id'>) => {
    const newTransaction = { ...t, id: crypto.randomUUID() };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const updateTransaction = (id: string, updates: Partial<Transaction>) => {
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const updateBudget = (category: string, limit: number) => {
    setBudgets(prev => {
      const existing = prev.find(b => b.category === category);
      if (existing) {
        return prev.map(b => b.category === category ? { ...b, limit } : b);
      }
      return [...prev, { category, limit }];
    });
  };

  const addCategory = (type: 'income' | 'expense', name: string) => {
    setCategories(prev => {
      if (prev[type].includes(name)) return prev;
      return { ...prev, [type]: [...prev[type], name] };
    });
  };

  const deleteCategory = (type: 'income' | 'expense', name: string) => {
    setCategories(prev => ({
      ...prev,
      [type]: prev[type].filter(c => c !== name)
    }));
  };

  const login = (email: string, accountPass: string) => {
    const users = JSON.parse(localStorage.getItem('app_users') || '[]');
    const user = users.find((u: any) => u.email === email && u.accountPass === accountPass);
    if (user) {
      // Clear current state before loading new user data
      setTransactions([]);
      setBudgets([]);
      
      setUserEmail(email);
      setUserName(user.studentName || email.split('@')[0]);
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const register = (email: string, emailPass: string, accountPass: string, studentName: string) => {
    const users = JSON.parse(localStorage.getItem('app_users') || '[]');
    if (users.find((u: any) => u.email === email)) return false;
    
    const newUsers = [...users, { email, emailPass, accountPass, studentName }];
    localStorage.setItem('app_users', JSON.stringify(newUsers));
    
    // Initialize empty data for new user
    const defaultCategories = {
      income: ['Gia đình', 'Làm thêm', 'Học bổng', 'Khác'],
      expense: ['Học phí', 'Ăn uống', 'Nhà trọ', 'Đi lại', 'Giải trí', 'Đầu tư', 'Khác']
    };
    
    localStorage.setItem(`transactions_${email}`, JSON.stringify([]));
    localStorage.setItem(`budgets_${email}`, JSON.stringify([]));
    localStorage.setItem(`categories_${email}`, JSON.stringify(defaultCategories));

    // Reset state for the new user
    setTransactions([]);
    setBudgets([]);
    setCategories(defaultCategories);

    setUserEmail(email);
    setUserName(studentName);
    setIsAuthenticated(true);
    return true;
  };

  const updateUserName = (name: string) => setUserName(name);

  const logout = () => {
    setIsAuthenticated(false);
    setUserEmail('');
    setUserName('');
    setTransactions([]);
    setBudgets([]);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('currentUserEmail');
    localStorage.removeItem('userName');
  };

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0;

  return (
    <FinanceContext.Provider value={{
      transactions,
      budgets,
      categories,
      userName,
      userEmail,
      isAuthenticated,
      login,
      register,
      updateUserName,
      logout,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      updateBudget,
      addCategory,
      deleteCategory,
      totalIncome,
      totalExpense,
      balance,
      savingsRate
    }}>
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  const context = useContext(FinanceContext);
  if (!context) throw new Error('useFinance must be used within FinanceProvider');
  return context;
}
