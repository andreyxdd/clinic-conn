import { CircularProgress, Typography, Button } from '@mui/material';
import React from 'react';
import { useUsersQuery } from '../generated/graphql';

interface IShowUsersProps {}

const ShowUsers: React.FC<IShowUsersProps> = () => {
  const [query, setQuery] = React.useState(true);
  const [result, executeQuery] = useUsersQuery({
    pause: query,
  });

  const handleClick = () => {
    setQuery(true);
    executeQuery();
  };

  const { data, fetching, error } = result;

  if (fetching) return <CircularProgress />;
  if (error) {
    return (
      <p>
        Oh no...
        {' '}
        {error.message}
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
