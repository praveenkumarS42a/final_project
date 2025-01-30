import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('/api/dashboard/stats');
        setStats(res.data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching dashboard data');
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '80vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Welcome, {user?.name}
      </Typography>

      <Grid container spacing={3}>
        {user?.role === 'patient' ? (
          <>
            <Grid item xs={12} md={4}>
              <Paper
                sx={{
                  p: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  height: 140,
                }}
              >
                <Typography variant="h6" gutterBottom>
                  Upcoming Appointments
                </Typography>
                <Typography variant="h4" component="div">
                  {stats?.upcomingAppointments || 0}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper
                sx={{
                  p: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  height: 140,
                }}
              >
                <Typography variant="h6" gutterBottom>
                  Past Appointments
                </Typography>
                <Typography variant="h4" component="div">
                  {stats?.pastAppointments || 0}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper
                sx={{
                  p: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  height: 140,
                }}
              >
                <Typography variant="h6" gutterBottom>
                  Cancelled Appointments
                </Typography>
                <Typography variant="h4" component="div">
                  {stats?.cancelledAppointments || 0}
                </Typography>
              </Paper>
            </Grid>
          </>
        ) : (
          <>
            <Grid item xs={12} md={4}>
              <Paper
                sx={{
                  p: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  height: 140,
                }}
              >
                <Typography variant="h6" gutterBottom>
                  Today's Appointments
                </Typography>
                <Typography variant="h4" component="div">
                  {stats?.todayAppointments || 0}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper
                sx={{
                  p: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  height: 140,
                }}
              >
                <Typography variant="h6" gutterBottom>
                  Total Patients
                </Typography>
                <Typography variant="h4" component="div">
                  {stats?.totalPatients || 0}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper
                sx={{
                  p: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  height: 140,
                }}
              >
                <Typography variant="h6" gutterBottom>
                  This Week's Appointments
                </Typography>
                <Typography variant="h4" component="div">
                  {stats?.weekAppointments || 0}
                </Typography>
              </Paper>
            </Grid>
          </>
        )}
      </Grid>
    </Container>
  );
};

export default Dashboard;
