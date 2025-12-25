import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      
      <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl relative z-10 animate-in zoom-in-95 duration-200">
        <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mb-4 mx-auto">
          <AlertTriangle className="w-6 h-6 text-red-500" />
        </div>
        
        <h3 className="text-xl font-bold text-center text-gray-900 mb-2">{title}</h3>
        <p className="text-center text-gray-500 mb-8 leading-relaxed">
          {message}
        </p>
        
        <div className="flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors"
          >
            取消
          </button>
          <button 
            onClick={() => { onConfirm(); onClose(); }}
            className="flex-1 py-3 px-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl shadow-lg shadow-red-500/30 transition-all"
          >
            确认删除
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;