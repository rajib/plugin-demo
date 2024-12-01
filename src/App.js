import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PluginTable from './components/PluginTable';
import InstalledPluginsTable from './components/InstalledPluginsTable';
import PluginDetails from './components/PluginDetails';
import AvailablePluginDetails from './components/AvailablePluginDetails';

const App = () => {
  return (
    <Router>
      <div style={{ padding: '20px' }}>
        <h1>Plugin Management System</h1>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <PluginTable />
                <InstalledPluginsTable />
              </>
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
