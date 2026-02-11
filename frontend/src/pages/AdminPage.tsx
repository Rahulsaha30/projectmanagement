import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useProjectStore } from '../stores/projectStore';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/LoadingSpinner';

// MUI Components
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';

// Icons
import RefreshIcon from '@mui/icons-material/Refresh';
import AddIcon from '@mui/icons-material/Add';
import BarChartIcon from '@mui/icons-material/BarChart';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const AdminPage = () => {
    const { addToast } = useToast();
    const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const {
        projects,
        stats,
        isLoading: isLoadingProjects,
        isLoadingStats,
        fetchProjects,
        fetchStats,
        addProject,
        updateProjectById
    } = useProjectStore();
    
    const [name, setName] = useState('');
    const [clientName, setClientName] = useState(''); 
    const [expectedHours, setExpectedHours] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
        fetchProjects();
        fetchStats();
    }, [fetchProjects, fetchStats]);

    const handleCreateProject = async () => {
        if (!name || !clientName) {
            addToast({
                type: 'warning',
                message: 'Please fill in all required fields'
            });
            return;
        }

        setIsSubmitting(true);
        try {
            await addProject({
                name,
                client: clientName,
                expected_hours: expectedHours ? Number(expectedHours) : null,
                end_date: endDate || null
            });
            
            addToast({
                type: 'success',
                message: 'Project created successfully!'
            });
            
            setOpen(false);
            setName('');
            setClientName('');
            setExpectedHours('');
            setEndDate('');
            fetchStats();
        } catch (error) {
            addToast({
                type: 'error',
                message: error instanceof Error ? error.message : 'Failed to create project'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleToggleStatus = async (projectId: number, currentStatus: boolean) => {
        try {
            await updateProjectById(projectId, { status: !currentStatus });
            addToast({
                type: 'success',
                message: `Project ${!currentStatus ? 'activated' : 'deactivated'} successfully!`
            });
            fetchStats();
        } catch (error) {
            addToast({
                type: 'error',
                message: 'Failed to update project status'
            });
        }
    };

    return (
        <Layout>
            <Box sx={{ animation: 'fadeIn 0.3s ease-in-out' }}>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2, mb: 4 }}>
                    <Typography variant="h4" fontWeight="bold">Admin Dashboard</Typography>
                    <Button 
                        onClick={() => {
                            fetchProjects();
                            fetchStats();
                        }} 
                        variant="outlined"
                        disabled={isLoadingProjects || isLoadingStats}
                        startIcon={<RefreshIcon className={isLoadingProjects || isLoadingStats ? 'animate-spin' : ''} />}
                    >
                        Refresh
                    </Button>
                </Box>
                
                {/* Stats Cards */}
                <Grid container spacing={3} sx={{ mb: 4, animation: 'slideUp 0.4s ease-out' }}>
                    {isLoadingStats ? (
                        Array.from({ length: 4 }).map((_, i) => (
                            <Grid item xs={12} sm={6} lg={3} key={i}>
                                <Card>
                                    <CardHeader title="Loading..." />
                                    <CardContent><LoadingSpinner size="sm" /></CardContent>
                                </Card>
                            </Grid>
                        ))
                    ) : stats ? (
                        <>
                            <Grid item xs={12} sm={6} lg={3}>
                                <Card className="hover-lift">
                                    <CardHeader 
                                        title="Total Projects"
                                        avatar={<FolderOpenIcon color="action" />}
                                        titleTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                                    />
                                    <CardContent>
                                        <Typography variant="h4" fontWeight="bold">{stats.total_projects}</Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} sm={6} lg={3}>
                                <Card className="hover-lift">
                                    <CardHeader 
                                        title="Active Projects"
                                        avatar={<AccessTimeIcon color="action" />}
                                        titleTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                                    />
                                    <CardContent>
                                        <Typography variant="h4" fontWeight="bold">{stats.active_projects}</Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} sm={6} lg={3}>
                                <Card className="hover-lift">
                                    <CardHeader 
                                        title="Completed"
                                        avatar={<CheckCircleIcon color="action" />}
                                        titleTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                                    />
                                    <CardContent>
                                        <Typography variant="h4" fontWeight="bold">{stats.completed_projects}</Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} sm={6} lg={3}>
                                <Card className="hover-lift">
                                    <CardHeader 
                                        title="Total Hours"
                                        avatar={<BarChartIcon color="action" />}
                                        titleTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                                    />
                                    <CardContent>
                                        <Typography variant="h4" fontWeight="bold">{stats.total_expected_hours}h</Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </>
                    ) : null}
                </Grid>

                {/* Projects Table */}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                    <Button 
                        onClick={() => setOpen(true)} 
                        variant="contained"
                        startIcon={<AddIcon />}
                    >
                        Create Project
                    </Button>
                </Box>

                {isLoadingProjects && !projects ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 256 }}>
                        <LoadingSpinner size="lg" />
                    </Box>
                ) : (
                    <TableContainer component={Paper} variant="outlined">
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Client</TableCell>
                                    <TableCell>Expected Hours</TableCell>
                                    <TableCell>Start Date</TableCell>
                                    <TableCell>End Date</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {projects && projects.length > 0 ? (
                                    projects.map(p => (
                                        <TableRow key={p.project_id} hover>
                                            <TableCell>{p.project_id}</TableCell>
                                            <TableCell fontWeight="medium">{p.name}</TableCell>
                                            <TableCell>{p.client}</TableCell>
                                            <TableCell>{p.expected_hours || 0}h</TableCell>
                                            <TableCell>{new Date(p.start_date).toLocaleDateString()}</TableCell>
                                            <TableCell>{p.end_date ? new Date(p.end_date).toLocaleDateString() : '-'}</TableCell>
                                            <TableCell>
                                                <Chip 
                                                    label={p.status ? 'Active' : 'Inactive'}
                                                    color={p.status ? 'success' : 'default'}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    onClick={() => handleToggleStatus(p.project_id, p.status)}
                                                >
                                                    {p.status ? 'Deactivate' : 'Activate'}
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={8} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                                            No projects found
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}

                {/* Create Project Dialog */}
                <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
                    <DialogTitle>Create New Project</DialogTitle>
                    <DialogContent>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
                            <TextField
                                label="Project Name *"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                placeholder="Website Redesign"
                                fullWidth
                            />
                            <TextField
                                label="Client Name *"
                                value={clientName}
                                onChange={e => setClientName(e.target.value)}
                                placeholder="Acme Corp"
                                fullWidth
                            />
                            <TextField
                                label="Expected Hours"
                                type="number"
                                inputProps={{ min: 0 }}
                                value={expectedHours}
                                onChange={e => setExpectedHours(e.target.value)}
                                placeholder="160"
                                fullWidth
                            />
                            <TextField
                                label="End Date"
                                type="date"
                                value={endDate}
                                onChange={e => setEndDate(e.target.value)}
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                            />
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpen(false)} disabled={isSubmitting}>
                            Cancel
                        </Button>
                        <Button 
                            onClick={handleCreateProject}
                            variant="contained"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <LoadingSpinner size="sm" />
                                    Creating...
                                </Box>
                            ) : (
                                'Create Project'
                            )}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Layout>
    );
};

export default AdminPage;
