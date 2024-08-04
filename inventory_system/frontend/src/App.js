import React, { useEffect } from 'react';
import './App.css';
import { Route, Routes, Link, useLocation, useNavigate } from 'react-router-dom';
import ProductForm from './components/ProductForm/ProductForm';
import ProductList from './components/ProductList/ProductList';
import LoginPage from './components/LoginPage/LoginPage';
import { useAuth } from './AuthContext'; 
import EditProduct from './components/EditProduct/EditProduct';
import PrivateRoute from './PrivateRoute'; // Import the PrivateRoute component

function App() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && location.pathname === '/') {
      navigate('/product-list', { replace: true });
    }
  }, [isAuthenticated, location.pathname, navigate]);

  return (
    <div className="App">
      {location.pathname !== '/' && isAuthenticated && (
        <>
          <h1>Product Management</h1>
          <nav>
            <ul>
              <li>
                <Link to="/add-product">Add Product</Link>
              </li>
              <li>
                <Link to="/product-list">Product List</Link>
              </li>
            </ul>
          </nav>
        </>
      )}
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/edit-product/:id" element={<PrivateRoute element={<EditProduct />} />} />
        <Route path="/add-product" element={<PrivateRoute element={<ProductForm />} />} />
        <Route path="/product-list" element={<PrivateRoute element={<ProductList />} />} />
      </Routes>
    </div>
  );
}

export default App;
