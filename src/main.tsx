import ReactDOM from 'react-dom/client';

import App from '../src/app/App';
import './index.css';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <App />
);

// Remove Preload scripts loading
postMessage({ payload: 'removeLoading' }, '*');

// Use contextBridge
window.ipcRenderer?.on('main-process-message', (_event, message) => {
  console.log(message);
});
