import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PluginTable from './components/PluginTable';
import InstalledPluginsTable from './components/InstalledPluginsTable';
import PluginDetails from './components/PluginDetails';
import AvailablePluginDetails from './components/AvailablePluginDetails';

const App = () => {
  return (
    <Router>
      <div className="p-8 bg-gray-100 min-h-screen">
        <h1 className="text-4xl font-bold text-center mb-8">Plugin Management System</h1>
        <Routes>
          <Route
            path="/"
            element={
              <div className="space-y-8">
                <PluginTable />
                {/* <InstalledPluginsTable /> */}
              </div>
            }
          />
          <Route path="/settings/:folderName" element={<PluginDetails />} />
          <Route path="/plugins/:folderName" element={<AvailablePluginDetails />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
