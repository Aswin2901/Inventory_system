import React from 'react';
import './App.css';

import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import ProductForm from './components/ProductForm/ProductForm';
import ProductList from './components/ProductList/ProductList';
import AddStock from './components/AddStock/AddStock';
import RemoveStock from './components/RemoveStock/RemoveStock';
import LoginPage from './components/LoginPage/LoginPage';

function App() {
  return (
    <Router>
      <div className="App">
        <h1>Product Management</h1>
        <nav>
          <ul>
            <li>
              <Link to="/add-product">Add Product</Link>
            </li>
            <li>
              <Link to="/product-list">Product List</Link>
            </li>
            <li>
              <Link to="/add-stock">Add Stock</Link>
            </li>
            <li>
              <Link to="/remove-stock">Remove Stock</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/add-product" element={<ProductForm />} />
          <Route path="/product-list" element={<ProductList />} />
          <Route path="/add-stock" element={<AddStock />} />
          <Route path="/remove-stock" element={<RemoveStock />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
