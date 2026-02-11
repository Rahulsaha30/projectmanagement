import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useEmployeeStore } from '../stores/employeeStore';
import { useAssignmentStore } from '../stores/assignmentStore';
import { useProjectStore } from '../stores/projectStore';
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
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Grid';

// Icons
import RefreshIcon from '@mui/icons-material/Refresh';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AssignmentIcon from '@mui/icons-material/Assignment';

const ManagerPage = () => {
    const { addToast } = useToast();
    const [tab, setTab] = useState(0);
    const [openEmp, setOpenEmp] = useState(false);
    const [openAssign, setOpenAssign] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { 
        employees, 
        isLoading: loadingEmployees, 
        fetchEmployees, 
        createEmployee 
    } = useEmployeeStore();
    
    const { 
        assignments, 
        isLoading: loadingAssignments, 
        fetchAssignments, 
        addAssignment 
    } = useAssignmentStore();
    
    const { 
        projects, 
        fetchProjects 
    } = useProjectStore();

    const [empName, setEmpName] = useState('');
    const [empEmail, setEmpEmail] = useState('');
    const [empPassword, setEmpPassword] = useState('');
    const [empSkills, setEmpSkills] = useState('');
    const [empExperience, setEmpExperience] = useState('');
    const [empDept, setEmpDept] = useState('');
    
    const [assignEmpId, setAssignEmpId] = useState('');
    const [assignProjectId, setAssignProjectId] = useState('');
    const [assignHours, setAssignHours] = useState('');

    useEffect(() => {
        fetchEmployees();
        fetchProjects();
    }, [fetchEmployees, fetchProjects]);

    useEffect(() => {
        if (tab === 1 && assignments.length === 0) {
            fetchAssignments();
        }
    }, [tab, assignments.length, fetchAssignments]);

    const handleAddEmployee = async () => {
        if (!empName || !empEmail || !empPassword) {
            addToast({
                type: 'warning',
                message: 'Please fill in all required fields'
            });
            return;
        }

        setIsSubmitting(true);
        try {
            await createEmployee({
                emp_name: empName,
                email: empEmail,
                password: empPassword,
                skills: empSkills || null,
                experience: empExperience ? Number(empExperience) : null,
                dept: empDept || null
            });
            
            addToast({
                type: 'success',
                message: 'Employee added successfully!'
            });
            
            setOpenEmp(false);
            setEmpName('');
            setEmpEmail('');
            setEmpPassword('');
            setEmpSkills('');
            setEmpExperience('');
            setEmpDept('');
        } catch (error) {
            addToast({
                type: 'error',
                message: error instanceof Error ? error.message : 'Failed to add employee'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAssign = async () => {
        if (!assignEmpId || !assignProjectId || !assignHours) {
            addToast({
                type: 'warning',
                message: 'Please fill in all fields'
            });
            return;
        }

        setIsSubmitting(true);
        try {
            await addAssignment({
                emp_id: Number(assignEmpId),
                project_id: Number(assignProjectId),
                allotted_hours: Number(assignHours)
            });
            
            addToast({
                type: 'success',
                message: 'Assignment created successfully!'
            });
            
            setOpenAssign(false);
            setAssignEmpId('');
            setAssignProjectId('');
            setAssignHours('');
        } catch (error) {
            addToast({
                type: 'error',
                message: error instanceof Error ? error.message : 'Failed to create assignment'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Layout>
            <Box sx={{ animation: 'fadeIn 0.3s ease-in-out' }}>
                <Typography variant="h4" fontWeight="bold" sx={{ mb: 4 }}>Manager Dashboard</Typography>
                
                <Tabs value={tab} onChange={(_e, v) => setTab(v)} sx={{ mb: 3 }}>
                    <Tab label="Employees" />
                    <Tab label="Assignments" />
                </Tabs>

                {tab === 0 && (
                    <Box sx={{ animation: 'slideUp 0.4s ease-out' }}>
                        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', gap: 2, mb: 3 }}>
                            <Button 
                                onClick={() => setOpenEmp(true)} 
                                variant="contained"
                                startIcon={<PersonAddIcon />}
                            >
                                Add Employee
                            </Button>
                            <Button 
                                onClick={fetchEmployees} 
                                variant="outlined"
                                disabled={loadingEmployees}
                                startIcon={<RefreshIcon className={loadingEmployees ? 'animate-spin' : ''} />}
                            >
                                Refresh
                            </Button>
                        </Box>
                        
                        {loadingEmployees && !employees ? (
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
                                            <TableCell>Email</TableCell>
                                            <TableCell>Role</TableCell>
                                            <TableCell>Skills</TableCell>
                                            <TableCell>Experience</TableCell>
                                            <TableCell>Department</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {employees && employees.length > 0 ? (
                                            employees.map(e => (
                                                <TableRow key={e.emp_id} hover>
                                                    <TableCell>{e.emp_id}</TableCell>
                                                    <TableCell>{e.emp_name}</TableCell>
                                                    <TableCell>{e.email}</TableCell>
                                                    <TableCell>
                                                        <Chip label={e.role} size="small" variant="outlined" />
                                                    </TableCell>
                                                    <TableCell>{e.skills || '-'}</TableCell>
                                                    <TableCell>{e.experience ? `${e.experience} years` : '-'}</TableCell>
                                                    <TableCell>{e.dept || '-'}</TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={7} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                                                    No employees found
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}
                    </Box>
                )}

                {tab === 1 && (
                    <Box sx={{ animation: 'slideUp 0.4s ease-out' }}>
                        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', gap: 2, mb: 3 }}>
                            <Button 
                                onClick={() => setOpenAssign(true)} 
                                variant="contained"
                                startIcon={<AssignmentIcon />}
                            >
                                Create Assignment
                            </Button>
                            <Button 
                                onClick={fetchAssignments} 
                                variant="outlined"
                                disabled={loadingAssignments}
                                startIcon={<RefreshIcon className={loadingAssignments ? 'animate-spin' : ''} />}
                            >
                                Refresh
                            </Button>
                        </Box>
                        
                        {loadingAssignments && !assignments ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 256 }}>
                                <LoadingSpinner size="lg" />
                            </Box>
                        ) : (
                            <TableContainer component={Paper} variant="outlined">
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Employee</TableCell>
                                            <TableCell>Project</TableCell>
                                            <TableCell>Assigned At</TableCell>
                                            <TableCell>Hours Allotted</TableCell>
                                            <TableCell>Status</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {assignments && assignments.length > 0 ? (
                                            assignments.map(a => (
                                                <TableRow key={a.assign_id} hover>
                                                    <TableCell fontWeight="medium">{a.emp_name}</TableCell>
                                                    <TableCell>{a.project_name}</TableCell>
                                                    <TableCell>{new Date(a.assigned_at).toLocaleDateString()}</TableCell>
                                                    <TableCell>{a.allotted_hours}h</TableCell>
                                                    <TableCell>
                                                        <Chip 
                                                            label={a.is_completed ? 'Completed' : 'Pending'}
                                                            color={a.is_completed ? 'success' : 'warning'}
                                                            size="small"
                                                        />
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
                    </Box>
                )}

                {/* Add Employee Dialog */}
                <Dialog open={openEmp} onClose={() => setOpenEmp(false)} maxWidth="sm" fullWidth>
                    <DialogTitle>Add Employee</DialogTitle>
                    <DialogContent>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
                            <TextField
                                label="Name *"
                                value={empName}
                                onChange={e => setEmpName(e.target.value)}
                                placeholder="John Doe"
                                fullWidth
                            />
                            <TextField
                                label="Email *"
                                type="email"
                                value={empEmail}
                                onChange={e => setEmpEmail(e.target.value)}
                                placeholder="john@example.com"
                                fullWidth
                            />
                            <TextField
                                label="Password *"
                                type="password"
                                value={empPassword}
                                onChange={e => setEmpPassword(e.target.value)}
                                fullWidth
                            />
                            <TextField
                                label="Skills"
                                value={empSkills}
                                onChange={e => setEmpSkills(e.target.value)}
                                placeholder="Python, JavaScript, SQL"
                                fullWidth
                            />
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Experience (years)"
                                        type="number"
                                        inputProps={{ min: 0 }}
                                        value={empExperience}
                                        onChange={e => setEmpExperience(e.target.value)}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Department"
                                        value={empDept}
                                        onChange={e => setEmpDept(e.target.value)}
                                        placeholder="Engineering"
                                        fullWidth
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenEmp(false)} disabled={isSubmitting}>
                            Cancel
                        </Button>
                        <Button 
                            onClick={handleAddEmployee}
                            variant="contained"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <LoadingSpinner size="sm" />
                                    Adding...
                                </Box>
                            ) : (
                                'Add Employee'
                            )}
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Assign Dialog */}
                <Dialog open={openAssign} onClose={() => setOpenAssign(false)} maxWidth="sm" fullWidth>
                    <DialogTitle>Create Assignment</DialogTitle>
                    <DialogContent>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
                            <FormControl fullWidth>
                                <InputLabel>Employee</InputLabel>
                                <Select
                                    value={assignEmpId}
                                    onChange={e => setAssignEmpId(e.target.value)}
                                    label="Employee"
                                >
                                    {employees?.map(emp => (
                                        <MenuItem key={emp.emp_id} value={emp.emp_id.toString()}>
                                            {emp.emp_name} - {emp.email}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl fullWidth>
                                <InputLabel>Project</InputLabel>
                                <Select
                                    value={assignProjectId}
                                    onChange={e => setAssignProjectId(e.target.value)}
                                    label="Project"
                                >
                                    {projects?.map(proj => (
                                        <MenuItem key={proj.project_id} value={proj.project_id.toString()}>
                                            {proj.name} - {proj.client}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <TextField
                                label="Allotted Hours"
                                type="number"
                                inputProps={{ min: 1 }}
                                value={assignHours}
                                onChange={e => setAssignHours(e.target.value)}
                                fullWidth
                            />
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenAssign(false)} disabled={isSubmitting}>
                            Cancel
                        </Button>
                        <Button 
                            onClick={handleAssign}
                            variant="contained"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <LoadingSpinner size="sm" />
                                    Creating...
                                </Box>
                            ) : (
                                'Create Assignment'
                            )}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Layout>
    );
};

export default ManagerPage;
