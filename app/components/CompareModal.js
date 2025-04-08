import React from 'react';
import { motion } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';

const CompareProductModal = ({ products, isOpen, onClose }) => {
  if (!isOpen) return null;

 
  const renderComparisonRow = (label, accessor) => (
    <tr className="border-b">
      <td className="p-3 font-semibold text-gray-700">{label}</td>
      {products.map(product => (
        <td key={product._id} className="p-3 text-center">
          {accessor(product)}
        </td>
      ))}
    </tr>
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-auto"
      >
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Product Comparison</h2>
          <button 
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900 transition"
          >
            <FaTimes size={24} />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-3 gap-4 mb-6">
            {products.map(product => (
              <div key={product._id} className="text-center">
                <img 
                  src={product.imgURL || "/iphone16.webp"} 
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h3 className="text-xl font-semibold">{product.name}</h3>
              </div>
            ))}
          </div>

          <table className="w-full border-collapse">
            <tbody>
              {renderComparisonRow("Price", p => `$${p.price.toFixed(2)}`)}
              {renderComparisonRow("Discounted Price", p => p.discountedPrice ? `$${p.discountedPrice.toFixed(2)}` : 'N/A')}
              {renderComparisonRow("Stock", p => p.stock)}
              {renderComparisonRow("Ratings", p => `${p.stars}/5 (${p.votes || 0} votes)`)}
              {renderComparisonRow("Discount", p => p.discountPercentage ? `${p.discountPercentage}%` : 'No Discount')}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CompareProductModal;