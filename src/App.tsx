import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { SidebarLeft } from './components/SidebarLeft';
import { SidebarRight } from './components/SidebarRight';
import { AdminPanel } from './components/AdminPanel';
import { CreatePostModal } from './components/CreatePostModal';
import { CreateStoryModal } from './components/CreateStoryModal';
import { CreateGroupModal } from './components/CreateGroupModal';
import { StoryViewerModal } from './components/StoryViewerModal';
import { MessengerModal } from './components/MessengerModal';
import { FloatingChat } from './components/FloatingChat';
import { CallModal } from './components/CallModal';

import { FeedView } from './views/FeedView';
import { GroupsView } from './views/GroupsView';
import { WatchView } from './views/WatchView';
import { FriendsView } from './views/FriendsView';
import { ProfileView } from './views/ProfileView';
import { MarketplaceView } from './views/MarketplaceView';
import { SavedView } from './views/SavedView';

const MainLayout: React.FC = () => {
  const { currentTab, isAdminOpen } = useApp();

  return (
    <div className="min-h-screen bg-[#f0f2f5] dark:bg-[#18191a] text-gray-900 dark:text-gray-100 flex flex-col font-sans transition-colors">
      {/* Top Main Navigation Bar */}
      <Navbar />

      {/* Main Container Layout */}
      <main className="flex-1 flex justify-center w-full max-w-[1920px] mx-auto pt-14">
        {/* Left Navigation Sidebar */}
        <SidebarLeft />

        {/* Dynamic Center Feed / View Content */}
        <div className="flex-1 min-w-0 max-w-2xl px-2 sm:px-4 py-2 pb-20 md:pb-6 overflow-y-auto min-h-[calc(100vh-3.5rem)]">
          {currentTab === 'feed' && <FeedView />}
          {currentTab === 'groups' && <GroupsView />}
          {currentTab === 'watch' && <WatchView />}
          {currentTab === 'friends' && <FriendsView />}
          {currentTab === 'profile' && <ProfileView />}
          {currentTab === 'marketplace' && <MarketplaceView />}
          {currentTab === 'saved' && <SavedView />}
        </div>

        {/* Right Active Contacts / Widgets Sidebar */}
        <SidebarRight />
      </main>

      {/* Modals & Overlays */}
      {isAdminOpen && <AdminPanel />}
      <CreatePostModal />
      <CreateStoryModal />
      <CreateGroupModal />
      <StoryViewerModal />
      <MessengerModal />
      <FloatingChat />
      <CallModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
