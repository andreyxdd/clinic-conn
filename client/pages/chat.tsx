import React from 'react';
import type { NextPage } from 'next';
import useLayout from '../customHooks/useLayout';
import ChatContainer from '../components/Chat/ChatContainer';

const Chat: NextPage = (): JSX.Element => {
  useLayout({ showNavbar: true, showTransition: false, containerMaxWidth: 'xl' });
  const showContent = true;

  return (
    <>
      {showContent ? (
        <ChatContainer />
      ) : <p>No</p>}
    </>
  );
};

export default Chat;
