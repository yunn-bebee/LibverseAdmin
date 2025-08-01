import React from 'react';
import { Card, CardContent, CardMedia, Typography, CardActions } from '@mui/material';

export interface LibverseCardProps {
    title: string;
    description: string;
    image?: string;
    actions?: React.ReactNode;
    color?: string;
}

const LibverseCard: React.FC<LibverseCardProps> = ({
    title,
    description,
    image,
    actions,
    color = '#fff',
}) => (
    <Card sx={{ maxWidth: 400, background: color, boxShadow: 3 }}>
        {image && (
            <CardMedia
                component="img"
                height="180"
                image={image}
                alt={title}
                sx={{ objectFit: 'cover' }}
            />
        )}
        <CardContent>
            <Typography gutterBottom variant="h5" component="div">
                {title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
                {description}
            </Typography>
        </CardContent>
        {actions && <CardActions>{actions}</CardActions>}
    </Card>
);

export default LibverseCard;
