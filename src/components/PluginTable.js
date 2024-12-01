import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const PluginTable = () => {
  const [plugins, setPlugins] = useState([]);
  const [installedPlugins, setInstalledPlugins] = useState([]);

  // Fetch plugins and installed plugins
  const fetchPlugins = () => {
    axios.get('http://localhost:5001/plugins').then((response) => {
      setPlugins(response.data);
    });
    axios.get('http://localhost:5001/installed-plugins').then((response) => {
      setInstalledPlugins(response.data.map((plugin) => plugin.folderName)); // Only folder names for easy lookup
    });
  };

  useEffect(() => {
    fetchPlugins();
  }, []);

  const isPluginInstalled = (folderName) => installedPlugins.includes(folderName);

  const handleInstall = async (folderName) => {
    try {
      await axios.post('http://localhost:5001/install', { folderName });
      fetchPlugins(); // Refresh list
    } catch (error) {
      console.error('Error installing plugin:', error);
    }
  };

  const handleUninstall = async (folderName) => {
    try {
      await axios.post('http://localhost:5001/uninstall', { folderName });
      fetchPlugins(); // Refresh list
    } catch (error) {
      console.error('Error uninstalling plugin:', error);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">Plugin Management</h2>
      <table className="table-auto w-full border-collapse">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="px-4 py-2 border">Name</th>
            <th className="px-4 py-2 border">Version</th>
            <th className="px-4 py-2 border">Author</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {plugins.map((plugin) => (
            <tr key={plugin.id} className="hover:bg-gray-100">
              <td className="px-4 py-2 border">{plugin.name}</td>
              <td className="px-4 py-2 border">{plugin.version}</td>
              <td className="px-4 py-2 border">{plugin.author}</td>
              <td className="px-4 py-2 border">
                {isPluginInstalled(plugin.folderName) ? (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleUninstall(plugin.folderName)}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                      Uninstall
                    </button>
                    <Link to={`/plugins/${plugin.folderName}`}>
                      <button className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
                        Details
                      </button>
                    </Link>
                    <Link to={`/settings/${plugin.folderName}`}>
                      <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                        Settings
                      </button>
                    </Link>
                  </div>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleInstall(plugin.folderName)}
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                      Install
                    </button>
                    <Link to={`/plugins/${plugin.folderName}`}>
                      <button className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
                        Details
                      </button>
                    </Link>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PluginTable;
