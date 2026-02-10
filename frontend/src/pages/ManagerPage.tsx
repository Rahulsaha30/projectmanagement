import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useEmployeeStore } from '../stores/employeeStore';
import { useAssignmentStore } from '../stores/assignmentStore';
import { useProjectStore } from '../stores/projectStore';
import { useToast } from '../context/ToastContext';

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import LoadingSpinner from '../components/LoadingSpinner';
import { RefreshCw, UserPlus, FileText } from 'lucide-react';

const ManagerPage = () => {
    const { addToast } = useToast();
    const [tab, setTab] = useState("employees");
    const [openEmp, setOpenEmp] = useState(false);
    const [openAssign, setOpenAssign] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Zustand stores
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

    // New Employee Form
    const [empName, setEmpName] = useState('');
    const [empEmail, setEmpEmail] = useState('');
    const [empPassword, setEmpPassword] = useState('');
    const [empSkills, setEmpSkills] = useState('');
    const [empExperience, setEmpExperience] = useState('');
    const [empDept, setEmpDept] = useState('');
    
    // Assignment Form
    const [assignEmpId, setAssignEmpId] = useState('');
    const [assignProjectId, setAssignProjectId] = useState('');
    const [assignHours, setAssignHours] = useState('');

    // Load initial data
    useEffect(() => {
        fetchEmployees();
        fetchProjects();
    }, [fetchEmployees, fetchProjects]);

    // Fetch assignments when switching to assignments tab
    useEffect(() => {
        if (tab === 'assignments' && assignments.length === 0) {
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
            <div className="animate-fade-in space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold tracking-tight">Manager Dashboard</h1>
                </div>
                
                <Tabs value={tab} onValueChange={setTab} className="w-full space-y-6">
                    <TabsList className="grid w-full max-w-md grid-cols-2">
                        <TabsTrigger value="employees">Employees</TabsTrigger>
                        <TabsTrigger value="assignments">Assignments</TabsTrigger>
                    </TabsList>

                    <TabsContent value="employees" className="animate-slide-up space-y-4">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <Button onClick={() => setOpenEmp(true)} className="transition-all-smooth hover-lift w-full sm:w-auto">
                                <UserPlus className="mr-2 h-4 w-4" />
                                Add Employee
                            </Button>
                            <Button 
                                onClick={fetchEmployees} 
                                variant="outline" 
                                size="sm"
                                disabled={loadingEmployees}
                                className="transition-all-smooth w-full sm:w-auto"
                            >
                                <RefreshCw className={`mr-2 h-4 w-4 ${loadingEmployees ? 'animate-spin' : ''}`} />
                                Refresh
                            </Button>
                        </div>
                        
                        {loadingEmployees && !employees ? (
                            <div className="flex items-center justify-center h-64">
                                <LoadingSpinner size="lg" />
                            </div>
                        ) : (
                            <div className="rounded-lg border shadow-card overflow-hidden bg-card">
                                <div className="overflow-x-auto">
                                    <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>ID</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead>Skills</TableHead>
                                        <TableHead>Experience</TableHead>
                                        <TableHead>Department</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {employees && employees.length > 0 ? (
                                        employees.map(e => (
                                            <TableRow key={e.emp_id} className="hover-lift transition-all-smooth">
                                                <TableCell className="font-medium">{e.emp_id}</TableCell>
                                                <TableCell>{e.emp_name}</TableCell>
                                                <TableCell>{e.email}</TableCell>
                                                <TableCell>
                                                    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize transition-all-smooth">
                                                        {e.role}
                                                    </span>
                                                </TableCell>
                                                <TableCell>{e.skills || '-'}</TableCell>
                                                <TableCell>{e.experience ? `${e.experience} years` : '-'}</TableCell>
                                                <TableCell>{e.dept || '-'}                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                                                No employees found
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                )}
            </TabsContent>

            <TabsContent value="assignments" className="animate-slide-up space-y-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <Button onClick={() => setOpenAssign(true)} className="transition-all-smooth hover-lift w-full sm:w-auto">
                        <FileText className="mr-2 h-4 w-4" />
                        Create Assignment
                    </Button>
                    <Button 
                        onClick={fetchAssignments} 
                        variant="outline" 
                        size="sm"
                        disabled={loadingAssignments}
                        className="transition-all-smooth w-full sm:w-auto"
                    >
                        <RefreshCw className={`mr-2 h-4 w-4 ${loadingAssignments ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                </div>
                
                {loadingAssignments && !assignments ? (
                    <div className="flex items-center justify-center h-64">
                        <LoadingSpinner size="lg" />
                    </div>
                ) : (
                    <div className="rounded-lg border shadow-card overflow-hidden bg-card">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Employee</TableHead>
                                        <TableHead>Project</TableHead>
                                        <TableHead>Assigned At</TableHead>
                                        <TableHead>Hours Allotted</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {assignments && assignments.length > 0 ? (
                                        assignments.map(a => (
                                            <TableRow key={a.assign_id} className="hover-lift transition-all-smooth">
                                                <TableCell className="font-medium">{a.emp_name}</TableCell>
                                                <TableCell>{a.project_name}</TableCell>
                                                <TableCell>{new Date(a.assigned_at).toLocaleDateString()}</TableCell>
                                                <TableCell>{a.allotted_hours}h</TableCell>
                                                <TableCell>
                                                    {a.is_completed ? (
                                                        <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold border-transparent bg-green-500 text-white transition-all-smooth">
                                                            Completed
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold border-transparent bg-yellow-500 text-white transition-all-smooth">
                                                            Pending
                                                        </span>
                                                    )}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                                        No assignments found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        )}
    </TabsContent>
</Tabs>

            {/* Add Employee Dialog */}
            <Dialog open={openEmp} onOpenChange={setOpenEmp}>
                <DialogContent className="max-w-md animate-scale-in sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Add Employee</DialogTitle>
                        <DialogDescription>Add a new employee to the system.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="empName">Name *</Label>
                            <Input 
                                id="empName" 
                                value={empName} 
                                onChange={e => setEmpName(e.target.value)}
                                placeholder="John Doe"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="empEmail">Email *</Label>
                            <Input 
                                id="empEmail" 
                                type="email" 
                                value={empEmail} 
                                onChange={e => setEmpEmail(e.target.value)}
                                placeholder="john@example.com"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="empPassword">Password *</Label>
                            <Input 
                                id="empPassword" 
                                type="password" 
                                value={empPassword} 
                                onChange={e => setEmpPassword(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="empSkills">Skills</Label>
                            <Input 
                                id="empSkills" 
                                value={empSkills} 
                                onChange={e => setEmpSkills(e.target.value)}
                                placeholder="Python, JavaScript, SQL"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="empExperience">Experience (years)</Label>
                                <Input 
                                    id="empExperience" 
                                    type="number"
                                    min="0"
                                    value={empExperience} 
                                    onChange={e => setEmpExperience(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="empDept">Department</Label>
                                <Input 
                                    id="empDept" 
                                    value={empDept} 
                                    onChange={e => setEmpDept(e.target.value)}
                                    placeholder="Engineering"
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button 
                            variant="outline" 
                            onClick={() => setOpenEmp(false)}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button 
                            onClick={handleAddEmployee}
                            disabled={isSubmitting}
                            className="transition-all-smooth"
                        >
                            {isSubmitting ? (
                                <>
                                    <LoadingSpinner size="sm" className="mr-2" />
                                    Adding...
                                </>
                            ) : (
                                'Add Employee'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Assign Dialog */}
            <Dialog open={openAssign} onOpenChange={setOpenAssign}>
                <DialogContent className="animate-scale-in sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Create Assignment</DialogTitle>
                        <DialogDescription>Assign an employee to a project.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="assignEmpId">Employee</Label>
                            <Select value={assignEmpId} onValueChange={setAssignEmpId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select employee" />
                                </SelectTrigger>
                                <SelectContent>
                                    {employees?.map(emp => (
                                        <SelectItem key={emp.emp_id} value={emp.emp_id.toString()}>
                                            {emp.emp_name} - {emp.email}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="assignProjectId">Project</Label>
                            <Select value={assignProjectId} onValueChange={setAssignProjectId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select project" />
                                </SelectTrigger>
                                <SelectContent>
                                    {projects?.map(proj => (
                                        <SelectItem key={proj.project_id} value={proj.project_id.toString()}>
                                            {proj.name} - {proj.client}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="assignHours">Allotted Hours</Label>
                            <Input 
                                id="assignHours" 
                                type="number" 
                                min="1"
                                value={assignHours} 
                                onChange={e => setAssignHours(e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button 
                            variant="outline" 
                            onClick={() => setOpenAssign(false)}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button 
                            onClick={handleAssign}
                            disabled={isSubmitting}
                            className="transition-all-smooth"
                        >
                            {isSubmitting ? (
                                <>
                                    <LoadingSpinner size="sm" className="mr-2" />
                                    Creating...
                                </>
                            ) : (
                                'Create Assignment'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            </div>
        </Layout>
    );
};

export default ManagerPage;
