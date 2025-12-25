import React from 'react';
import { X, Copy, Wand2, Loader2 } from 'lucide-react';

interface AIWishModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: string;
  isLoading: boolean;
  targetName: string;
}

const AIWishModal: React.FC<AIWishModalProps> = ({ isOpen, onClose, content, isLoading, targetName }) => {
  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    alert('祝福语已复制到剪贴板！');
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-gradient-to-br from-purple-50 to-white rounded-2xl w-full max-w-sm shadow-2xl p-6 relative border border-purple-100">
        <button onClick={onClose} className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-200/50">
          <X className="w-5 h-5 text-gray-500" />
        </button>

        <div className="flex flex-col items-center mb-4">
          <div className="p-3 bg-purple-100 rounded-full mb-3">
            <Wand2 className="w-8 h-8 text-purple-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-800">给 {targetName} 的祝福</h3>
        </div>

        <div className="min-h-[120px] bg-white rounded-xl p-4 border border-purple-100 shadow-inner mb-4 flex items-center justify-center text-center">
          {isLoading ? (
            <div className="flex flex-col items-center gap-2 text-purple-600">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="text-sm">Gemini 正在构思中...</span>
            </div>
          ) : (
            <p className="text-gray-700 leading-relaxed font-medium">
              {content}
            </p>
          )}
        </div>

        {!isLoading && (
          <button 
            onClick={handleCopy}
            className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium shadow-lg shadow-purple-600/30 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Copy className="w-4 h-4" />
            复制文本
          </button>
        )}
      </div>
    </div>
  );
};

export default AIWishModal;