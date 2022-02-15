import React from 'react';
import type { NextPage } from 'next';
import ClientOnlyDiv from '../components/ClientOnlyDiv';
import useLayout from '../customHooks/useLayout';
import { useSockets } from '../context/SocketContext';

const Chat: NextPage = (): JSX.Element => {
  const { chatId } = useSockets();
  useLayout({ showNavbar: true, showTransition: false, containerMaxWidth: 'xl' });
  const showContent = true;

  return (
    <ClientOnlyDiv>
      {showContent ? (
        <p>
          Hello. You need chat id #:
          {' '}
          {chatId}
        </p>
      ) : <p>No</p>}
    </ClientOnlyDiv>
  );
};

export default Chat;
