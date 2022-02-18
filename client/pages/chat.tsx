import React from 'react';
import type { NextPage } from 'next';
import ClientOnlyDiv from '../components/ClientOnlyDiv';
import useLayout from '../customHooks/useLayout';
import ChatContainer from '../components/Chat/ChatContainer';

const Chat: NextPage = (): JSX.Element => {
  useLayout({ showNavbar: true, showTransition: false, containerMaxWidth: 'xl' });
  const showContent = true;

  return (
    <ClientOnlyDiv>
      {showContent ? (
        <div>
          <p>
            Hello
          </p>
          <ChatContainer />
        </div>
      ) : <p>No</p>}
    </ClientOnlyDiv>
  );
};

export default Chat;
