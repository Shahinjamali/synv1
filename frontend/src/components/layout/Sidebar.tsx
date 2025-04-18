import Link from 'next/link';
import React from 'react';

interface SidebarProps {
  isSidebar: boolean;
  handleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isSidebar, handleSidebar }) => {
  return (
    <>
      {/* Sidebar Content (You'll need to add your sidebar's HTML here) */}
      {/* Example: */}
    </>
  );
};

export default Sidebar;
