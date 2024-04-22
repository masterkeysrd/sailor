import { createDockerDesktopClient } from '@docker/extension-api-client';
import { Box, Grid, Stack, TextField, Typography } from '@mui/material';
import Containers from './components/Containers/Containers'
import useFetchContainers from './hooks/useFetchContainers';
import Logs from './components/Logs/Logs';
import { useEffect, useState } from 'react';
import useFetchLogs from './hooks/useFetchLogs';

// Note: This line relies on Docker Desktop's presence as a host application.
// If you're running this React app in a browser, it won't work properly.
const client = createDockerDesktopClient();

function useDockerDesktopClient() {
  return client;
}

export function App() {
  const ddClient = useDockerDesktopClient();
  const { containers } = useFetchContainers(ddClient)
  const { logs } = useFetchLogs(ddClient, containers)

  return (
    <Grid container spacing={2} sx={{ height: '100%' }}>
      <Grid item xs={12}>
        <Typography variant="h3">Sailor</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          View all your container logs in one place so ya can debug and troubleshoot faster.
        </Typography>
      </Grid>
      <Grid item xs={3}>
        <Containers containers={containers} />
      </Grid>
      <Grid item xs={9} sx={{ height: 'calc(100% - 50px)' }}>
        <Logs logs={logs} containers={containers} />
      </Grid>
    </Grid >
  );
}

