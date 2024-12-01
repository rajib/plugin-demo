import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const AvailablePluginDetails = () => {
  const { folderName } = useParams(); // Extract folderName from route params
  const [AvailablePluginDetails, setAvailablePluginDetails] = useState(null); // Track plugin details
  const [isInstalled, setIsInstalled] = useState(false); // Track if plugin is installed
  const [loading, setLoading] = useState(true); // Track loading state

  // Determine iframe source dynamically
  const iframeSrc = isInstalled
    ? `http://localhost:5001/installed-plugins/${folderName}/index`
    : `http://localhost:5001/plugins/${folderName}/index`;

  // Fetch plugin details dynamically
  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:5001/plugins/${folderName}`)
      .then(response => {
        setAvailablePluginDetails(response.data);
        setIsInstalled(response.data.isInstalled || false);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching plugin details:', error);
        setLoading(false);
      });
  }, [folderName]);

  const handleInstall = async () => {
    try {
      await axios.post('http://localhost:5001/install', { folderName });
      setIsInstalled(true);
    } catch (error) {
      console.error('Error installing plugin:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!AvailablePluginDetails) {
    return <div>Plugin not found</div>;
  }

  return (
    <div>
      <h1>
        {AvailablePluginDetails.name}
      </h1>
      <iframe src={iframeSrc} width="100%" height="500" title="Plugin Details"></iframe>
      <div style={{ marginTop: '20px' }}>
        <button onClick={handleInstall}>Install</button>
      </div>
    </div>
  );
};

export default AvailablePluginDetails;
