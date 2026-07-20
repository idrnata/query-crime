import { 
  Mail, Folder, Database, Globe, Book, Settings, Lock, Users, 
  Mic, TrendingUp, Award, Map as MapIcon, MailOpen
} from 'lucide-react';

export const ALL_APPS = [
  { id: 'INBOX', label: 'Inbox', icon: Mail },
  { id: 'CASE_FILES', label: 'Case Files', icon: Folder },
  { id: 'DB_LIST', label: 'Police Database', icon: Database },
  { id: 'BROWSER', label: 'Browser', icon: Globe },
  { id: 'EMAIL', label: 'Email', icon: MailOpen },
  { id: 'EVIDENCE', label: 'Evidence Locker', icon: Lock },
  { id: 'NOTEBOOK', label: 'Notebook', icon: Book },
  { id: 'CONTACTS', label: 'Contacts', icon: Users },
  { id: 'WITNESSES', label: 'Witnesses', icon: Mic },
  { id: 'TIMELINE', label: 'Timeline', icon: TrendingUp },
  { id: 'RANK', label: 'Statistics', icon: Award },
  { id: 'SETTINGS', label: 'Settings', icon: Settings },
  { id: 'MAP', label: 'Map', icon: MapIcon },
];
