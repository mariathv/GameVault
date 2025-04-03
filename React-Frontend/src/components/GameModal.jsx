import React from 'react';
import { formatDate } from '../utils/helpers'; // Create or adjust as needed

const GameModal = ({ game, orderId, purchaseDate, purchaseAmount, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50" 
        onClick={onClose}
      ></div>
      
      {/* Modal Content */}
      <div className="bg-white rounded-lg shadow-xl z-10 w-full max-w-2xl mx-4 overflow-hidden">
        <div className="flex justify-between items-start p-4 border-b">
          <h2 className="text-xl font-semibold">{game.title}</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/3 flex-shrink-0 mb-4 md:mb-0">
              <img 
                src={game.cover_url} 
                alt={game.title} 
                className="w-full rounded-lg shadow" 
              />
            </div>
            
            <div className="md:w-2/3 md:pl-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Purchase Details</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-gray-600">Order ID:</div>
                  <div>{orderId?.slice(-8) || 'N/A'}</div>
                  
                  <div className="text-gray-600">Purchase Date:</div>
                  <div>{formatDate(purchaseDate)}</div>
                  
                  <div className="text-gray-600">Price:</div>
                  <div>${purchaseAmount?.toFixed(2) || 'N/A'}</div>
                  
                  {game.quantity > 1 && (
                    <>
                      <div className="text-gray-600">Quantity:</div>
                      <div>{game.quantity}</div>
                    </>
                  )}
                  
                  {game.genre && (
                    <>
                      <div className="text-gray-600">Genre:</div>
                      <div>{Array.isArray(game.genre) ? game.genre.join(', ') : game.genre}</div>
                    </>
                  )}
                  
                  {game.releaseDate && (
                    <>
                      <div className="text-gray-600">Release Date:</div>
                      <div>{formatDate(game.releaseDate)}</div>
                    </>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Game Keys</h3>
                <div className="bg-gray-50 p-3 rounded-lg">
                  {game.gameKeys && game.gameKeys.length > 0 ? (
                    <ul className="space-y-2">
                      {game.gameKeys.map((key, index) => (
                        <li key={index} className="font-mono bg-white border rounded p-2 flex justify-between items-center">
                          <span>{key}</span>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(key);
                              // Using a more modern approach than alert
                              // You could replace this with a toast notification system if available
                              const notification = document.createElement('div');
                              notification.className = 'fixed bottom-4 right-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-md';
                              notification.innerText = 'Game key copied to clipboard!';
                              document.body.appendChild(notification);
                              setTimeout(() => {
                                notification.remove();
                              }, 3000);
                            }}
                            className="text-sm text-blue-500 hover:text-blue-700"
                          >
                            Copy
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 text-center py-2">No game keys available</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameModal;