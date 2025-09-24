import React from 'react';
import TestUpload from '../components/TestUpload';
import Profile from '../components/Profile';
import { Grid } from '@mui/material';

export default function UploadPage() {
  return (
    <div style={{ padding: '20px' }}>
      <Grid container spacing={3}>
        <Grid size={12} md={8}>
          <TestUpload />
        </Grid>
        <Grid size={12} md={4}>
          <Profile />
        </Grid>
      </Grid>
    </div>
  );
}
