import React from 'react';
import type { NextPage } from 'next';
import useLayout from '../customHooks/useLayout';
import ChatContainer from '../components/Chat/ChatContainer';
import useRedirect from '../customHooks/useRedirect';

const Chat: NextPage = (): JSX.Element => {
  useLayout({ showNavbar: true, showTransition: false, containerMaxWidth: 'xl' });
  const isUser = useRedirect({ after: 6, where: '/home', whom: 'nonuser' });

  return (
    <>
      {isUser
        ? (
          <ChatContainer />
        ) : <div>Sorry, this page is not avaible to unauthorized users</div>}
    </>
  );
};

export default Chat;
