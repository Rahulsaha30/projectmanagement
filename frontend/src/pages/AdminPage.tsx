import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useProjectStore } from '../stores/projectStore';
import { useToast } from '../context/ToastContext';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import LoadingSpinner from '../components/LoadingSpinner';
import { RefreshCw, Plus, BarChart3, FolderOpen, CheckCircle2, Clock } from 'lucide-react';

const AdminPage = () => {
    const { addToast } = useToast();
    const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Zustand store
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
    
    // New Project Form
    const [name, setName] = useState('');
    const [clientName, setClientName] = useState(''); 
    const [expectedHours, setExpectedHours] = useState('');
    const [endDate, setEndDate] = useState('');

    // Load initial data
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
            fetchStats(); // Refresh stats after creating
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
            fetchStats(); // Refresh stats after update
        } catch (error) {
            addToast({
                type: 'error',
                message: 'Failed to update project status'
            });
        }
    };

    return (
        <Layout>
            <div className="animate-fade-in space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
                    <Button 
                        onClick={() => {
                            fetchProjects();
                            fetchStats();
                        }} 
                        variant="outline" 
                        size="sm"
                        disabled={isLoadingProjects || isLoadingStats}
                        className="transition-all-smooth w-full sm:w-auto"
                    >
                        <RefreshCw className={`mr-2 h-4 w-4 ${(isLoadingProjects || isLoadingStats) ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                </div>
                
                {/* Stats Cards */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 animate-slide-up">
                {isLoadingStats ? (
                    Array.from({ length: 4 }).map((_, i) => (
                        <Card key={i} className="hover-lift transition-all-smooth">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Loading...</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <LoadingSpinner size="sm" />
                            </CardContent>
                        </Card>
                    ))
                ) : stats ? (
                    <>
                        <Card className="card-pulse hover-lift transition-all-smooth">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
                                <FolderOpen className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.total_projects}</div>
                            </CardContent>
                        </Card>
                        <Card className="card-pulse hover-lift transition-all-smooth">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
                                <Clock className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.active_projects}</div>
                            </CardContent>
                        </Card>
                        <Card className="card-pulse hover-lift transition-all-smooth">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                                <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.completed_projects}</div>
                            </CardContent>
                        </Card>
                        <Card className="card-pulse hover-lift transition-all-smooth">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
                                <BarChart3 className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.total_expected_hours}h</div>
                            </CardContent>
                        </Card>
                    </>
                ) : null}
            </div>

            {/* Projects Table */}
            <div className="space-y-4">
                <div className="flex justify-end">
                    <Button onClick={() => setOpen(true)} className="transition-all-smooth hover-lift w-full sm:w-auto">
                        <Plus className="mr-2 h-4 w-4" />
                        Create Project
                    </Button>
                </div>

                {isLoadingProjects && !projects ? (
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
                                <TableHead>Client</TableHead>
                                <TableHead>Expected Hours</TableHead>
                                <TableHead>Start Date</TableHead>
                                <TableHead>End Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {projects && projects.length > 0 ? (
                                projects.map(p => (
                                    <TableRow key={p.project_id} className="hover-lift transition-all-smooth">
                                        <TableCell className="font-medium">{p.project_id}</TableCell>
                                        <TableCell className="font-medium">{p.name}</TableCell>
                                        <TableCell>{p.client}</TableCell>
                                        <TableCell>{p.expected_hours || 0}h</TableCell>
                                        <TableCell>{new Date(p.start_date).toLocaleDateString()}</TableCell>
                                        <TableCell>{p.end_date ? new Date(p.end_date).toLocaleDateString() : '-'}</TableCell>
                                        <TableCell>
                                            {p.status ? (
                                                <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold border-transparent bg-green-500 text-white transition-all-smooth">
                                                    Active
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold border-transparent bg-gray-500 text-white transition-all-smooth">
                                                    Inactive
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleToggleStatus(p.project_id, p.status)}
                                                className="transition-all-smooth"
                                            >
                                                {p.status ? 'Deactivate' : 'Activate'}
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                                        No projects found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        )}
    </div>

    {/* Create Project Dialog */}
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md animate-scale-in sm:max-w-lg">
            <DialogHeader>
                <DialogTitle>Create New Project</DialogTitle>
                <DialogDescription>Add a new project to the system.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Project Name *</Label>
                            <Input 
                                id="name" 
                                value={name} 
                                onChange={e => setName(e.target.value)}
                                placeholder="Website Redesign"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="client">Client Name *</Label>
                            <Input 
                                id="client" 
                                value={clientName} 
                                onChange={e => setClientName(e.target.value)}
                                placeholder="Acme Corp"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="hours">Expected Hours</Label>
                            <Input 
                                id="hours" 
                                type="number"
                                min="0"
                                value={expectedHours} 
                                onChange={e => setExpectedHours(e.target.value)}
                                placeholder="160"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="endDate">End Date</Label>
                            <Input 
                                id="endDate" 
                                type="date"
                                value={endDate} 
                                onChange={e => setEndDate(e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button 
                            variant="outline" 
                            onClick={() => setOpen(false)}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button 
                            onClick={handleCreateProject}
                            disabled={isSubmitting}
                            className="transition-all-smooth"
                        >
                            {isSubmitting ? (
                                <>
                                    <LoadingSpinner size="sm" className="mr-2" />
                                    Creating...
                                </>
                            ) : (
                                'Create Project'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            </div>
        </Layout>
    );
};

export default AdminPage;
