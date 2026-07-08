import React from 'react';
import { X, Ruler } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SizeGuideModal({ isOpen, onClose }: SizeGuideModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl shadow-xl flex flex-col z-10"
          >
            <div className="flex shrink-0 items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Ruler className="text-teal-primary" size={24} />
                <h2 className="font-playfair text-2xl text-dark-text">Size Guide</h2>
              </div>
              <button 
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <p className="font-inter text-gray-600 mb-6 text-sm">
                Measurements are provided in inches. Please note that our garments are designed for a relaxed, streetwear fit. If you prefer a more tailored look, consider sizing down.
              </p>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-beige text-dark-text font-inter text-sm font-semibold">
                      <th className="p-4 border-b border-gray-200">Size</th>
                      <th className="p-4 border-b border-gray-200">Chest (Width)</th>
                      <th className="p-4 border-b border-gray-200">Body Length</th>
                      <th className="p-4 border-b border-gray-200">Sleeve Length</th>
                    </tr>
                  </thead>
                  <tbody className="font-inter text-sm text-gray-700">
                    <tr className="hover:bg-gray-50 transition-colors border-b border-gray-100">
                      <td className="p-4 font-semibold text-dark-text">Small (S)</td>
                      <td className="p-4">18"</td>
                      <td className="p-4">28"</td>
                      <td className="p-4">8.5"</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors border-b border-gray-100">
                      <td className="p-4 font-semibold text-dark-text">Medium (M)</td>
                      <td className="p-4">20"</td>
                      <td className="p-4">29"</td>
                      <td className="p-4">9"</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors border-b border-gray-100">
                      <td className="p-4 font-semibold text-dark-text">Large (L)</td>
                      <td className="p-4">22"</td>
                      <td className="p-4">30"</td>
                      <td className="p-4">9.5"</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors border-b border-gray-100">
                      <td className="p-4 font-semibold text-dark-text">X-Large (XL)</td>
                      <td className="p-4">24"</td>
                      <td className="p-4">31"</td>
                      <td className="p-4">10"</td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 font-semibold text-dark-text">2X-Large (2XL)</td>
                      <td className="p-4">26"</td>
                      <td className="p-4">32"</td>
                      <td className="p-4">10.5"</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div className="mt-8 bg-sky-blue/20 p-4 rounded-xl flex items-start gap-3">
                <div className="text-teal-primary text-xl">💡</div>
                <div>
                  <h4 className="font-inter font-semibold text-dark-teal text-sm mb-1">How to measure</h4>
                  <p className="font-inter text-xs text-gray-600">
                    <strong className="text-gray-800">Chest:</strong> Measure across the chest one inch below the armhole when laid flat.<br/>
                    <strong className="text-gray-800">Body Length:</strong> Measure from high point of shoulder from the back.<br/>
                    <strong className="text-gray-800">Sleeve:</strong> Start at center of neck and measure down shoulder, down sleeve to hem.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
