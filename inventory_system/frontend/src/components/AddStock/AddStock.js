import React, { useState } from 'react';
import axios from 'axios';

const AddStock = () => {
  const [productId, setProductId] = useState('');
  const [variantId, setVariantId] = useState('');
  const [quantity, setQuantity] = useState(0);

  const handleAddStock = () => {
    axios.post(`http://localhost:8000/products/${productId}/variants/${variantId}/add-stock/`, { quantity })
      .then(response => {
        alert('Stock added successfully!');
      })
      .catch(error => {
        console.error('There was an error adding the stock!', error);
      });
  };

  return (
    <div>
      <h2>Add Stock</h2>
      <input
        type="text"
        placeholder="Product ID"
        value={productId}
        onChange={e => setProductId(e.target.value)}
      />
      <input
        type="text"
        placeholder="Variant ID"
        value={variantId}
        onChange={e => setVariantId(e.target.value)}
      />
      <input
        type="number"
        placeholder="Quantity"
        value={quantity}
        onChange={e => setQuantity(Number(e.target.value))}
      />
      <button onClick={handleAddStock}>Add Stock</button>
    </div>
  );
};

export default AddStock;