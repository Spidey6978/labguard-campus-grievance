import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import LandingPage from './pages/LandingPage.jsx';
import HomePage from './pages/HomePage.jsx';
import ReportGrievancePage from './pages/ReportGrievancePage.jsx';
import AssetDirectoryPage from './pages/AssetDirectoryPage.jsx';
import MyTicketsPage from './pages/MyTicketsPage.jsx';
import TriageDeskPage from './pages/TriageDeskPage.jsx';
import AnalyticsPage from './pages/AnalyticsPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import { apiRequest } from './utils/api.js';

function MainApp() {
  const { user } = useAuth();
  const [currentTab, setCurrentTab] = useState('home');
  const [assets, setAssets] = useState([]);
  const [preselectedAsset, setPreselectedAsset] = useState(null);

  const loadAssets = async () => {
    try {
      const res = await apiRequest('/assets');
      if (res.success) setAssets(res.data);
    } catch (err) {
      console.warn('Failed to load assets:', err);
    }
  };

  useEffect(() => {
    loadAssets();
  }, []);

  const handleReportFaultOnAsset = (asset) => {
    setPreselectedAsset(asset);
    setCurrentTab('report');
  };

  return (
    <div className="app-container">
      <Navbar currentTab={currentTab} setTab={setCurrentTab} />

      <main className="main-content">
        {currentTab === 'home' && (
          <LandingPage
            assets={assets}
            setTab={setCurrentTab}
            onSelectAsset={handleReportFaultOnAsset}
          />
        )}

        {currentTab === 'workbench' && (
          <HomePage
            assets={assets}
            setTab={setCurrentTab}
            onSelectAsset={handleReportFaultOnAsset}
            onTicketDeleted={loadAssets}
            onAssetDeleted={loadAssets}
          />
        )}

        {currentTab === 'report' && (
          <ReportGrievancePage
            assets={assets}
            preselectedAsset={preselectedAsset}
            setTab={setCurrentTab}
            onTicketCreated={() => {
              loadAssets();
            }}
          />
        )}

        {currentTab === 'assets' && (
          <AssetDirectoryPage
            assets={assets}
            onReportFault={handleReportFaultOnAsset}
            onAssetDeleted={loadAssets}
          />
        )}

        {currentTab === 'my-tickets' && (
          <MyTicketsPage
            setTab={setCurrentTab}
            onReportClick={() => setCurrentTab('report')}
            onTicketDeleted={loadAssets}
          />
        )}

        {currentTab === 'triage' && (
          <TriageDeskPage onTicketDeleted={loadAssets} />
        )}

        {currentTab === 'analytics' && <AnalyticsPage />}

        {currentTab === 'login' && <LoginPage setTab={setCurrentTab} />}
      </main>

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
