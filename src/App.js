import React, { useState } from 'react';
import '@fortawesome/fontawesome-free/css/all.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ReservationNumberComponent from './components/ReservationNumberComponent';
import ReservationStatusPage from './components/ReservationStatusPage';
import AdminDashboard from './components/AdminDashboard';
import LoginForm from './components/LoginForm';
import './App.css';
import logo from './img/studio.png';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      <div className="App">
        <br></br>
        <div className="header">
          <img src={logo} alt="Studio Logo" className="logo" />
          <div class="nine">
            <h1>FOTOGRAFI<span>"Studio Houssem"</span></h1>
          </div>
        </div>

        <Routes>
          <Route
            path="/"
            element={
              <>
                <div className="content-wrapper">
                  <br />
                  <ReservationNumberComponent />
                  <br></br>
                  <ReservationStatusPage />
                </div>
                <footer className="text-center text-white rtl" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                  <div className="container p-2"> {/* Smaller padding for mobile */}
                    <section className="mb-2"> {/* Smaller margin for mobile */}
                      <div className="row">
                        <div className="col-md-4 col-lg-3 mx-auto mt-3"> {/* Reduced column size for mobile */}
                          <h6 className="text-uppercase mb-3 font-weight-bold">اسم الشركة</h6>
                          <p>
                            FOTOGRAFI "Studio Houssem"
                          </p>
                        </div>
                        <div className="col-md-3 col-lg-3 mx-auto mt-3"> {/* Reduced column size for mobile */}
                          <h6 className="text-uppercase mb-3 font-weight-bold">خدماتنا</h6>
                          <p className="text-white">تصوير الافراح والمناسبات</p>
                          <p className="text-white">الصور الرسمية</p>
                          <p className="text-white">صور وفيديوهات تسويقية</p>
                        </div>
                        <div className="col-md-5 col-lg-4 mx-auto mt-3"> {/* Reduced column size for mobile */}
                          <h6 className="text-uppercase mb-3 font-weight-bold">الاتصال</h6>
                          <p><i className="fas fa-phone mr-2"></i> <a href="tel:+21646387383" style={{ color: 'blue' }}>+216 46 387 383</a></p>
                          <p><i className="fas fa-home mr-2"></i> شارع حمادي الغربي، قليبية 8090، تونس</p>
                          <p><i className="fas fa-envelope mr-2"></i>studiohoussem10@gmail.com</p>
                        </div>
                        <div className="col-md-6 col-lg-2 mx-auto mt-3"> {/* Reduced column size for mobile */}
                          <h6 className="text-uppercase mb-3 font-weight-bold">تابعنا</h6>
                          <a className="btn btn-primary btn-floating m-1" style={{ backgroundColor: '#3b5998' }} href="https://www.facebook.com/fotografi.studio.houssem"><i className="fab fa-facebook-f fa-square"></i></a>
                          <a className="btn btn-primary btn-floating m-1" style={{ backgroundColor: '#ac2bac' }} href="https://www.instagram.com/studio_houssem_22097666/"><i className="fab fa-instagram fa-square"></i></a>
                          <a className="btn btn-primary btn-floating m-1" style={{ backgroundColor: '#25D366' }} href="https://api.whatsapp.com/send?phone=+21646387383"><i className="fab fa-whatsapp fa-square"></i></a>

                        </div>
                      </div>
                    </section>
                  </div>
                  <div className="p-2" style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}> {/* Smaller padding for mobile */}
                    © 2024 الحقوق محفوظة
                  </div>
                </footer>
              </>
            }
          />
          <Route path="/admin" element={!isAuthenticated ? <Navigate to="/login" /> : <AdminDashboard />} />
          <Route path="/login" element={<LoginForm setIsAuthenticated={setIsAuthenticated} />} />
        </Routes>

      </div>
    </Router>
  );
}

export default App;
