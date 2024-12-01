import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const PluginDetails = () => {
  const { folderName } = useParams(); // Extract folderName from route params
  const [pluginDetails, setPluginDetails] = useState(null); // Track plugin details
  const [loading, setLoading] = useState(true); // Track loading state

  // Determine iframe source dynamically
  const iframeSrc = `http://localhost:5001/installed-plugins/${folderName}/index`;

  // Fetch plugin details dynamically
  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:5001/plugins/${folderName}`)
      .then(response => {
        setPluginDetails(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching plugin details:', error);
        setLoading(false);
      });
  }, [folderName]);

  const handleUninstall = async () => {
    try {
      await axios.post('http://localhost:5001/uninstall', { folderName });
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
    return <div>Loading...</div>;
  }

  if (!pluginDetails) {
    return <div>Plugin not found</div>;
  }

  return (
    <div>
      <h1>
        {pluginDetails.name || folderName} - {'Settings'}
      </h1>
      <iframe src={iframeSrc} width="100%" height="500" title="Plugin Details"></iframe>
      <div style={{ marginTop: '20px' }}>
        <button onClick={handleUninstall}>Uninstall</button>
        <button onClick={handleUpdate}>Update</button>
      </div>
    </div>
  );
};

export default PluginDetails;
