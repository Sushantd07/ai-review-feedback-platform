import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';
import ReviewForm from './components/ReviewForm';
import AdminDashboard from './components/AdminDashboard';

function AppLayout({ children }) {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'light';
    }
    return 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 flex flex-col font-sans text-gray-900 dark:text-slate-100 selection:bg-blue-100 selection:text-blue-900 dark:selection:bg-blue-900 dark:selection:text-blue-100 transition-colors duration-200">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 sticky top-0 z-10 bg-opacity-80 dark:bg-opacity-80 backdrop-blur-md transition-colors duration-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm">
              F
            </div>
            <Link to="/" className="text-xl font-bold tracking-tight text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Feedback<span className="text-blue-600 dark:text-blue-500">Loop</span>
            </Link>
          </div>
          <nav className="flex items-center gap-6 text-sm font-medium text-gray-500 dark:text-slate-400">
            <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Home</Link>
            <Link to="/admin" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Admin</Link>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
              aria-label="Toggle Dark Mode"
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 py-8 mt-auto transition-colors duration-200">
        <div className="max-w-5xl mx-auto px-4 text-center text-gray-400 dark:text-slate-600 text-sm">
          &copy; {new Date().getFullYear()} FeedbackLoop Inc. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">
                  We'd love to hear from you
                </h2>
                <p className="text-lg text-gray-600 dark:text-slate-400 max-w-2xl mx-auto">
                  Your feedback helps us improve our product and build better experiences for everyone.
                </p>
              </div>
              <ReviewForm />
            </div>
          } />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}

export default App;
