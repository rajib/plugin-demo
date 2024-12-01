import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const PluginTable = ({ setSelectedPlugin }) => {
  const [plugins, setPlugins] = useState([]);
  const [installedPlugins, setInstalledPlugins] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5001/plugins').then(response => {
      setPlugins(response.data);
    });
    axios.get('http://localhost:5001/installed-plugins').then(response => {
      setInstalledPlugins(response.data.map(plugin => plugin.folderName)); // Only folder names for easy lookup
    });
  }, []);

  const isPluginInstalled = (folderName) => installedPlugins.includes(folderName);

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
              {isPluginInstalled(plugin.folderName) ? (
                <>
                  <button onClick={() => axios.post('http://localhost:5001/uninstall', { folderName: plugin.folderName })}>
                    Uninstall
                  </button>
                  <Link to={`/settings/${plugin.folderName}`}>
                    <button>Settings</button>
                  </Link>
                </>
              ) : (
                <>
                  <button onClick={() => axios.post('http://localhost:5001/install', { folderName: plugin.folderName })}>
                    Install
                  </button>
                  <Link to={`/plugins/${plugin.folderName}`}>
                    <button>Details</button>
                  </Link>
                  {/* <button onClick={() => setSelectedPlugin(plugin)}>View Details</button> */}
                </>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default PluginTable;
