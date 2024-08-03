import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import api from '../../api/api';

const ProductForm = () => {
  const navigate = useNavigate()
  const [productName, setProductName] = useState('');
  const [productImage, setProductImage] = useState(null); // Handle image upload if needed
  const [isFavourite, setIsFavourite] = useState(false);
  const [active, setActive] = useState(true);
  const [totalStock, setTotalStock] = useState(0);
  const [variants, setVariants] = useState([]);

  const handleAddVariant = () => {
    setVariants([...variants, { VariantName: '', subvariants: [] }]);
  };

  const handleVariantChange = (index, field, value) => {
    const updatedVariants = [...variants];
    updatedVariants[index][field] = value;
    setVariants(updatedVariants);
  };

  const handleSubVariantChange = (variantIndex, subIndex, field, value) => {
    const updatedVariants = [...variants];
    updatedVariants[variantIndex].subvariants[subIndex][field] = value;
    setVariants(updatedVariants);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = {
      ProductName: productName,
      ProductImage: productImage,
      IsFavourite: isFavourite,
      Active: active,
      TotalStock: totalStock,
      variants: variants
    };

    try {
      const response = await api.post('products/', data);
      navigate('/product-list')
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Product Name:</label>
        <input
          type="text"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          required
        />
      </div>
      {/* Handle image upload here if needed */}
      <div>
        <label>Total Stock:</label>
        <input
          type="number"
          value={totalStock}
          onChange={(e) => setTotalStock(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Is Favourite:</label>
        <input
          type="checkbox"
          checked={isFavourite}
          onChange={(e) => setIsFavourite(e.target.checked)}
        />
      </div>
      <div>
        <label>Active:</label>
        <input
          type="checkbox"
          checked={active}
          onChange={(e) => setActive(e.target.checked)}
        />
      </div>
      <div>
        <h3>Variants</h3>
        {variants.map((variant, variantIndex) => (
          <div key={variantIndex}>
            <input
              type="text"
              placeholder="Variant Name"
              value={variant.VariantName}
              onChange={(e) => handleVariantChange(variantIndex, 'VariantName', e.target.value)}
              required
            />
            <div>
              <h4>Subvariants</h4>
              {variant.subvariants.map((sub, subIndex) => (
                <div key={subIndex}>
                  <input
                    type="text"
                    placeholder="SubVariant Name"
                    value={sub.SubVariantName}
                    onChange={(e) => handleSubVariantChange(variantIndex, subIndex, 'SubVariantName', e.target.value)}
                    required
                  />
                  <input
                    type="number"
                    placeholder="Stock"
                    value={sub.Stock}
                    onChange={(e) => handleSubVariantChange(variantIndex, subIndex, 'Stock', e.target.value)}
                    required
                  />
                </div>
              ))}
              <button type="button" onClick={() => handleVariantChange(variantIndex, 'subvariants', [...variant.subvariants, { SubVariantName: '', Stock: 0 }])}>
                Add SubVariant
              </button>
            </div>
          </div>
        ))}
        <button type="button" onClick={handleAddVariant}>Add Variant</button>
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default ProductForm;
