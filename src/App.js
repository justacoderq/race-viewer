import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import { Header, ResultsSelector } from './components';
import { 
  LandingPage2025, 
  ARViewer, 
  RaceResultsPage, 
  RacePage, 
  DriverStandings, 
  ConstructorStandings, 
} from './pages'; 
import { usePageTracking, useScrollTracking } from './utils/gaTracking';
import { ScrollToTop } from './utils/ScrollToTop';

import './App.scss';

function App() {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [resultPage, setResultPage] = useState('');
  const [resultPagePath, setResultPagePath] = useState('');

  return (
    <div className="app-container flex flex-col min-h-screen">
      <Router>
        <ScrollToTop />
        <Header 
          setResultPage={setResultPage} 
          setResultPagePath={setResultPagePath} 
        />
        <MainContent
          setSelectedYear={setSelectedYear}
          selectedYear={selectedYear}
          resultPage={resultPage}
          resultPagePath={resultPagePath}
          setResultPagePath={setResultPagePath} 
        />
      </Router>
    </div>
  );
}

function MainContent({ setSelectedYear, selectedYear, resultPage, resultPagePath, setResultPagePath }) {
  const location = useLocation().pathname;
  const validPaths = ['/race-results', '/constructor-standings', '/driver-standings'];

  useEffect(() => {
    // Always clean up first
    document.body.classList.remove('bg-gradient');

    // Apply default background for all pages
    document.body.classList.add('bg-gradient');

    return () => {
      document.body.classList.remove('bg-gradient');
    };
  }, [location]);

  usePageTracking();
  useScrollTracking();

  return (
    <div className="h-full grow">
      {validPaths.includes(location) && (
        <ResultsSelector 
          className="mt-[12.4rem] relative z-[100]" 
          setSelectedYear={setSelectedYear} 
          selectedYear={selectedYear} 
          resultPage={resultPage} 
          resultPagePath={resultPagePath}
        />
      )}

      <Routes>
        <Route exact path="/" element={<LandingPage2025 setResultPagePath={setResultPagePath} />} />
        <Route path="/race-results" element={<RaceResultsPage selectedYear={selectedYear} />} />
        <Route path="/constructor-standings" element={<ConstructorStandings selectedYear={selectedYear} />} />
        <Route path="/driver-standings" element={<DriverStandings selectedYear={selectedYear} />} />
        <Route path="/race/:raceId" element={<RacePage />} />
        <Route path="/ar-viewer" element={<ARViewer />} />
      </Routes>
    </div>
  );
}

export default App;
