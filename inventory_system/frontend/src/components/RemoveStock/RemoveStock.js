import React, { useState } from 'react';
import axios from 'axios';

const RemoveStock = () => {
  const [productId, setProductId] = useState('');
  const [variantId, setVariantId] = useState('');
  const [quantity, setQuantity] = useState(0);

  const handleRemoveStock = () => {
    axios.post(`http://localhost:8000/products/${productId}/variants/${variantId}/remove-stock/`, { quantity })
      .then(response => {
        alert('Stock removed successfully!');
      })
      .catch(error => {
        console.error('There was an error removing the stock!', error);
      });
  };

  return (
    <div>
      <h2>Remove Stock</h2>
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
      <button onClick={handleRemoveStock}>Remove Stock</button>
    </div>
  );
};

export default RemoveStock;
