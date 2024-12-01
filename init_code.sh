# # Create the React app
# npx create-react-app plugin-manager-app
# cd plugin-manager-app

# Create the folder structure inside the React app
mkdir -p src/components src/services src/utils plugins

# Create the component files
cat > src/components/PluginTable.js <<EOF
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PluginTable = ({ setSelectedPlugin }) => {
  const [plugins, setPlugins] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/plugins').then(response => {
      setPlugins(response.data);
    });
  }, []);

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Version</th>
          <th>Author</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {plugins.map(plugin => (
          <tr key={plugin.id}>
            <td>{plugin.name}</td>
            <td>{plugin.version}</td>
            <td>{plugin.author}</td>
            <td>
              <button onClick={() => setSelectedPlugin(plugin)}>View Details</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default PluginTable;
EOF

cat > src/components/PluginDetails.js <<EOF
import React from 'react';
import axios from 'axios';

const PluginDetails = ({ plugin }) => {
  const handleInstall = () => {
    axios.post('http://localhost:5000/install', { folderName: plugin.folderName });
  };

  const handleUninstall = () => {
    axios.post('http://localhost:5000/uninstall', { folderName: plugin.folderName });
  };

  const handleUpdate = () => {
    axios.post('http://localhost:5000/update', { folderName: plugin.folderName });
  };

  return (
    <div>
      <h1>{plugin.name}</h1>
      <iframe src={`http://localhost:5000/plugins/${plugin.id}/index.html`} width="100%" height="500"></iframe>
      <button onClick={handleInstall}>Install</button>
      <button onClick={handleUninstall}>Uninstall</button>
      <button onClick={handleUpdate}>Update</button>
    </div>
  );
};

export default PluginDetails;
EOF

cat > src/components/InstalledPluginsTable.js <<EOF
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const InstalledPluginsTable = () => {
  const [installedPlugins, setInstalledPlugins] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/installed-plugins').then(response => {
      setInstalledPlugins(response.data);
    });
  }, []);

  const handleUninstall = (folderName) => {
    axios.post('http://localhost:5000/uninstall', { folderName }).then(() => {
      setInstalledPlugins(installedPlugins.filter(plugin => plugin.folderName !== folderName));
    });
  };

  return (
    <div>
      <h2>Installed Plugins</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Version</th>
            <th>Author</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {installedPlugins.map(plugin => (
            <tr key={plugin.id}>
              <td>{plugin.name}</td>
              <td>{plugin.version}</td>
              <td>{plugin.author}</td>
              <td>
                <button onClick={() => handleUninstall(plugin.folderName)}>Uninstall</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InstalledPluginsTable;
EOF

# Create the main App.js file
cat > src/App.js <<EOF
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PluginTable from './components/PluginTable';
import PluginDetails from './components/PluginDetails';
import InstalledPluginsTable from './components/InstalledPluginsTable';

const App = () => {
  const [selectedPlugin, setSelectedPlugin] = useState(null);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div>
              <PluginTable setSelectedPlugin={setSelectedPlugin} />
              <InstalledPluginsTable />
            </div>
          }
        />
        <Route path="/details" element={<PluginDetails plugin={selectedPlugin} />} />
      </Routes>
    </Router>
  );
};

export default App;
EOF

# Create service files
cat > src/services/pluginService.js <<EOF
import axios from 'axios';

const BASE_URL = 'http://localhost:5000';

export const getPlugins = () => axios.get(\`\${BASE_URL}/plugins\`);
export const getInstalledPlugins = () => axios.get(\`\${BASE_URL}/installed-plugins\`);
export const installPlugin = (folderName) => axios.post(\`\${BASE_URL}/install\`, { folderName });
export const uninstallPlugin = (folderName) => axios.post(\`\${BASE_URL}/uninstall\`, { folderName });
export const updatePlugin = (folderName) => axios.post(\`\${BASE_URL}/update\`, { folderName });
EOF

# Start the development server
# npm start
