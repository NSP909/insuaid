import React from 'react';
import '../styles/splitscreen.css';

function SplitScreen({ left, right }) {
  return (
    <div className="split-screen">
      <div className="left-pane">{left}</div>
      <div className="right-pane">{right}</div>
    </div>
  );
}

export default SplitScreen;