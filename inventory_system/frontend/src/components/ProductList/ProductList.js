import React, { useState, useEffect } from 'react';
import api from '../../api/api'; 
import './ProductList.css'; 

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null); 

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

  return (
    <div className="product-list">
      <h2>Product List</h2>
      {error && <p className="error">Error fetching products: {error.message}</p>} 
      <ul>
        {products.map(product => (
          <li key={product.id} className="product-item">
            <h3>{product.ProductName} - {product.ProductCode}</h3>
            {product.ProductImage && <img src={product.ProductImage} alt={product.ProductName} className="product-image" />}
            <p><strong>Created Date:</strong> {new Date(product.CreatedDate).toLocaleDateString()}</p>
            <p><strong>Active:</strong> {product.Active ? 'Yes' : 'No'}</p>
            <p><strong>Total Stock:</strong> {product.TotalStock}</p>
            {product.variants && product.variants.length > 0 && (
              <div className="variants">
                <h4>Variants:</h4>
                <ul>
                  {product.variants.map(variant => (
                    <li key={variant.id} className="variant-item">
                      <h5>{variant.VariantName}</h5>
                      {variant.subvariants && variant.subvariants.length > 0 && (
                        <ul className="subvariants">
                          {variant.subvariants.map(subvariant => (
                            <li key={subvariant.id} className="subvariant-item">
                              <p>{subvariant.SubVariantName} - Stock: {subvariant.Stock}</p>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductList;