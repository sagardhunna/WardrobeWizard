import * as React from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';

export default function InventoryDisplay({ inventoryImages }) {
  return (
    <ImageList sx={{ width: 500, height: 450 }} cols={3} rowHeight={164}>
      {inventoryImages.map((item) => (
        <ImageListItem key={item.image_url}>
          <img
            srcSet={`${item.image_url}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
            src={`${item.image_url}?w=164&h=164&fit=crop&auto=format`}
            loading="lazy"
            style={{ border: 'solid black' }}
          />
        </ImageListItem>
      ))}
    </ImageList>
  );
}