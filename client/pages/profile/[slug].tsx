import React from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Button, Typography } from '@mui/material';
import useLayout from '../../customHooks/useLayout';
import useAuth from '../../customHooks/useAuth';
// import VideoCallContainer from '../../components/VideoCallContainer';
// import ChatContainer from '../../components/Chat/Chat';
import ClientOnlyDiv from '../../components/ClientOnlyDiv';
import { poster } from '../../lib/auth/csr';
import env from '../../config/env';

export const getServerSideProps = async (context: { query: { slug: string | null; }; }) => {
  let { slug } = context.query;
  // If slug is "undefined", since "undefined" cannot be serialized, server will throw error
  // But null can be serializable
  if (!slug) {
    slug = null;
  }
  // now we are passing the slug to the component
  return { props: { slug } };
};

interface IUserPageProps {
  slug: string | null;
}

const UserPage: NextPage<IUserPageProps> = (props) => {
  const router = useRouter();
  // const { setChatId } = useSockets();

  const [isLoading, setIsLoading] = React.useState(true);

  // const router = useRouter();
  const [showContent, setShowContent] = React.useState(false);
  const { slug } = props;
  useLayout({ showNavbar: true, showTransition: false, containerMaxWidth: 'xl' });
  const { user } = useAuth();

  React.useEffect(() => {
    // TODO: dont forget to correct below
    if (user
      && (user.username === 'volkov' || user.username === 'sample')) {
      setShowContent(true);
    }
    setIsLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleStartChat = async () => {
    const res = await poster < { chatId: number }>(`${env.api}/chat/create`, { target: slug });

    if (res.data) {
      // setChatId(res.data.chatId);
      router.push('/chat');
    }
  };

  return (
    <ClientOnlyDiv>
      {isLoading ? <div>Loading ... </div> : (
        <>
          {showContent ? (
            <div>
              <Typography variant='h5'>
                Hi,
                {' '}
                {user?.username}
                . This is page of
                {' '}
                {slug}
                {' '}
                user.
              </Typography>
              <Button type='button' onClick={handleStartChat}>
                Start Chat with
                {' '}
                {slug}
              </Button>
            </div>
          )
            : (
              <div>
                Sorry, this page is not availble to you.
              </div>
            )}
        </>
      )}

    </ClientOnlyDiv>
  );
};

export default UserPage;
