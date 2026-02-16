import { useState } from 'react';
import { LayoutDashboard, Sliders, Scale, ShieldCheck } from 'lucide-react';
import Dashboard from './components/Dashboard';
import WhatIfSimulator from './components/WhatIfSimulator';
import FairnessDashboard from './components/FairnessDashboard';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 p-4 shadow-lg sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-500 p-2 rounded-lg">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-green-400">
              AI Credit Scoring
            </h1>
          </div>
          <nav className="flex space-x-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-2 rounded-lg transition-all flex items-center space-x-2 ${activeTab === 'dashboard'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Assessment</span>
            </button>
            <button
              onClick={() => setActiveTab('whatif')}
              className={`px-4 py-2 rounded-lg transition-all flex items-center space-x-2 ${activeTab === 'whatif'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
            >
              <Sliders className="w-4 h-4" />
              <span>What-If Simulator</span>
            </button>
            <button
              onClick={() => setActiveTab('fairness')}
              className={`px-4 py-2 rounded-lg transition-all flex items-center space-x-2 ${activeTab === 'fairness'
                  ? 'bg-green-600 text-white shadow-md'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
            >
              <Scale className="w-4 h-4" />
              <span>Fairness</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-6">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'whatif' && <WhatIfSimulator />}
        {activeTab === 'fairness' && <FairnessDashboard />}
      </main>

      {/* Footer */}
      <footer className="mt-12 py-6 text-center text-gray-500 text-sm border-t border-gray-800">
        <p>Barclays Hackathon Prototype | AI-Powered Credit Scoring</p>
        <p className="mt-1">Powered by XGBoost & SHAP</p>
      </footer>
    </div>
  );
}

export default App;
