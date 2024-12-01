const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs-extra');
const path = require('path');

const app = express();
app.use(cors());
// app.use(cors({
//   origin: 'http://localhost:3000', // Replace with your frontend URL
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
// }));

app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  next();
});

const PLUGINS_PATH = path.join(__dirname, 'plugins');
const INSTALLED_PATH = path.join(__dirname, 'installed-plugins');

// Create the plugins folder if it doesn't exist
if (!fs.existsSync(PLUGINS_PATH)) {
  fs.mkdirSync(PLUGINS_PATH);
}

app.get('/', (req, res) => {
  res.json({ message: 'Hello World!' });
});

// List plugins
app.get('/plugins', (req, res) => {
  const plugins = fs.readdirSync(PLUGINS_PATH).map(folder => {
    const pluginPath = path.join(PLUGINS_PATH, folder);
    const pluginJsonPath = path.join(pluginPath, 'plugin.json');
    if (fs.existsSync(pluginJsonPath)) {
      const pluginDetails = JSON.parse(fs.readFileSync(pluginJsonPath));
      return { ...pluginDetails, folderName: folder };
    }
    return null;
  }).filter(Boolean);
  res.json(plugins);
});

// Get plugin details
app.get('/plugins/:folderName', (req, res) => {
  const { folderName } = req.params;
  const pluginPath = path.join(PLUGINS_PATH, folderName);
  const pluginJsonPath = path.join(pluginPath, 'plugin.json');
  if (fs.existsSync(pluginJsonPath)) {
    const pluginDetails = JSON.parse(fs.readFileSync(pluginJsonPath));
    pluginDetails.isInstalled = true;
    res.json(pluginDetails);
  } else {
    res.status(404).send('Plugin not found');
  }
});

// Install plugin
app.post('/install', (req, res) => {
  const { folderName } = req.body;
  const source = path.join(PLUGINS_PATH, folderName);
  const destination = path.join(INSTALLED_PATH, folderName);

  fs.copySync(source, destination);
  res.json({ message: 'Plugin installed successfully!' });
});

// List installed plugins
app.get('/installed-plugins', (req, res) => {
  const installedPlugins = fs.readdirSync(INSTALLED_PATH).map(folder => {
    const pluginJsonPath = path.join(INSTALLED_PATH, folder, 'plugin.json');
    if (fs.existsSync(pluginJsonPath)) {
      const pluginDetails = JSON.parse(fs.readFileSync(pluginJsonPath));
      return { ...pluginDetails, folderName: folder };
    }
    return null;
  }).filter(Boolean);
  res.json(installedPlugins);
});

// Get installed plugin details
app.get('/installed-plugins/:folderName', (req, res) => {
  const { folderName } = req.params;
  const pluginPath = path.join(INSTALLED_PATH, folderName);
  const pluginJsonPath = path.join(pluginPath, 'plugin.json');
  if (fs.existsSync(pluginJsonPath)) {
    const pluginDetails = JSON.parse(fs.readFileSync(pluginJsonPath));
    pluginDetails.isInstalled = true;
    res.json(pluginDetails);
  } else {
    res.status(404).send('Plugin not found');
  }
});

// Uninstall plugin
app.post('/uninstall', (req, res) => {
  const { folderName } = req.body;
  const pluginPath = path.join(INSTALLED_PATH, folderName);

  fs.removeSync(pluginPath);
  res.json({ message: 'Plugin uninstalled successfully!' });
});

// Update plugin
app.post('/update', (req, res) => {
  const { folderName } = req.body;
  const source = path.join(PLUGINS_PATH, folderName);
  const destination = path.join(INSTALLED_PATH, folderName);

  fs.copySync(source, destination, { overwrite: true });
  res.json({ message: 'Plugin updated successfully!' });
});

// Serve plugin index.html
app.get('/plugins/:folderName/index', (req, res) => {
  const { folderName } = req.params;
  const filePath = path.join(PLUGINS_PATH, folderName, 'index.html');
  console.log(filePath);
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).send('Index file not found');
  }
});

app.get('/installed-plugins/:folderName/index', (req, res) => {
  const { folderName } = req.params;
  const filePath = path.join(INSTALLED_PATH, folderName, 'index.html');
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).send('Index file not found in installed-plugins');
  }
});



app.listen(5001, () => console.log('Server running on http://localhost:5001'));
