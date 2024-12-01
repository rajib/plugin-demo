import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const AvailablePluginDetails = () => {
  const { folderName } = useParams(); // Extract folderName from route params
  const [availablePluginDetails, setAvailablePluginDetails] = useState(null); // Track plugin details
  const [loading, setLoading] = useState(true); // Track loading state
  const navigate = useNavigate();

  // Determine iframe source dynamically
  const iframeSrc = `http://localhost:5001/plugins/${folderName}/index`;

  // Fetch plugin details dynamically
  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:5001/plugins/${folderName}`)
      .then((response) => {
        setAvailablePluginDetails(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching plugin details:', error);
        setLoading(false);
      });
  }, [folderName]);

  const handleInstall = async () => {
    try {
      await axios.post('http://localhost:5001/install', { folderName });
      alert('Plugin installed successfully!');
    } catch (error) {
      console.error('Error installing plugin:', error);
    }
  };

  if (loading) {
    return <div className="text-center text-gray-500">Loading...</div>;
  }

  if (!availablePluginDetails) {
    return <div className="text-center text-red-500">Plugin not found</div>;
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">
        {availablePluginDetails.name || folderName} - {'Details'}
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
          onClick={handleInstall}
          className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 w-full sm:w-auto"
        >
          Install
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

export default AvailablePluginDetails;
