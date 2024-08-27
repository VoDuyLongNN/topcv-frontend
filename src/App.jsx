import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './components/Register/Register';
import Login from './components/Login/Login';
import Personal from './components/Personal/Personal';
import Company from './components/Company/Company';
import Home from './components/Home/Home';
import ProtectedRoute from './components/ProtectedRoute';
import ViewPostPersonal from './components/ViewPostPersonal/ViewPostPersonal';

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/personal/*"
          element={
            <ProtectedRoute allowedRole="ROLE_PERSONAL">
              <Personal />
            </ProtectedRoute>
          }
        />
        <Route
          path="/company/*"
          element={
            <ProtectedRoute allowedRole="ROLE_COMPANY">
              <Company />
            </ProtectedRoute>
          }
        />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/personal" element={<Personal />} />
        <Route path="/*" element={<Home />} />
        <Route path="/post-personal/:id" element={<ViewPostPersonal />} />
      </Routes>
    </Router>
  );
}

export default App
