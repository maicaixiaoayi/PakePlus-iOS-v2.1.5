import React, { useState, useEffect, useMemo } from 'react';
import { EventItem, EventType } from './types';
import { getDaysUntil, exportToCSV, exportToTXT } from './utils';
import EventCard from './components/EventCard';
import EventForm from './components/EventForm';
import ConfirmModal from './components/ConfirmModal';
import { Plus, Download, Search, CalendarHeart } from 'lucide-react';

const App: React.FC = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<EventType | 'ALL'>('ALL');
  
  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | undefined>(undefined);
  
  // Delete confirmation state
  const [deleteId, setDeleteId] = useState<string | null>(null);
  
  // Export Menu State
  const [showExportMenu, setShowExportMenu] = useState(false);

  // Load data on mount
  useEffect(() => {
    const saved = localStorage.getItem('memorykeeper_events');
    if (saved) {
      try {
        setEvents(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse events", e);
      }
    } else {
      // Seed data for first time users
      const seed: EventItem[] = [
        { id: '1', name: '示例: 妈妈生日', date: '1975-05-20', type: EventType.BIRTHDAY, notes: '喜欢花' },
        { id: '2', name: '示例: 结婚纪念日', date: '2020-10-01', type: EventType.ANNIVERSARY, notes: '三周年' }
      ];
      setEvents(seed);
      localStorage.setItem('memorykeeper_events', JSON.stringify(seed));
    }
  }, []);

  // Save data on change
  useEffect(() => {
    if (events.length > 0) {
      localStorage.setItem('memorykeeper_events', JSON.stringify(events));
    }
  }, [events]);

  const handleSaveEvent = (data: Omit<EventItem, 'id'>) => {
    if (editingEvent) {
      setEvents(prev => prev.map(e => e.id === editingEvent.id ? { ...data, id: editingEvent.id } : e));
    } else {
      const newEvent: EventItem = {
        ...data,
        id: crypto.randomUUID()
      };
      setEvents(prev => [...prev, newEvent]);
    }
    setEditingEvent(undefined);
  };

  const confirmDeleteEvent = (id: string) => {
    setDeleteId(id);
  };

  const handleExecuteDelete = () => {
    if (deleteId) {
      setEvents(prev => prev.filter(e => e.id !== deleteId));
      setDeleteId(null);
    }
  };

  const handleEditEvent = (event: EventItem) => {
    setEditingEvent(event);
    setIsFormOpen(true);
  };

  // Sort and Filter logic
  const filteredEvents = useMemo(() => {
    return events
      .filter(e => {
        const matchesSearch = e.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'ALL' || e.type === filterType;
        return matchesSearch && matchesType;
      })
      .sort((a, b) => getDaysUntil(a.date) - getDaysUntil(b.date)); // Always sort by days remaining nearest
  }, [events, searchTerm, filterType]);

  return (
    <div className="min-h-screen pb-24 max-w-lg mx-auto bg-gray-50 shadow-2xl relative">
      
      {/* Header */}
      <header className="bg-white sticky top-0 z-10 px-6 py-4 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800 tracking-wide font-serif">
            拾光<span className="text-primary">记</span>
          </h1>
          <div className="relative">
            <button 
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
            >
              <Download className="w-5 h-5 text-gray-600" />
            </button>
            
            {showExportMenu && (
              <div className="absolute right-0 top-12 bg-white rounded-xl shadow-xl border border-gray-100 p-2 w-40 z-20 animate-in fade-in zoom-in-95 duration-100">
                <button 
                  onClick={() => { exportToCSV(events); setShowExportMenu(false); }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 rounded-lg text-sm text-gray-700"
                >
                  导出 Excel (CSV)
                </button>
                <button 
                  onClick={() => { exportToTXT(events); setShowExportMenu(false); }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 rounded-lg text-sm text-gray-700"
                >
                  导出文本 (TXT)
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="搜索亲友..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-100 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <select 
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="bg-gray-100 rounded-lg text-sm px-3 py-2 text-gray-600 outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="ALL">全部</option>
            <option value={EventType.BIRTHDAY}>生日</option>
            <option value={EventType.ANNIVERSARY}>纪念日</option>
            <option value={EventType.OTHER}>其他</option>
          </select>
        </div>
      </header>

      {/* Stats Summary */}
      <div className="px-6 py-4">
        <div className="bg-gradient-to-r from-primary to-orange-400 rounded-2xl p-5 text-white shadow-lg shadow-primary/20">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-white/80 text-sm font-medium mb-1">即将到来</p>
              <h2 className="text-3xl font-bold">
                {filteredEvents.length > 0 ? filteredEvents[0].name : '暂无'}
              </h2>
            </div>
            <div className="text-right">
              <span className="text-4xl font-bold">
                {filteredEvents.length > 0 ? getDaysUntil(filteredEvents[0].date) : '-'}
              </span>
              <span className="text-sm opacity-80 ml-1">天</span>
            </div>
          </div>
        </div>
      </div>

      {/* Event List */}
      <div className="px-4 space-y-2">
        {filteredEvents.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <CalendarHeart className="w-8 h-8 text-gray-300" />
            </div>
            <p>还没有记录哦</p>
            <p className="text-sm mt-2">点击右下角按钮添加</p>
          </div>
        ) : (
          filteredEvents.map(event => (
            <EventCard 
              key={event.id} 
              event={event} 
              onEdit={handleEditEvent} 
              onDelete={confirmDeleteEvent} 
            />
          ))
        )}
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => { setEditingEvent(undefined); setIsFormOpen(true); }}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gray-900 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-40"
      >
        <Plus className="w-7 h-7" />
      </button>

      {/* Modals */}
      <EventForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        onSave={handleSaveEvent} 
        initialData={editingEvent}
      />
      
      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleExecuteDelete}
        title="删除确认"
        message="确定要删除这条记录吗？删除后将无法恢复。"
      />

    </div>
  );
};

export default App;