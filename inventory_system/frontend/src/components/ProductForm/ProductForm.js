import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import api from '../../api/api';
import './ProductForm.css';

const ProductForm = () => {
  const navigate = useNavigate();
  const [productName, setProductName] = useState('');
  const [productImage, setProductImage] = useState(null);
  const [isFavourite, setIsFavourite] = useState(false);
  const [active, setActive] = useState(true);
  const [totalStock, setTotalStock] = useState(0);
  const [variants, setVariants] = useState([]);

  const handleAddVariant = () => {
    setVariants([...variants, { VariantName: '', options: [], subvariants: [] }]);
  };

  const handleVariantChange = (index, field, value) => {
    const updatedVariants = [...variants];
    updatedVariants[index][field] = value;
    setVariants(updatedVariants);
  };

  const handleAddOption = (variantIndex) => {
    const optionName = '';
    setVariants(prevVariants => {
      const updatedVariants = [...prevVariants];
      updatedVariants[variantIndex].options.push(optionName);
      return updatedVariants;
    });
  };

  const handleOptionChange = (variantIndex, optionIndex, value) => {
    const updatedVariants = [...variants];
    updatedVariants[variantIndex].options[optionIndex] = value;
    setVariants(updatedVariants);
  };

  const handleAddSubVariant = (variantIndex) => {
    setVariants(prevVariants => {
      const updatedVariants = [...prevVariants];
      updatedVariants[variantIndex].subvariants.push({ SubVariantName: '', options: [] });
      return updatedVariants;
    });
  };

  const handleSubVariantChange = (variantIndex, subIndex, field, value) => {
    const updatedVariants = [...variants];
    updatedVariants[variantIndex].subvariants[subIndex][field] = value;
    setVariants(updatedVariants);
  };

  const handleSubVariantOptionChange = (variantIndex, subIndex, optionIndex, value) => {
    const updatedVariants = [...variants];
    updatedVariants[variantIndex].subvariants[subIndex].options[optionIndex] = value;
    setVariants(updatedVariants);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    // Create a new FormData object
    const formData = new FormData();
    formData.append('ProductName', productName);
    formData.append('ProductImage', productImage); // Assuming productImage is a File object
    formData.append('IsFavourite', isFavourite);
    formData.append('Active', active);
    formData.append('TotalStock', totalStock);
    formData.append('variants', JSON.stringify(variants)); // Convert variants to JSON string
  
    try {
      await api.post('products/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data' // Important for file uploads
        }
      });
      navigate('/product-list');
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      <h2>Create a New Product</h2>
      <div className="form-group">
        <label>Product Name:</label>
        <input
          type="text"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          required
          className="form-control"
        />
      </div>
      <div className="form-group">
        <label>Product Image:</label>
        <input
          type="file"
          onChange={(e) => setProductImage(e.target.files[0])}
          className="form-control"
        />
      </div>
      <div className="form-group">
        <label>Total Stock:</label>
        <input
          type="number"
          value={totalStock}
          onChange={(e) => setTotalStock(e.target.value)}
          required
          className="form-control"
        />
      </div>
      <div className="form-group">
        <label>Is Favourite:</label>
        <input
          type="checkbox"
          checked={isFavourite}
          onChange={(e) => setIsFavourite(e.target.checked)}
          className="form-check"
        />
      </div>
      <div className="form-group">
        <label>Active:</label>
        <input
          type="checkbox"
          checked={active}
          onChange={(e) => setActive(e.target.checked)}
          className="form-check"
        />
      </div>
      <div className="form-group">
        <h3>Variants</h3>
        {variants.map((variant, variantIndex) => (
          <div key={variantIndex} className="variant-group">
            <input
              type="text"
              placeholder="Variant Name"
              value={variant.VariantName}
              onChange={(e) => handleVariantChange(variantIndex, 'VariantName', e.target.value)}
              required
              className="form-control"
            />
            <div>
              <h4>Options</h4>
              {variant.options.map((option, optionIndex) => (
                <div key={optionIndex} className="option-item">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(variantIndex, optionIndex, e.target.value)}
                    className="form-control"
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={() => handleAddOption(variantIndex)}
                className="btn"
              >
                Add Option
              </button>
            </div>
            <div className="subvariant-group">
              <h4>Subvariants</h4>
              {variant.subvariants.map((sub, subIndex) => (
                <div key={subIndex} className="subvariant-item">
                  <input
                    type="text"
                    placeholder="SubVariant Name"
                    value={sub.SubVariantName}
                    onChange={(e) => handleSubVariantChange(variantIndex, subIndex, 'SubVariantName', e.target.value)}
                    required
                    className="form-control"
                  />
                  
                  <div>
                    <h5>Options</h5>
                    {sub.options.map((option, optionIndex) => (
                      <div key={optionIndex} className="option-item">
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => handleSubVariantOptionChange(variantIndex, subIndex, optionIndex, e.target.value)}
                          className="form-control"
                        />
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        const newOption = '';
                        const updatedVariants = [...variants];
                        updatedVariants[variantIndex].subvariants[subIndex].options.push(newOption);
                        setVariants(updatedVariants);
                      }}
                      className="btn"
                    >
                      Add Option
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => handleAddSubVariant(variantIndex)}
                className="btn"
              >
                Add SubVariant
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddVariant}
          className="btn"
        >
          Add Variant
        </button>
      </div>
      <button type="submit" className="btn submit-btn">Submit</button>
    </form>
  );
};

export default ProductForm;
