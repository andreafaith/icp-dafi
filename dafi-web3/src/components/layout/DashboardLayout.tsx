import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Box } from '@mui/material';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [locale, setLocale] = useState('en');
  const router = useRouter();

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <Box sx={{ flexGrow: 1 }}>
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          theme={theme}
          onThemeToggle={toggleTheme}
          locale={locale}
          onLocaleChange={setLocale}
        />

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            mt: 8,
            bgcolor: theme === 'dark' ? 'grey.900' : 'grey.50',
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;
