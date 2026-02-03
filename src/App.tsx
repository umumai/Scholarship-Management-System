import React from 'react';
import { Routes, Route, useParams } from 'react-router-dom';
import PrototypeViewer from './components/PrototypeViewer'; // Prototype Viewer (LivePrototype)

const ReviewRoute: React.FC = () => {
  const { applicationId } = useParams();

  return (
    <PrototypeViewer reviewOnly reviewApplicationId={applicationId} />
  );
};

const MainShell: React.FC = () => {
  return <PrototypeViewer />;
};

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/review/:applicationId" element={<ReviewRoute />} />
      <Route path="/*" element={<MainShell />} />
    </Routes>
  );
};

export default App;
