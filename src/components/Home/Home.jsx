import React from 'react';
import { Routes, Route, Router } from 'react-router-dom';
import Header from '../Header/Header';
import Job from '../Job/Job';
import Recruitment from '../Recruitment/Recruitment';
import Company from '../Companies/Company';
import Tool from '../Tool/Tool';
import Guide from '../Guide/Guide';
import './Home.css';

const Home = () => {
   return (
      <div>
         <Header />
         <div className="home-container">
            <Routes>
               <Route path="/" element={<Job />} />
               <Route path="/recruitment" element={<Recruitment />} />
               <Route path='/companies' element={<Company />} />
               <Route path='/tools' element={<Tool />} />
               <Route path='/career-guide' element={<Guide />} />
            </Routes>
         </div>
      </div>
   );
};

export default Home;
