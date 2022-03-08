import React from 'react';
import type { NextPage } from 'next';
import {
  Grid, Typography, Button,
} from '@mui/material';
// import Image from 'next/image';
import useLayout from '../../customHooks/useLayout';
import StartChatModal from '../../components/Chat/StartChatModal';
import clinicsData from '../../components/ClinicsCards/temp';
import { IClinicCard } from '../../components/ClinicsCards/ClinicCard';

export const getServerSideProps = async (context: { query: { slug: string | null; }; }) => {
  let { slug } = context.query;
  if (!slug) {
    slug = null;
  }
  return { props: { slug } };
};

interface IUserPageProps {
  slug: string | null;
}

async function wait(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

const UserPage: NextPage<IUserPageProps> = (props) => {
  const { slug } = props;
  useLayout({ showNavbar: true, showTransition: false, containerMaxWidth: 'xl' });
  const [clinicData, setClinicData] = React.useState<IClinicCard>();

  const [isLoading, setIsLoading] = React.useState(true);
  const [openStartChatModal, setOpenStartChatModal] = React.useState(false);
  const handleOpenStartChatModal = () => setOpenStartChatModal(true);

  React.useEffect(() => {
    async function getClinic() {
      await wait(1500);
      setClinicData(
        clinicsData.find((clinic: IClinicCard) => clinic.title === slug),
      );
      setIsLoading(false);
    }

    getClinic();
  }, [slug]);

  return (
    <div>
      {isLoading
        ? <div>Loading ...</div>
        : (
          <Grid container spacing={2} direction='column'>

            {/* Title */}
            <Grid item>
              <Typography variant='h5'>
                Clinics Information
              </Typography>
            </Grid>

            {/* Prodile data */}
            {clinicData
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
                        Title:
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography gutterBottom variant='body1'>
                        {clinicData.title}
                      </Typography>
                    </Grid>
                  </Grid>

                  <Grid
                    item
                    container
                    direction='row'
                    spacing={1}
                  >
                    <Grid item>
                      <Typography gutterBottom variant='body1' color='text.secondary'>
                        City:
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography gutterBottom variant='body1'>
                        {clinicData.city}
                      </Typography>
                    </Grid>
                  </Grid>

                  <Grid
                    item
                    container
                    direction='row'
                    spacing={1}
                  >
                    <Grid item>
                      <Typography gutterBottom variant='body1' color='text.secondary'>
                        Description:
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography gutterBottom variant='body1'>
                        {clinicData.description}
                      </Typography>
                    </Grid>
                  </Grid>

                  <Grid item container justifyContent='center'>
                    <Typography gutterBottom variant='h5' color='text.secondary'>
                      Gallery will be here soon
                    </Typography>
                  </Grid>

                  {/*
                  <Grid item container justifyContent='center'>
                    <div style={{
                      maxWidth: '100%',
                      height: 'auto',
                      position: 'relative',
                    }}
                    >
                      <Image
                        src={clinicData.imagePath}
                        alt={`${clinicData.title}-${clinicData.city}`}
                        width={600}
                        height={200}
                      />
                    </div>
                  </Grid>
                  */}
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
            {clinicData && (
              <>
                <Grid item>
                  <Button
                    variant='contained'
                    disabled
                    type='button'
                    onClick={handleOpenStartChatModal}
                  >
                    Chat with
                    {' '}
                    {clinicData.title}
                  </Button>
                </Grid>
                <StartChatModal
                  initiatorUsername={clinicData.title}
                  targetUsername={clinicData.title}
                  open={openStartChatModal}
                  setOpen={setOpenStartChatModal}
                />
              </>
            )}
          </Grid>
        )}
    </div>
  );
};

export default UserPage;
