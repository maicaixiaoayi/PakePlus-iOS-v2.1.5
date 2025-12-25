import { EventItem, EventType } from './types';

export const getDaysUntil = (dateString: string): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const currentYear = today.getFullYear();
  const [year, month, day] = dateString.split('-').map(Number);
  
  // Create a date object for the event in the current year
  let nextEventDate = new Date(currentYear, month - 1, day);
  
  // If the date has already passed this year, move to next year
  if (nextEventDate.getTime() < today.getTime()) {
    nextEventDate = new Date(currentYear + 1, month - 1, day);
  }
  
  const diffTime = nextEventDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  
  return diffDays;
};

export const formatDate = (dateString: string): string => {
  // Returns MM-DD
  const parts = dateString.split('-');
  return `${parts[1]}月${parts[2]}日`;
};

export const getAgeOrYears = (dateString: string): number => {
  const today = new Date();
  const [year] = dateString.split('-').map(Number);
  return today.getFullYear() - year;
};

export const getEventTypeLabel = (type: EventType): string => {
  switch (type) {
    case EventType.BIRTHDAY: return '生日';
    case EventType.ANNIVERSARY: return '纪念日';
    case EventType.OTHER: return '其他';
    default: return '事件';
  }
};

export const exportToCSV = (events: EventItem[]) => {
  const headers = ['姓名/标题', '日期', '类型', '倒计时(天)', '备注'];
  const rows = events.map(e => [
    e.name,
    e.date,
    getEventTypeLabel(e.type),
    getDaysUntil(e.date).toString(),
    e.notes || ''
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(','))
  ].join('\n');

  const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `亲友纪念日导出_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToTXT = (events: EventItem[]) => {
  let content = "=== 亲友纪念日清单 ===\n\n";
  
  events.forEach(e => {
    const days = getDaysUntil(e.date);
    content += `【${e.name}】 - ${getEventTypeLabel(e.type)}\n`;
    content += `日期: ${e.date} (每年 ${formatDate(e.date)})\n`;
    content += `状态: 还有 ${days} 天\n`;
    if (e.notes) content += `备注: ${e.notes}\n`;
    content += "------------------------\n";
  });

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `亲友纪念日导出_${new Date().toISOString().split('T')[0]}.txt`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};