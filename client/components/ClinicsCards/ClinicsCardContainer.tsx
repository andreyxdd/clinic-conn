import { Grid, Box } from '@mui/material';
import React from 'react';
import clincsData from './temp';
import ClinicCard, { IClinicCard } from './ClinicCard';

interface IClinicsCardContainer {}

const ClinicsCardContainer: React.FC<IClinicsCardContainer> = () => (
  <Box sx={{ flexGrow: 1 }}>
    <Grid
      container
      spacing={2}
      justifyContent='space-evenly'
      alignItems='stretch'
    >
      {clincsData.map((card: IClinicCard) => (
        <Grid
          key={card.title}
          item
          style={{ display: 'flex' }}
        >
          <ClinicCard
            title={card.title}
            description={card.description}
            city={card.city}
            imagePath={card.imagePath}
          />
        </Grid>
      ))}
    </Grid>
  </Box>
);

export default ClinicsCardContainer;
