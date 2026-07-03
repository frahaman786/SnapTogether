import React from 'react';
import { BoothProvider, useBooth } from '../../context/BoothContext';
import PairingCard from './PairingCard';
import CameraViewport from './CameraViewport';
import ControlPanel from './ControlPanel';
import Filmstrip from './Filmstrip';
import ResultScreen from './ResultScreen';
import './PhotoBooth.css';

function BoothStage() {
  const { stage, capture } = useBooth();

  return (
    <div className={`rig ${stage === 'booth' ? 'show' : ''}`}>
      <div className="chassis">
        <div className="chassis-top">
          <span><span className="rec-dot" />LIVE</span>
          <span>{capture.statusText}</span>
        </div>
        <CameraViewport />
        <Filmstrip />
      </div>
      <ControlPanel />
    </div>
  );
}

export default function PhotoBooth() {
  return (
    <BoothProvider>
      <div className="twoup-booth">
        <PairingCard />
        <BoothStage />
        <ResultScreen />
      </div>
    </BoothProvider>
  );
}
