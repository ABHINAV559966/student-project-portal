import { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';
import Sidebar from './components/layout/Sidebar';
import Navbar from './components/layout/Navbar';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import TaskDetail from './pages/TaskDetail';

// Page titles map for the navbar
const PAGE_TITLES = {
  '/': 'Dashboard',
  '/tasks': 'All Tasks',
};

const getPageTitle = (pathname) => {
  if (pathname.startsWith('/tasks/') && pathname.length > 7) return 'Task Detail';
  return PAGE_TITLES[pathname] || 'Project Portal';
};

const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const pageTitle = getPageTitle(location.pathname);

  return (
    <div className="flex h-screen overflow-hidden app-bg bg-slate-50 dark:bg-slate-950">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Navbar */}
        <div className="p-3 lg:p-4 lg:pt-4 lg:pr-4 flex-shrink-0">
          <Navbar
            onMenuClick={() => setSidebarOpen(true)}
            pageTitle={pageTitle}
          />
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto px-3 pb-3 lg:px-4 lg:pb-4">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/tasks/:id" element={<TaskDetail />} />
            <Route
              path="*"
              element={
                <div className="flex flex-col items-center justify-center h-full text-center py-24">
                  <div className="text-7xl mb-4">404</div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Page Not Found</h2>
                  <p className="text-slate-500 dark:text-slate-400">
                    The page you're looking for doesn't exist.
                  </p>
                </div>
              }
            />
          </Routes>
        </main>
      </div>

      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: 'var(--toast-bg, #1e293b)',
            color: '#f1f5f9',
            borderRadius: '12px',
            padding: '12px 16px',
            fontSize: '14px',
            fontWeight: '500',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          },
          success: {
            iconTheme: { primary: '#10b981', secondary: '#fff' },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#fff' },
          },
        }}
      />
    </div>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
