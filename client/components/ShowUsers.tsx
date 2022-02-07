import { CircularProgress, Typography, Button } from '@mui/material';
import React from 'react';

interface IShowUsersProps {}

const ShowUsers: React.FC<IShowUsersProps> = () => {
  const handleClick = () => {};

  const { data, fetching, error } = { data: { users: [] }, fetching: true, error: '' };

  if (fetching) return <CircularProgress />;
  if (error) {
    return (
      <p>
        Oh no...
        {' '}
        {error}
      </p>
    );
  }

  return (
    <div>
      <Button type='button' onClick={handleClick}>
        FETCH
      </Button>
      <Typography variant='body1' sx={{ pt: 4 }}>
        Look! List of other registered users:
      </Typography>
      {!fetching && !error && data
        && (
          <ul>
            {data.users.map((u: any, idx: number) => (
              <Typography variant='h4' key={`${u.id}-${idx * 14}`}>
                {`Id #${u.id}: ${u.username} - ${u.email} - ${u.tokenVersion}`}
              </Typography>
            ))}
          </ul>
        )}
    </div>
  );
};

export default ShowUsers;
