import React from 'react';
import type { NextPage } from 'next';
import Typography from '@mui/material/Typography';
import VideoCallContainer from '../../components/VideoCallContainer';
import useLayout from '../../customHooks/useLayout';
import useAuth from '../../customHooks/useAuth';

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
  const [isLoading, setIsLoading] = React.useState(true);

  // const router = useRouter();
  const [showContent, setShowContent] = React.useState(false);
  const { slug } = props;
  useLayout({ showNavbar: true, showTransition: false, containerMaxWidth: 'xl' });
  const { user } = useAuth();

  React.useEffect(() => {
    if (user && user.username === slug) {
      setShowContent(true);
    }
    setIsLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <>
      {isLoading ? <div>Loading ... </div> : (
        <>
          {showContent ? (
            <div>
              <Typography variant='h5'>
                Hi,
                {' '}
                {user?.username}
                . Are you ready to start the call?
              </Typography>
              <VideoCallContainer />
            </div>
          )
            : (
              <div>
                Sorry, this page is not availble to you.
              </div>
            )}
        </>
      )}

    </>
  );
};

export default UserPage;
