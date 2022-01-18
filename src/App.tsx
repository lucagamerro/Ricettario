import React, { useState } from 'react';
import { BrowserRouter as Router } from "react-router-dom";
import Welcome from './components/landing/Welcome';
import Home from './components/app/Home';
import 'bootstrap/dist/css/bootstrap.css';
import './style/style.css';

//TODO metti i titoli in 404.html e crea  icona

function App() {
  const [log, setLog] = useState({logged: false, userId: null});

  return (
    <>
      <Router>
        {log.logged === true ? <Home userId={log.userId} setLog={setLog} /> : <Welcome setLog={setLog} />}
      </Router>
    </>
  );
}

export default App;
