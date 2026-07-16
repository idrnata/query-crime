export const formatTime = (date: Date) => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const formatDate = (date: Date) => {
  return date.toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' });
};
