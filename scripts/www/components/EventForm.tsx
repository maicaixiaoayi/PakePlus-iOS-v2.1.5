import React, { useState, useEffect } from 'react';
import { EventItem, EventType } from '../types';
import { X, Save, Cake, CalendarHeart, PenLine } from 'lucide-react';

interface EventFormProps {
  initialData?: EventItem;
  onSave: (data: Omit<EventItem, 'id'>) => void;
  onClose: () => void;
  isOpen: boolean;
}

const EventForm: React.FC<EventFormProps> = ({ initialData, onSave, onClose, isOpen }) => {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [type, setType] = useState<EventType>(EventType.BIRTHDAY);
  const [notes, setNotes] = useState('');
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setName(initialData.name);
        setDate(initialData.date);
        setType(initialData.type);
        setNotes(initialData.notes || '');
      } else {
        setName('');
        setDate(new Date().toISOString().split('T')[0]);
        setType(EventType.BIRTHDAY);
        setNotes('');
      }
      setIsClosing(false);
    }
  }, [initialData, isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 200); // Match animation duration
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !date) return;
    onSave({ name, date, type, notes });
    handleClose();
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`}>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      ></div>

      {/* Modal Content */}
      <div className={`bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden relative z-10 transform transition-all duration-300 ${isClosing ? 'scale-95 translate-y-4' : 'scale-100 translate-y-0'} animate-in fade-in zoom-in-95`}>
        
        {/* Decorative Header */}
        <div className="bg-gradient-to-br from-primary via-orange-400 to-orange-300 p-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-xl"></div>
          <div className="relative z-10 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold font-serif tracking-wide">
                {initialData ? '编辑时光' : '记录美好'}
              </h2>
              <p className="text-orange-50 text-xs mt-1 opacity-90">珍藏每一个重要的日子</p>
            </div>
            <button 
              onClick={handleClose} 
              className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors backdrop-blur-md"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Name Input */}
          <div className="group">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">标题 / 姓名</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例如：妈妈生日"
              className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-gray-800 placeholder-gray-400 focus:bg-white focus:border-primary/30 focus:ring-4 focus:ring-primary/10 outline-none transition-all duration-200"
            />
          </div>

          {/* Date & Type Row */}
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">选择日期</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-gray-800 focus:bg-white focus:border-primary/30 focus:ring-4 focus:ring-primary/10 outline-none transition-all duration-200"
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">事件类型</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: EventType.BIRTHDAY, label: '生日', icon: <Cake className="w-4 h-4"/> },
                  { value: EventType.ANNIVERSARY, label: '纪念日', icon: <CalendarHeart className="w-4 h-4"/> },
                  { value: EventType.OTHER, label: '其他', icon: <PenLine className="w-4 h-4"/> }
                ].map((opt) => (
                  <button
                    type="button"
                    key={opt.value}
                    onClick={() => setType(opt.value)}
                    className={`flex flex-col items-center justify-center gap-1 py-3 rounded-2xl border transition-all duration-200 ${
                      type === opt.value
                        ? 'bg-primary text-white border-primary shadow-lg shadow-primary/30 transform scale-105'
                        : 'bg-white text-gray-500 border-gray-100 hover:bg-gray-50 hover:border-gray-200'
                    }`}
                  >
                    {opt.icon}
                    <span className="text-xs font-medium">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">备注 (选填)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="写点什么..."
              rows={3}
              className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-gray-800 placeholder-gray-400 focus:bg-white focus:border-primary/30 focus:ring-4 focus:ring-primary/10 outline-none transition-all duration-200 resize-none"
            />
          </div>

          {/* Action Button */}
          <button
            type="submit"
            className="w-full py-4 bg-gray-900 hover:bg-black text-white rounded-2xl font-bold text-lg shadow-xl shadow-gray-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4"
          >
            <Save className="w-5 h-5" />
            保存记录
          </button>
        </form>
      </div>
    </div>
  );
};

export default EventForm;