import * as React from 'react';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';

const SkeletonLoader = () => (
  <Stack
    spacing={3}
    sx={{
      marginTop: 8,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}
  >
    <Skeleton sx={{ mt: 2, mb: 4 }} variant='circular' width={40} height={40} />
    <Skeleton variant='rectangular' width={360} height={50} />
    <Skeleton variant='rectangular' width={360} height={50} />
    <Skeleton sx={{ mt: 2, mb: 4 }} variant='rectangular' width={360} height={40} />
  </Stack>
);

export default SkeletonLoader;
