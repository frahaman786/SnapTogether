import React from 'react';
import { useBooth } from '../../context/BoothContext';
import { FILTERS } from '../../utils/filters';
import { LAYOUTS, FRAME_COLORS } from '../../utils/constants';
import './ControlPanel.css';

function LayoutIcon({ id }) {
  return (
    <svg className="layout-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      {id === 'strip' && (
        <>
          <rect x="4" y="2" width="16" height="4" />
          <rect x="4" y="8" width="16" height="4" />
          <rect x="4" y="14" width="16" height="4" />
        </>
      )}
      {id === 'grid' && (
        <>
          <rect x="3" y="3" width="8" height="8" />
          <rect x="13" y="3" width="8" height="8" />
          <rect x="3" y="13" width="8" height="8" />
          <rect x="13" y="13" width="8" height="8" />
        </>
      )}
      {id === 'single' && <rect x="4" y="4" width="16" height="16" />}
    </svg>
  );
}

export default function ControlPanel() {
  const { isGuest, capture } = useBooth();
  const { filter, layout, frameColor, caption, pickFilter, pickLayout, pickColor, updateCaption } = capture;

  return (
    <div className={`panel ${isGuest ? 'disabled' : ''}`}>
      <div className="field">
        <h3>Filter</h3>
        <div className="swatches">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              className={`swatch-btn ${filter === f.id ? 'active' : ''}`}
              onClick={() => pickFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="field">
        <h3>Frame layout</h3>
        <div className="layout-grid">
          {LAYOUTS.map((l) => (
            <button
              key={l.id}
              className={`layout-btn ${layout === l.id ? 'active' : ''}`}
              onClick={() => pickLayout(l)}
            >
              <LayoutIcon id={l.id} />
              {l.label}
            </button>
          ))}
        </div>
      </div>

      <div className="field">
        <h3>Frame color</h3>
        <div className="border-swatches">
          {FRAME_COLORS.map((c) => (
            <span
              key={c}
              className={`color-dot ${frameColor === c ? 'active' : ''}`}
              style={{ background: c }}
              onClick={() => pickColor(c)}
            />
          ))}
        </div>
      </div>

      <div className="field">
        <h3>Caption</h3>
        <input
          type="text"
          placeholder="e.g. Me & You"
          maxLength={28}
          value={caption}
          onChange={(e) => updateCaption(e.target.value)}
        />
        <div className="hint">Printed at the bottom of your frame, along with today's date.</div>
      </div>

      {isGuest && (
        <div className="panel-note">
          Your partner controls filters &amp; frame from their screen. You can still hit the shutter to start a session.
        </div>
      )}
    </div>
  );
}
