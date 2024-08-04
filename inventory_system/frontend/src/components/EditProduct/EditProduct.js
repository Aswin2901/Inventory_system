import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/api';
import './EditProduct.css'; // Import the CSS file

const EditProduct = () => {
  const { id } = useParams(); // Get product id from URL
  const [productData, setProductData] = useState({});
  const [error, setError] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate
  const [editImage, setEditImage] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`products/${id}/`);
        setProductData(response.data);
      } catch (error) {
        console.error('There was an error fetching the product!', error);
        setError(error);
      }
    };

    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('ProductName', productData.ProductName);
    formData.append('ProductCode', productData.ProductCode);
    if (imageFile) {
      formData.append('ProductImage', imageFile); 
    }
    formData.append('CreatedDate', productData.CreatedDate);
    formData.append('Active', productData.Active);
    formData.append('TotalStock', productData.TotalStock);
  
    try {
      await api.put(`products/${id}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Set content type to multipart
        },
      });
      navigate('/product-list'); // Navigate back to the product list after saving
    } catch (error) {
      console.error('There was an error updating the product!', error.response?.data || error.message);
      setError(error);
    }
  };

  const handleCancel = () => {
    navigate('/product-list'); 
  };

  const handleEditImage = () => {
    setEditImage(true);
    setImageFile(null);
    setProductData(prevData => ({ ...prevData, ProductImage: null }));
  };

  return (
    <div className="edit-product">
      <h2>Edit Product</h2>
      {error && <p className="error">Error: {error.message}</p>}
      <div className="product-image">
        {productData.ProductImage && !editImage && (
          <div>
            <img src={`${process.env.REACT_APP_API_URL}${productData.ProductImage}`} alt={productData.ProductName} className="product-image-preview"/>
            <button type="button" onClick={handleEditImage} className="edit-image-button">Edit Image</button>
          </div>
        )}
        {!productData.ProductImage && !editImage && (
          <input type="file" name="ProductImage" onChange={handleImageChange} />
        )}
        {editImage && (
          <input type="file" name="ProductImage" onChange={handleImageChange} />
        )}
      </div>
      <form onSubmit={handleSubmit}>
        <label>
          Product Name:
          <input type="text" name="ProductName" value={productData.ProductName || ''} onChange={handleChange} required />
        </label>
        <label>
          Product Code:
          <input type="text" name="ProductCode" value={productData.ProductCode || ''} onChange={handleChange} required />
        </label>
        <label>
          Created Date:
          <input type="date" name="CreatedDate" value={productData.CreatedDate?.split('T')[0] || ''} onChange={handleChange} />
        </label>
        <label>
          Active:
          <input type="checkbox" name="Active" checked={productData.Active || false} onChange={(e) => handleChange({ target: { name: 'Active', value: e.target.checked } })} />
        </label>
        <label>
          Total Stock:
          <input type="number" name="TotalStock" value={productData.TotalStock || 0} onChange={handleChange} />
        </label>
        <button type="submit" className="save-button">Save</button>
        <button type="button" className="cancel-button" onClick={handleCancel}>Cancel</button>
      </form>
    </div>
  );
};

export default EditProduct;
