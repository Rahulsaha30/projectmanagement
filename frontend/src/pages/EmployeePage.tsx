import { useState, useCallback, useEffect } from 'react';
import Layout from '../components/Layout';
import { useAssignmentStore } from '../stores/assignmentStore';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/LoadingSpinner';

// MUI Components
import Box from '@mui/material/Box';
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

// Icons
import RefreshIcon from '@mui/icons-material/Refresh';

const EmployeePage = () => {
    const { addToast } = useToast();
    const [openComplete, setOpenComplete] = useState(false);
    const [selectedAssignId, setSelectedAssignId] = useState<number | null>(null);
    const [hoursWorked, setHoursWorked] = useState(0);
    const [notes, setNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        myAssignments,
        isLoading,
        fetchMyAssignments,
        completeAssignment
    } = useAssignmentStore();

    useEffect(() => {
        fetchMyAssignments();
    }, [fetchMyAssignments]);

    const handleOpenComplete = useCallback((id: number) => {
        setSelectedAssignId(id);
        setHoursWorked(0);
        setNotes('');
        setOpenComplete(true);
    }, []);

    const handleComplete = async () => {
        if (!selectedAssignId) return;
        
        setIsSubmitting(true);
        try {
            await completeAssignment({
                assign_id: selectedAssignId,
                hours_worked: hoursWorked,
                completion_notes: notes || null
            });
            
            addToast({
                type: 'success',
                message: 'Task completed successfully!'
            });
            
            setOpenComplete(false);
        } catch (error) {
            addToast({
                type: 'error',
                message: error instanceof Error ? error.message : 'Failed to complete task'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Layout>
            <Box sx={{ animation: 'fadeIn 0.3s ease-in-out' }}>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2, mb: 4 }}>
                    <Typography variant="h4" fontWeight="bold">My Tasks</Typography>
                    <Button 
                        onClick={fetchMyAssignments} 
                        variant="outlined"
                        disabled={isLoading}
                        startIcon={<RefreshIcon className={isLoading ? 'animate-spin' : ''} />}
                    >
                        Refresh
                    </Button>
                </Box>
                
                {isLoading && !myAssignments ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 256 }}>
                        <LoadingSpinner size="lg" />
                    </Box>
                ) : (
                    <TableContainer component={Paper} variant="outlined" sx={{ animation: 'slideUp 0.4s ease-out' }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Project</TableCell>
                                    <TableCell>Assigned At</TableCell>
                                    <TableCell>Allotted Hours</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {myAssignments && myAssignments.length > 0 ? (
                                    myAssignments.map(a => (
                                        <TableRow key={a.assign_id} hover>
                                            <TableCell fontWeight="medium">{a.project_name}</TableCell>
                                            <TableCell>{new Date(a.assigned_at).toLocaleDateString()}</TableCell>
                                            <TableCell>{a.allotted_hours}h</TableCell>
                                            <TableCell>
                                                <Chip 
                                                    label={a.is_completed ? 'Completed' : 'Pending'}
                                                    color={a.is_completed ? 'success' : 'warning'}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                {!a.is_completed && (
                                                    <Button 
                                                        size="small" 
                                                        variant="contained"
                                                        onClick={() => handleOpenComplete(a.assign_id)}
                                                    >
                                                        Complete
                                                    </Button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                                            No assignments found
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}

                <Dialog open={openComplete} onClose={() => setOpenComplete(false)} maxWidth="sm" fullWidth>
                    <DialogTitle>Complete Task</DialogTitle>
                    <DialogContent>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
                            <TextField
                                label="Hours Worked"
                                type="number"
                                inputProps={{ min: 0 }}
                                value={hoursWorked}
                                onChange={e => setHoursWorked(Number(e.target.value))}
                                fullWidth
                            />
                            <TextField
                                label="Completion Notes"
                                multiline
                                rows={3}
                                value={notes}
                                onChange={e => setNotes(e.target.value)}
                                fullWidth
                            />
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenComplete(false)} disabled={isSubmitting}>
                            Cancel
                        </Button>
                        <Button 
                            onClick={handleComplete}
                            variant="contained"
                            disabled={isSubmitting || hoursWorked <= 0}
                        >
                            {isSubmitting ? (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <LoadingSpinner size="sm" />
                                    Submitting...
                                </Box>
                            ) : (
                                'Submit'
                            )}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Layout>
    );
};

export default EmployeePage;
