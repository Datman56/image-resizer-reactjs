import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import ImageResizer from "./components/ImageResizer";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ImageResizer />
  </React.StrictMode>
);
