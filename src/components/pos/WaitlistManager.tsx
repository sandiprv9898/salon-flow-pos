import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Clock, Phone, User, Calendar, Star, 
  CheckCircle, XCircle, Plus, AlertCircle
} from "lucide-react";
import { waitlistEntries, mockServices, mockEmployees } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";

interface WaitlistManagerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const WaitlistManager = ({ open, onOpenChange }: WaitlistManagerProps) => {
  const { toast } = useToast();
  const [entries, setEntries] = useState(waitlistEntries);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEntry, setNewEntry] = useState({
    customerName: "",
    phone: "",
    preferredService: "",
    preferredEmployee: "",
    preferredDate: "",
    timeFrame: "",
    priority: "normal"
  });

  const addToWaitlist = () => {
    if (!newEntry.customerName || !newEntry.phone || !newEntry.preferredService) {
      toast({
        title: "Missing Information",
        description: "Please fill in customer name, phone, and preferred service",
        variant: "destructive"
      });
      return;
    }

    const entry = {
      id: `w${entries.length + 1}`,
      ...newEntry
    };

    setEntries(prev => [...prev, entry]);
    setNewEntry({
      customerName: "",
      phone: "",
      preferredService: "",
      preferredEmployee: "",
      preferredDate: "",
      timeFrame: "",
      priority: "normal"
    });
    setShowAddForm(false);
    toast({
      title: "Added to Waitlist",
      description: `${newEntry.customerName} has been added to the waitlist`
    });
  };

  const removeFromWaitlist = (entryId: string) => {
    setEntries(prev => prev.filter(entry => entry.id !== entryId));
    toast({ title: "Removed from waitlist" });
  };

  const convertToAppointment = (entryId: string) => {
    const entry = entries.find(e => e.id === entryId);
    if (entry) {
      removeFromWaitlist(entryId);
      toast({
        title: "Appointment Scheduled",
        description: `${entry.customerName}'s appointment has been scheduled`
      });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'normal': return 'bg-blue-500';
      case 'low': return 'bg-gray-500';
      default: return 'bg-blue-500';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertCircle className="w-4 h-4" />;
      case 'normal': return <Clock className="w-4 h-4" />;
      case 'low': return <Clock className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Waitlist Manager
          </DialogTitle>
        </DialogHeader>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{entries.length}</div>
              <p className="text-xs text-muted-foreground">Total Waitlist</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-red-600">
                {entries.filter(e => e.priority === 'high').length}
              </div>
              <p className="text-xs text-muted-foreground">High Priority</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600">
                {entries.filter(e => e.preferredDate === new Date().toISOString().split('T')[0]).length}
              </div>
              <p className="text-xs text-muted-foreground">For Today</p>
            </CardContent>
          </Card>
        </div>

        {/* Add New Entry Button */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Waitlist Entries</h3>
          <Button onClick={() => setShowAddForm(!showAddForm)}>
            <Plus className="w-4 h-4 mr-2" />
            Add to Waitlist
          </Button>
        </div>

        {/* Add Form */}
        {showAddForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Add New Waitlist Entry</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Customer Name"
                  value={newEntry.customerName}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, customerName: e.target.value }))}
                />
                <Input
                  placeholder="Phone Number"
                  value={newEntry.phone}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, phone: e.target.value }))}
                />
                <Select
                  value={newEntry.preferredService}
                  onValueChange={(value) => setNewEntry(prev => ({ ...prev, preferredService: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Preferred Service" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockServices.map(service => (
                      <SelectItem key={service.id} value={service.name}>
                        {service.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={newEntry.preferredEmployee}
                  onValueChange={(value) => setNewEntry(prev => ({ ...prev, preferredEmployee: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Preferred Employee (Optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any Available</SelectItem>
                    {mockEmployees.map(employee => (
                      <SelectItem key={employee.id} value={employee.name}>
                        {employee.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  type="date"
                  value={newEntry.preferredDate}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, preferredDate: e.target.value }))}
                />
                <Select
                  value={newEntry.timeFrame}
                  onValueChange={(value) => setNewEntry(prev => ({ ...prev, timeFrame: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Time Preference" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">Morning (9AM-12PM)</SelectItem>
                    <SelectItem value="afternoon">Afternoon (12PM-4PM)</SelectItem>
                    <SelectItem value="evening">Evening (4PM-8PM)</SelectItem>
                    <SelectItem value="anytime">Anytime</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={newEntry.priority}
                  onValueChange={(value) => setNewEntry(prev => ({ ...prev, priority: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High Priority</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="low">Low Priority</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button onClick={addToWaitlist}>Add to Waitlist</Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Waitlist Entries */}
        <div className="space-y-4">
          {entries.map((entry) => (
            <Card key={entry.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold">{entry.customerName}</h4>
                      <Badge 
                        variant="outline" 
                        className={`${getPriorityColor(entry.priority)} text-white border-transparent`}
                      >
                        {getPriorityIcon(entry.priority)}
                        <span className="ml-1 capitalize">{entry.priority}</span>
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        <span>{entry.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4" />
                        <span>{entry.preferredService}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>{entry.preferredEmployee === 'any' ? 'Any Employee' : entry.preferredEmployee}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {entry.preferredDate ? new Date(entry.preferredDate).toLocaleDateString() : 'Flexible'} - {entry.timeFrame || 'Anytime'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button
                      size="sm"
                      onClick={() => convertToAppointment(entry.id)}
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Schedule
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => removeFromWaitlist(entry.id)}
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      Remove
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {entries.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No customers on the waitlist
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default WaitlistManager;