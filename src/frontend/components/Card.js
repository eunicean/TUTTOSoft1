import React from 'react';
import Card from '@mui/material/Card/index.js';
import CardActions from '@mui/material/CardActions/index.js';
import CardContent from '@mui/material/CardContent/index.js';
import CardMedia from '@mui/material/CardMedia/index.js';
import Typography from '@mui/material/Typography/index.js';
import Button from '@mui/material/Button/index.js';

const SessionCard = ({ date, startHour, endHour, subject, imageUrl }) => {
  return (
    <Card sx={{ maxWidth: 345, m: 2, boxShadow: 3 }}>
      {/* <CardMedia
        component="img"
        alt={subject}
        height="140"
        image={imageUrl}
      /> */}
      <CardContent>
        <Typography color="text.secondary" gutterBottom>
          Fecha: {date}
        </Typography>
        <Typography variant="h5" component="div">
          Horario: {startHour} - {endHour}
        </Typography>
        <Typography color="text.secondary">
          Materia: {subject}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Cancelar</Button>
      </CardActions>
    </Card>
  );
};

export default SessionCard;