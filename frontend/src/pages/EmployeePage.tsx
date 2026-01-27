import { useState, useCallback, useEffect } from 'react';
import Layout from '../components/Layout';
import { useAssignmentStore } from '../stores/assignmentStore';
import { useToast } from '../context/ToastContext';

import { Button } from "@/components/ui/button"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import LoadingSpinner from '../components/LoadingSpinner';
import { RefreshCw } from 'lucide-react';

const EmployeePage = () => {
    const { addToast } = useToast();
    const [openComplete, setOpenComplete] = useState(false);
    const [selectedAssignId, setSelectedAssignId] = useState<number | null>(null);
    const [hoursWorked, setHoursWorked] = useState(0);
    const [notes, setNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Zustand store
    const {
        myAssignments,
        isLoading,
        fetchMyAssignments,
        completeAssignment
    } = useAssignmentStore();

    // Load initial data
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
            <div className="animate-fade-in space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <h1 className="text-3xl font-bold tracking-tight">My Tasks</h1>
                    <Button 
                        onClick={fetchMyAssignments} 
                        variant="outline" 
                        size="sm"
                        disabled={isLoading}
                        className="transition-all-smooth w-full sm:w-auto"
                    >
                        <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                </div>
                
                {isLoading && !myAssignments ? (
                    <div className="flex items-center justify-center h-64">
                        <LoadingSpinner size="lg" />
                    </div>
                ) : (
                    <div className="rounded-lg border shadow-card animate-slide-up overflow-hidden bg-card">
                        <div className="overflow-x-auto">
                            <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Project</TableHead>
                                <TableHead>Assigned At</TableHead>
                                <TableHead>Allotted Hours</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {myAssignments && myAssignments.length > 0 ? (
                                myAssignments.map(a => (
                                    <TableRow key={a.assign_id} className="hover-lift transition-all-smooth">
                                        <TableCell className="font-medium">{a.project_name}</TableCell>
                                        <TableCell>{new Date(a.assigned_at).toLocaleDateString()}</TableCell>
                                        <TableCell>{a.allotted_hours}h</TableCell>
                                        <TableCell>
                                            {a.is_completed ? (
                                                <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-all-smooth border-transparent bg-green-500 text-white">
                                                    Completed
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-all-smooth border-transparent bg-yellow-500 text-white">
                                                    Pending
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {!a.is_completed && (
                                                <Button size="sm" onClick={() => handleOpenComplete(a.assign_id)} className="transition-all-smooth hover-lift">
                                                    Complete
                                                </Button>
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

        <Dialog open={openComplete} onOpenChange={setOpenComplete}>
            <DialogContent className="animate-scale-in sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Complete Task</DialogTitle>
                    <DialogDescription>Submit your work details.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="hoursWorked">Hours Worked</Label>
                            <Input 
                                id="hoursWorked" 
                                type="number" 
                                min="0"
                                value={hoursWorked} 
                                onChange={e => setHoursWorked(Number(e.target.value))} 
                            />
                        </div>
                        <div className="space-y-2">
                             <Label htmlFor="notes">Completion Notes</Label>
                             <textarea 
                                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                id="notes" 
                                value={notes} 
                                onChange={e => setNotes(e.target.value)} 
                             />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button 
                            variant="outline" 
                            onClick={() => setOpenComplete(false)}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button 
                            onClick={handleComplete}
                            disabled={isSubmitting || hoursWorked <= 0}
                            className="transition-all-smooth"
                        >
                            {isSubmitting ? (
                                <>
                                    <LoadingSpinner size="sm" className="mr-2" />
                                    Submitting...
                                </>
                            ) : (
                                'Submit'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            </div>
        </Layout>
    );
};

export default EmployeePage;
