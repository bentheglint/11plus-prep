import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import DevReviewPanel from './DevReviewPanel';
import DiagramViewer from './DiagramViewer';
import reportWebVitals from './reportWebVitals';

const isDiagramViewer = new URLSearchParams(window.location.search).has('diagram-viewer');

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {isDiagramViewer ? (
      <DiagramViewer />
    ) : (
      <>
        <App />
        <DevReviewPanel />
      </>
    )}
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
