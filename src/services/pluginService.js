import axios from 'axios';

const BASE_URL = 'http://localhost:5001';

export const getPlugins = () => axios.get(`${BASE_URL}/plugins`);
export const getInstalledPlugins = () => axios.get(`${BASE_URL}/installed-plugins`);
export const installPlugin = (folderName) => axios.post(`${BASE_URL}/install`, { folderName });
export const uninstallPlugin = (folderName) => axios.post(`${BASE_URL}/uninstall`, { folderName });
export const updatePlugin = (folderName) => axios.post(`${BASE_URL}/update`, { folderName });
