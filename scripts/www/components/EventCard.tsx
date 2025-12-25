import React from 'react';
import { EventItem, EventType } from '../types';
import { getDaysUntil, formatDate, getAgeOrYears, getEventTypeLabel } from '../utils';
import { Trash2, Edit2, CalendarHeart, Cake, Star } from 'lucide-react';

interface EventCardProps {
  event: EventItem;
  onEdit: (event: EventItem) => void;
  onDelete: (id: string) => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onEdit, onDelete }) => {
  const daysUntil = getDaysUntil(event.date);
  const years = getAgeOrYears(event.date);

  // Dynamic styling based on event type
  let icon = <Star className="w-5 h-5 text-yellow-500" />;
  let bgColor = "bg-white";
  let borderColor = "border-gray-200";

  if (event.type === EventType.BIRTHDAY) {
    icon = <Cake className="w-5 h-5 text-primary" />;
    bgColor = "bg-orange-50";
    borderColor = "border-orange-100";
  } else if (event.type === EventType.ANNIVERSARY) {
    icon = <CalendarHeart className="w-5 h-5 text-secondary" />;
    bgColor = "bg-blue-50";
    borderColor = "border-blue-100";
  }

  const isUrgent = daysUntil <= 7;

  return (
    <div className={`relative p-4 mb-3 rounded-xl border ${borderColor} ${bgColor} shadow-sm transition-all hover:shadow-md`}>
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white rounded-full shadow-sm">
            {icon}
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-lg">{event.name}</h3>
            <p className="text-sm text-gray-500">
              {formatDate(event.date)} · {getEventTypeLabel(event.type)}
              {event.type === EventType.BIRTHDAY && ` · ${years}岁`}
              {event.type === EventType.ANNIVERSARY && ` · ${years}周年`}
            </p>
          </div>
        </div>
        
        <div className={`flex flex-col items-end`}>
           <span className={`text-2xl font-bold ${isUrgent ? 'text-primary' : 'text-gray-700'}`}>
             {daysUntil}
           </span>
           <span className="text-xs text-gray-500">天后</span>
        </div>
      </div>

      {event.notes && (
        <div className="mt-3 text-sm text-gray-600 bg-white/60 p-2 rounded-md">
          {event.notes}
        </div>
      )}

      <div className="mt-4 flex gap-2 justify-end border-t border-gray-200/50 pt-3">
        <button 
          onClick={() => onEdit(event)}
          className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
        >
          <Edit2 className="w-4 h-4" />
        </button>
        <button 
          onClick={() => onDelete(event.id)}
          className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default EventCard;