import React from 'react';
import Card from '@mui/material/Card/index.js';
import CardActions from '@mui/material/CardActions/index.js';
import CardContent from '@mui/material/CardContent/index.js';
import CardMedia from '@mui/material/CardMedia/index.js';
import Typography from '@mui/material/Typography/index.js';
import Button from '@mui/material/Button/index.js';
import basicMathImage from '../resources/math.jpg';
import physicsImage from '../resources/physics.jpg';
import programmingImage from '../resources/programming.jpg';
import historyImage from '../resources/history.jpg';
import graphicDesignImage from '../resources/design.jpg';
import defaultImage from '../resources/default.jpg';

const SessionCard = ({ date, startHour, endHour, subject, courseCode }) => {
  const courseImages = {
    "Matemáticas Básicas": basicMathImage,
    "Física I": physicsImage,
    "Programación I": programmingImage,
    "Historia Universal": historyImage,
    "Diseño Gráfico": graphicDesignImage,
    "default": defaultImage
  };

  const imageUrl = courseImages[subject] || "../resources/default.jpg"; // 
  
  return (
      <Card sx={{ maxWidth: 345, m: 2, boxShadow: 3 }}>
          <CardMedia
              component="img"
              alt={subject}
              height="140"
              image={imageUrl}
          />
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