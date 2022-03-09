import React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Link from 'next/link';

export interface IClinicCard{
  title: string;
  description: string;
  city: string;
  imagePath: string;
}

const ClinicCard: React.FC<IClinicCard> = ({
  title, description, city, imagePath,
}) => (
  <Card
    sx={{ maxWidth: 345 }}
    style={{
      display: 'flex',
      flexDirection: 'column',
      margin: '3px',
      backgroundColor: 'white',
    }}
  >
    <CardMedia
      component='img'
      alt={`${title}-${city}`}
      height='240'
      image={imagePath}
    />
    <CardContent>
      <Typography gutterBottom variant='h5' component='div'>
        {title}
      </Typography>
      <Typography gutterBottom variant='subtitle1'>
        {city}
      </Typography>
      <Typography variant='body2' color='text.secondary'>
        {description}
      </Typography>
    </CardContent>
    <div style={{ flexGrow: 1 }} />
    <CardActions>
      <Link href={`/clinic/${title}`} passHref>
        <Button fullWidth>See more</Button>
      </Link>
    </CardActions>
  </Card>
);

export default ClinicCard;
