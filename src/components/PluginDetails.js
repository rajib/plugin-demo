import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const PluginDetails = () => {
  const { folderName } = useParams(); // Extract folderName from route params
  const [pluginDetails, setPluginDetails] = useState(null); // Track plugin details
  const [loading, setLoading] = useState(true); // Track loading state
  const navigate = useNavigate();

  // Determine iframe source dynamically
  const iframeSrc = `http://localhost:5001/installed-plugins/${folderName}/index`;

  // Fetch plugin details dynamically
  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:5001/plugins/${folderName}`)
      .then((response) => {
        setPluginDetails(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching plugin details:', error);
        setLoading(false);
      });
  }, [folderName]);

  const handleUninstall = async () => {
    try {
      await axios.post('http://localhost:5001/uninstall', { folderName });
      alert('Plugin uninstalled successfully!');
    } catch (error) {
      console.error('Error uninstalling plugin:', error);
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.post('http://localhost:5001/update', { folderName });
      alert('Plugin updated successfully!');
    } catch (error) {
      console.error('Error updating plugin:', error);
    }
  };

  if (loading) {
    return <div className="text-center text-gray-500">Loading...</div>;
  }

  if (!pluginDetails) {
    return <div className="text-center text-red-500">Plugin not found</div>;
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">
        {pluginDetails.name || folderName} - {'Settings'}
      </h1>
      <iframe
        src={iframeSrc}
        width="100%"
        height="500"
        title="Plugin Details"
        className="border rounded-lg"
      ></iframe>
      <div className="mt-6 space-y-4 space-x-4">
        <button
          onClick={handleUninstall}
          className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 w-full sm:w-auto"
        >
          Uninstall
        </button>
        <button
          onClick={handleUpdate}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 w-full sm:w-auto"
        >
          Update
        </button>
        <button
          onClick={() => navigate('/')}
          className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 w-full sm:w-auto"
        >
          Back to Plugins
        </button>
      </div>
    </div>
  );
};

export default PluginDetails;
