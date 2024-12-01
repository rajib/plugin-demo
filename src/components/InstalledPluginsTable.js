import React, { useState, useEffect } from 'react';
import axios from 'axios';

const InstalledPluginsTable = () => {
  const [installedPlugins, setInstalledPlugins] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5001/installed-plugins').then(response => {
      setInstalledPlugins(response.data);
    });
  }, []);

  const handleUninstall = (folderName) => {
    if (window.confirm('Are you sure you want to uninstall this plugin?')) {
      axios.post('http://localhost:5001/uninstall', { folderName }).then(() => {
        setInstalledPlugins(installedPlugins.filter(plugin => plugin.folderName !== folderName));
      });
    }
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
