import React from 'react';
import type { NextPage } from 'next';
import {
  Grid, Typography, Button,
} from '@mui/material';
import { format } from 'date-fns';
import useLayout from '../../customHooks/useLayout';
import useAuth from '../../customHooks/useAuth';
import ClientOnlyDiv from '../../components/ClientOnlyDiv';
import { fetcher } from '../../lib/auth/csr';
import env from '../../config/env';
import useRedirect from '../../customHooks/useRedirect';
import { IUser } from '../../config/types';
import StartChatModal from '../../components/Chat/StartChatModal';

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

interface IUserExtended extends IUser{
  firstName: string | null;
  lastName: string | null;
  birthday: string | null;
  [key: string]: string | null;
}

const UserPage: NextPage<IUserPageProps> = (props) => {
  const { slug } = props;
  useLayout({ showNavbar: true, showTransition: false, containerMaxWidth: 'xl' });
  const isUser = useRedirect({ after: 5, where: '/home', whom: 'nonuser' });
  // TODO: adjust above hook so useAuth is not needed
  const { user } = useAuth();
  const [profileData, setProfileData] = React.useState<IUserExtended>();

  const [isLoading, setIsLoading] = React.useState(true);
  const [openStartChatModal, setOpenStartChatModal] = React.useState(false);
  const handleOpenStartChatModal = () => setOpenStartChatModal(true);

  React.useEffect(() => {
    async function getUser() {
      try {
        const res = await fetcher<IUserExtended>(
          `${env.api}/user/get/?username=${slug}`,
        );
        if (res.data) {
          setProfileData(res.data);
          setIsLoading(false);
        }
      } catch (e) {
        console.log(e);
      }
    }

    if (isUser) {
      getUser();
    }
  }, [isUser, slug]);

  return (
    <>
      {isUser
        ? (
          <ClientOnlyDiv>
            {isLoading
              ? <div>Loading ...</div>
              : (
                <Grid container spacing={2} direction='column'>

                  {/* Title */}
                  <Grid item>
                    <Typography variant='h5'>
                      User Information
                    </Typography>
                  </Grid>

                  {/* Prodile data */}
                  {profileData
                    ? (
                      <Grid item container spacing={1} direction='column'>
                        <Grid
                          item
                          container
                          direction='row'
                          spacing={1}
                        >
                          <Grid item>
                            <Typography gutterBottom variant='body1' color='text.secondary'>
                              Username:
                            </Typography>
                          </Grid>
                          <Grid item>
                            <Typography gutterBottom variant='body1'>
                              {profileData.username}
                            </Typography>
                          </Grid>
                          <Grid
                            item
                            container
                            direction='row'
                            spacing={1}
                          >
                            <Grid item>
                              <Typography gutterBottom variant='body1' color='text.secondary'>
                                Id:
                              </Typography>
                            </Grid>
                            <Grid item>
                              <Typography gutterBottom variant='body1'>
                                {profileData?.id}
                              </Typography>
                            </Grid>
                          </Grid>
                          {profileData.firstName && (
                            <Grid
                              item
                              container
                              direction='row'
                              spacing={1}
                            >
                              <Grid item>
                                <Typography gutterBottom variant='body1' color='text.secondary'>
                                  First name:
                                </Typography>
                              </Grid>
                              <Grid item>
                                <Typography gutterBottom variant='body1'>
                                  {profileData?.firstName}
                                </Typography>
                              </Grid>
                            </Grid>
                          )}
                          {profileData.lastName && (
                            <Grid
                              item
                              container
                              direction='row'
                              spacing={1}
                            >
                              <Grid item>
                                <Typography gutterBottom variant='body1' color='text.secondary'>
                                  Last name:
                                </Typography>
                              </Grid>
                              <Grid item>
                                <Typography gutterBottom variant='body1'>
                                  {profileData?.lastName}
                                </Typography>
                              </Grid>
                            </Grid>
                          )}
                          {profileData.birthday && (
                            <Grid
                              item
                              container
                              direction='row'
                              spacing={1}
                            >
                              <Grid item>
                                <Typography gutterBottom variant='body1' color='text.secondary'>
                                  Birthday:
                                </Typography>
                              </Grid>
                              <Grid item>
                                <Typography gutterBottom variant='body1'>
                                  {format(new Date(profileData.birthday), 'MMMM d, yyyy')}
                                </Typography>
                              </Grid>
                            </Grid>
                          )}
                        </Grid>
                      </Grid>
                    ) : (
                      <Typography gutterBottom variant='body1' color='text.secondary'>
                        Sorry profile data for the
                        {' '}
                        {slug}
                        {' '}
                        is not found
                      </Typography>
                    )}

                  {/* Button */}
                  {profileData
                    && (
                      <>
                        <Grid item>
                          <Button
                            variant='contained'
                            disabled={slug === user!.username}
                            type='button'
                            onClick={handleOpenStartChatModal}
                          >
                            Chat with
                            {' '}
                            {profileData.username}
                          </Button>
                        </Grid>
                        <StartChatModal
                          initiatorUsername={user!.username}
                          targetUsername={profileData.username}
                          open={openStartChatModal}
                          setOpen={setOpenStartChatModal}
                        />
                      </>
                    )}

                </Grid>
              )}

          </ClientOnlyDiv>
        ) : <div>Sorry, this page is not avaible to unauthorized users</div>}
    </>
  );
};

export default UserPage;
