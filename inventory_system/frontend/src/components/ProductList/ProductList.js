import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';
import './ProductList.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('products/');
        setProducts(response.data);
      } catch (error) {
        console.error('There was an error fetching the products!', error);
        setError(error);
      }
    };

    fetchProducts();
  }, []);

  const handleEdit = (productId) => {
    navigate(`/edit-product/${productId}`);
  };

  const handleDelete = async (productId) => {
    try {
      await api.delete(`products/${productId}/`);
      setProducts(products.filter(product => product.id !== productId));
    } catch (error) {
      console.error('There was an error deleting the product!', error);
      setError(error);
    }
  };

  return (
    <div className="product-list">
      <h2>Product List</h2>
      {error && <p className="error">Error fetching products: {error.message}</p>}
      <div className="product-grid">
        {products.map(product => (
          <div key={product.id} className="product-card">
            {product.ProductImage && (
              <img
                src={`${process.env.REACT_APP_API_URL}${product.ProductImage}`}
                alt={product.ProductName}
                className="product-image"
              />
            )}
            <div className="product-info">
              <h3 className="product-name">{product.ProductName}</h3>
              <p className="product-code">Code: {product.ProductCode}</p>
              <p className="product-date"><strong>Created Date:</strong> {new Date(product.CreatedDate).toLocaleDateString()}</p>
              <p className="product-active"><strong>Active:</strong> {product.Active ? 'Yes' : 'No'}</p>
              <p className="product-stock"><strong>Total Stock:</strong> {product.TotalStock}</p>
              
              {product.variants && product.variants.length > 0 && (
                <div className="product-variants">
                  <h4>Variants:</h4>
                  {product.variants.map(variant => (
                    <div key={variant.id} className="variant-item">
                      <h5>{variant.VariantName}</h5>
                      <div className="variant-options">
                        <h6>Options:</h6>
                        <ul>
                          {variant.options && variant.options.length > 0 ? (
                            variant.options.map((option, index) => (
                              <li key={index} className="option-item">{option}</li>
                            ))
                          ) : (
                            <p>No options available</p>
                          )}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {product.variants && product.variants.some(v => v.subvariants && v.subvariants.length > 0) && (
                <div className="product-subvariants">
                  <h4>Subvariants:</h4>
                  {product.variants.map(variant =>
                    variant.subvariants && variant.subvariants.length > 0 && (
                      <div key={variant.id} className="subvariant-item">
                        {variant.subvariants.map(subvariant => (
                          <div key={subvariant.id}>
                            <h5>{subvariant.SubVariantName} - Stock: {subvariant.Stock}</h5>
                            <div className="subvariant-options">
                              <h6>Options:</h6>
                              <ul>
                                {subvariant.options && subvariant.options.length > 0 ? (
                                  subvariant.options.map((option, index) => (
                                    <li key={index} className="option-item">{option}</li>
                                  ))
                                ) : (
                                  <p>No options available</p>
                                )}
                              </ul>
                            </div>
                          </div>
                        ))}
                      </div>
                    )
                  )}
                </div>
              )}
              <button onClick={() => handleEdit(product.id)} className="btn btn-edit">Edit</button>
              <button onClick={() => handleDelete(product.id)} className="btn btn-delete">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
