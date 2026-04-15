import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { TrendingUp, User, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

export default function Login() {
  const { login, register } = useFinance();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [studentName, setStudentName] = useState('');
  const [emailPassword, setEmailPassword] = useState('');
  const [accountPassword, setAccountPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      if (!email || !accountPassword) {
        setError('Vui lòng nhập đầy đủ thông tin.');
        return;
      }
      const success = login(email, accountPassword);
      if (!success) setError('Email hoặc mật khẩu tài khoản không đúng.');
    } else {
      if (!email || !emailPassword || !accountPassword || !studentName) {
        setError('Vui lòng nhập đầy đủ tất cả các trường.');
        return;
      }
      if (!email.includes('@')) {
        setError('Vui lòng nhập địa chỉ email hợp lệ.');
        return;
      }
      const success = register(email, emailPassword, accountPassword, studentName);
      if (!success) setError('Email này đã được đăng ký.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        {/* Logo Section */}
        <div className="text-center mb-10">
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500 rounded-2xl shadow-xl shadow-emerald-500/20 mb-4"
          >
            <TrendingUp className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-3xl font-black text-slate-900">Student Planner</h1>
          <p className="text-slate-500 mt-2">Quản lý tài chính cá nhân thông minh</p>
        </div>

        {/* Form Card */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8"
        >
          <div className="flex gap-4 mb-8 p-1 bg-slate-100 rounded-2xl">
            <button 
              onClick={() => {
                setIsLogin(true);
                setError('');
              }}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${isLogin ? 'bg-white text-emerald-500 shadow-sm' : 'text-slate-500'}`}
            >
              Đăng nhập
            </button>
            <button 
              onClick={() => {
                setIsLogin(false);
                setError('');
              }}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${!isLogin ? 'bg-white text-emerald-500 shadow-sm' : 'text-slate-500'}`}
            >
              Đăng ký
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Địa chỉ Email</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all"
                  placeholder="example@gmail.com"
                />
              </div>
            </div>

            {!isLogin && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                className="space-y-5"
              >
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Tên học sinh</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                      type="text" 
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all"
                      placeholder="Nguyễn Văn A"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Mật khẩu Email</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                      type="password" 
                      value={emailPassword}
                      onChange={(e) => setEmailPassword(e.target.value)}
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all"
                      placeholder="Mật khẩu ứng dụng email"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Mật khẩu Tài khoản</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="password" 
                  value={accountPassword}
                  onChange={(e) => setAccountPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all"
                  placeholder="Mật khẩu đăng nhập ứng dụng"
                />
              </div>
            </div>

            {error && (
              <motion.p 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-red-500 text-sm font-medium ml-1"
              >
                {error}
              </motion.p>
            )}

            <button 
              type="submit"
              className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-bold shadow-lg shadow-emerald-500/20 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              {isLogin ? 'Đăng nhập ngay' : 'Tạo tài khoản'}
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>
        </motion.div>

        {/* Footer Info */}
        <div className="mt-8 flex items-center justify-center gap-2 text-slate-400 text-sm">
          <ShieldCheck className="w-4 h-4" />
          <span>Dữ liệu của bạn được bảo mật và lưu trữ cục bộ</span>
        </div>
      </div>
    </div>
  );
}
