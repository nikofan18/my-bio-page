import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Handle GitHub Pages deep-link redirect param (?p=/photos)
function applyDeepLink() {
  const params = new URLSearchParams(window.location.search);
  const p = params.get('p');
  if (p) {
    // Replace history without reloading
    const q = params.get('q');
    const hash = window.location.hash || '';
    const target = p + (q ? ('?' + decodeURIComponent(q)) : '') + hash;
    window.history.replaceState(null, '', target);
  }
}
applyDeepLink();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
