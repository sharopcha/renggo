"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"
import { Search, Plus, Wrench, Clock, ChevronRight, Home, Car } from "lucide-react"

const maintenanceTasks = [
  {
    id: "M001",
    task: "Oil Change & Filter",
    vehicle: "Toyota Corolla (ABC-123)",
    dueDate: "2024-01-25",
    dueKm: 15000,
    severity: "Low",
    status: "Open",
    assignee: "Mike Johnson",
    description: "Regular oil change and filter replacement. Check fluid levels and tire pressure.",
    vehicleDetails: { make: "Toyota", model: "Corolla", year: 2022, license: "ABC-123" },
    timeline: [
      { date: "2024-01-15", action: "Task created", user: "System" },
      { date: "2024-01-16", action: "Assigned to Mike Johnson", user: "Admin" },
    ],
    notes: [],
  },
  {
    id: "M002",
    task: "Brake Pad Replacement",
    vehicle: "BMW X3 (XYZ-789)",
    dueDate: "2024-01-20",
    dueKm: 18000,
    severity: "High",
    status: "In Progress",
    assignee: "Sarah Wilson",
    description: "Front brake pads showing wear indicators. Immediate replacement required.",
    vehicleDetails: { make: "BMW", model: "X3", year: 2021, license: "XYZ-789" },
    timeline: [
      { date: "2024-01-10", action: "Task created", user: "System" },
      { date: "2024-01-12", action: "Started work", user: "Sarah Wilson" },
    ],
    notes: ["Ordered OEM brake pads", "Customer notified of timeline"],
  },
  {
    id: "M003",
    task: "Annual Safety Inspection",
    vehicle: "Volkswagen Golf (DEF-456)",
    dueDate: "2024-01-30",
    dueKm: 12500,
    severity: "Medium",
    status: "Open",
    assignee: "David Chen",
    description: "Comprehensive annual safety inspection including lights, brakes, and emissions.",
    vehicleDetails: { make: "Volkswagen", model: "Golf", year: 2023, license: "DEF-456" },
    timeline: [{ date: "2024-01-18", action: "Task scheduled", user: "System" }],
    notes: [],
  },
  {
    id: "M004",
    task: "Engine Diagnostic",
    vehicle: "Ford Focus (GHI-012)",
    dueDate: "2024-01-15",
    dueKm: 22000,
    severity: "High",
    status: "Open",
    assignee: "Mike Johnson",
    description: "Check engine light activated. Full diagnostic scan required.",
    vehicleDetails: { make: "Ford", model: "Focus", year: 2020, license: "GHI-012" },
    timeline: [
      { date: "2024-01-14", action: "Issue reported", user: "Customer" },
      { date: "2024-01-14", action: "Task created", user: "System" },
    ],
    notes: ["Customer reports rough idling"],
  },
  {
    id: "M005",
    task: "Tire Rotation",
    vehicle: "Nissan Qashqai (JKL-345)",
    dueDate: "2024-02-05",
    dueKm: 16000,
    severity: "Low",
    status: "Done",
    assignee: "David Chen",
    description: "Regular tire rotation and pressure check.",
    vehicleDetails: { make: "Nissan", model: "Qashqai", year: 2022, license: "JKL-345" },
    timeline: [{ date: "2024-01-10", action: "Task completed", user: "David Chen" }],
    notes: ["All tires in good condition"],
  },
  {
    id: "M006",
    task: "AC System Service",
    vehicle: "Mercedes Sprinter (MNO-678)",
    dueDate: "2024-02-10",
    dueKm: 25000,
    severity: "Medium",
    status: "Open",
    assignee: "Sarah Wilson",
    description: "Air conditioning system maintenance and refrigerant check.",
    vehicleDetails: { make: "Mercedes", model: "Sprinter", year: 2021, license: "MNO-678" },
    timeline: [{ date: "2024-01-20", action: "Task scheduled", user: "System" }],
    notes: [],
  },
  {
    id: "M007",
    task: "Transmission Service",
    vehicle: "Skoda Octavia (PQR-901)",
    dueDate: "2024-01-28",
    dueKm: 30000,
    severity: "Medium",
    status: "In Progress",
    assignee: "Mike Johnson",
    description: "Transmission fluid change and filter replacement.",
    vehicleDetails: { make: "Skoda", model: "Octavia", year: 2020, license: "PQR-901" },
    timeline: [{ date: "2024-01-25", action: "Work started", user: "Mike Johnson" }],
    notes: ["Transmission fluid slightly dark"],
  },
  {
    id: "M008",
    task: "Battery Replacement",
    vehicle: "Hyundai Tucson (STU-234)",
    dueDate: "2024-01-22",
    dueKm: 14000,
    severity: "High",
    status: "Open",
    assignee: "David Chen",
    description: "Battery showing signs of weakness. Replacement recommended.",
    vehicleDetails: { make: "Hyundai", model: "Tucson", year: 2022, license: "STU-234" },
    timeline: [{ date: "2024-01-21", action: "Battery test failed", user: "System" }],
    notes: ["Customer experiencing starting issues"],
  },
]

function getSeverityColor(severity: string) {
  switch (severity) {
    case "High":
      return "bg-red-100 text-red-800 border-red-200"
    case "Medium":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "Low":
      return "bg-green-100 text-green-800 border-green-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case "Done":
      return "bg-green-100 text-green-800 border-green-200"
    case "In Progress":
      return "bg-blue-100 text-blue-800 border-blue-200"
    case "Open":
      return "bg-gray-100 text-gray-800 border-gray-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

export function MaintenanceContent() {
  const [selectedTask, setSelectedTask] = useState(maintenanceTasks[0])
  const [severityFilter, setSeverityFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [vehicleFilter, setVehicleFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortField, setSortField] = useState("dueDate")
  const [sortDirection, setSortDirection] = useState("asc")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isAddNoteOpen, setIsAddNoteOpen] = useState(false)
  const [noteText, setNoteText] = useState("")
  const [noteVisibility, setNoteVisibility] = useState("Internal")
  const [noteError, setNoteError] = useState("")
  const [taskNotes, setTaskNotes] = useState<Record<string, string[]>>({})
  const [newTask, setNewTask] = useState({
    task: "",
    vehicle: "",
    dueDate: "",
    dueKm: "",
    severity: "Medium",
    assignee: "",
    description: "",
  })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  const filteredTasks = maintenanceTasks
    .filter((task) => {
      if (severityFilter !== "all" && task.severity !== severityFilter) return false
      if (statusFilter !== "all" && task.status !== statusFilter) return false
      if (vehicleFilter !== "all" && !task.vehicle.includes(vehicleFilter)) return false
      if (
        searchQuery &&
        !task.task.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !task.vehicle.toLowerCase().includes(searchQuery.toLowerCase())
      )
        return false
      return true
    })
    .sort((a, b) => {
      let aVal = a[sortField as keyof typeof a]
      let bVal = b[sortField as keyof typeof b]

      if (sortField === "dueDate") {
        aVal = new Date(a.dueDate).getTime()
        bVal = new Date(b.dueDate).getTime()
      }

      if (sortDirection === "asc") {
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0
      } else {
        return aVal > bVal ? -1 : aVal < bVal ? 1 : 0
      }
    })

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const validateForm = () => {
    const errors: Record<string, string> = {}

    if (!newTask.task.trim()) errors.task = "Task name is required"
    if (!newTask.vehicle.trim()) errors.vehicle = "Vehicle is required"
    if (!newTask.dueDate) errors.dueDate = "Due date is required"
    if (!newTask.dueKm || Number.parseInt(newTask.dueKm) <= 0) errors.dueKm = "Valid due kilometers required"
    if (!newTask.assignee.trim()) errors.assignee = "Assignee is required"
    if (!newTask.description.trim()) errors.description = "Description is required"

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleCreateTask = () => {
    if (validateForm()) {
      toast({
        title: "Task Created",
        description: `Maintenance task "${newTask.task}" has been created successfully.`,
      })
      setIsCreateModalOpen(false)
      setNewTask({
        task: "",
        vehicle: "",
        dueDate: "",
        dueKm: "",
        severity: "Medium",
        assignee: "",
        description: "",
      })
      setFormErrors({})
    }
  }

  const handleAddNote = () => {
    if (!noteText.trim()) {
      setNoteError("Note is required")
      return
    }

    const timestamp = new Date().toLocaleString()
    const newNote = `${noteText.trim()} • Added by Admin on ${timestamp}`

    setTaskNotes((prev) => ({
      ...prev,
      [selectedTask.id]: [...(prev[selectedTask.id] || []), newNote],
    }))

    toast({
      title: "Note Added",
      description: "Internal note has been added to the task.",
    })

    setIsAddNoteOpen(false)
    setNoteText("")
    setNoteError("")
  }

  const getCurrentTaskNotes = () => {
    return [...selectedTask.notes, ...(taskNotes[selectedTask.id] || [])]
  }

  const vehicles = Array.from(new Set(maintenanceTasks.map((task) => task.vehicle.split(" (")[0])))

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
        <Home className="h-4 w-4" />
        <span>Dashboard</span>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground">Maintenance</span>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Maintenance</h1>
          <p className="text-muted-foreground">Track and manage vehicle maintenance tasks</p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Task
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create Maintenance Task</DialogTitle>
              <DialogDescription>Schedule a new maintenance task for a vehicle in your fleet.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="task">Task Name</Label>
                <Input
                  id="task"
                  value={newTask.task}
                  onChange={(e) => setNewTask({ ...newTask, task: e.target.value })}
                  placeholder="e.g., Oil Change & Filter"
                  className={formErrors.task ? "border-red-500" : ""}
                />
                {formErrors.task && <span className="text-sm text-red-500">{formErrors.task}</span>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="vehicle">Vehicle</Label>
                <Input
                  id="vehicle"
                  value={newTask.vehicle}
                  onChange={(e) => setNewTask({ ...newTask, vehicle: e.target.value })}
                  placeholder="e.g., Toyota Corolla (ABC-123)"
                  className={formErrors.vehicle ? "border-red-500" : ""}
                />
                {formErrors.vehicle && <span className="text-sm text-red-500">{formErrors.vehicle}</span>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    className={formErrors.dueDate ? "border-red-500" : ""}
                  />
                  {formErrors.dueDate && <span className="text-sm text-red-500">{formErrors.dueDate}</span>}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="dueKm">Due (km)</Label>
                  <Input
                    id="dueKm"
                    type="number"
                    value={newTask.dueKm}
                    onChange={(e) => setNewTask({ ...newTask, dueKm: e.target.value })}
                    placeholder="15000"
                    className={formErrors.dueKm ? "border-red-500" : ""}
                  />
                  {formErrors.dueKm && <span className="text-sm text-red-500">{formErrors.dueKm}</span>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="severity">Severity</Label>
                  <Select
                    value={newTask.severity}
                    onValueChange={(value) => setNewTask({ ...newTask, severity: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="assignee">Assignee</Label>
                  <Input
                    id="assignee"
                    value={newTask.assignee}
                    onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
                    placeholder="Mike Johnson"
                    className={formErrors.assignee ? "border-red-500" : ""}
                  />
                  {formErrors.assignee && <span className="text-sm text-red-500">{formErrors.assignee}</span>}
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  placeholder="Detailed description of the maintenance task..."
                  className={formErrors.description ? "border-red-500" : ""}
                />
                {formErrors.description && <span className="text-sm text-red-500">{formErrors.description}</span>}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateTask}>Create Task</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-center gap-3 lg:gap-4">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[280px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search tasks by vehicle, plate, task, assignee"
                className="pl-10 h-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Severity Filter */}
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="w-[140px] h-10">
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severity</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px] h-10">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Open">Open</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Done">Done</SelectItem>
              </SelectContent>
            </Select>

            {/* Vehicle Filter */}
            <Select value={vehicleFilter} onValueChange={setVehicleFilter}>
              <SelectTrigger className="w-[140px] h-10">
                <SelectValue placeholder="Vehicle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Vehicles</SelectItem>
                {vehicles.map((vehicle) => (
                  <SelectItem key={vehicle} value={vehicle}>
                    {vehicle}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Date Range Filters */}
            <Input type="date" className="w-[140px] h-10" placeholder="Start Date" />
            <Input type="date" className="w-[140px] h-10" placeholder="End Date" />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Panel - Tasks Table */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Maintenance Tasks</CardTitle>
              <CardDescription>Click on a task to view details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2 cursor-pointer hover:bg-muted/50" onClick={() => handleSort("task")}>
                        Task {sortField === "task" && (sortDirection === "asc" ? "↑" : "↓")}
                      </th>
                      <th
                        className="text-left p-2 cursor-pointer hover:bg-muted/50"
                        onClick={() => handleSort("vehicle")}
                      >
                        Vehicle {sortField === "vehicle" && (sortDirection === "asc" ? "↑" : "↓")}
                      </th>
                      <th
                        className="text-left p-2 cursor-pointer hover:bg-muted/50"
                        onClick={() => handleSort("dueDate")}
                      >
                        Due {sortField === "dueDate" && (sortDirection === "asc" ? "↑" : "↓")}
                      </th>
                      <th className="text-left p-2">Severity</th>
                      <th className="text-left p-2">Status</th>
                      <th className="text-left p-2">Assignee</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTasks.map((task) => (
                      <tr
                        key={task.id}
                        className={`border-b cursor-pointer hover:bg-muted/50 ${selectedTask.id === task.id ? "bg-muted" : ""}`}
                        onClick={() => setSelectedTask(task)}
                      >
                        <td className="p-2 font-medium">{task.task}</td>
                        <td className="p-2 text-sm text-muted-foreground">{task.vehicle}</td>
                        <td className="p-2 text-sm">
                          <div>{task.dueDate}</div>
                          <div className="text-xs text-muted-foreground">{task.dueKm.toLocaleString()} km</div>
                        </td>
                        <td className="p-2">
                          <Badge className={`text-xs ${getSeverityColor(task.severity)}`}>{task.severity}</Badge>
                        </td>
                        <td className="p-2">
                          <Badge className={`text-xs ${getStatusColor(task.status)}`}>{task.status}</Badge>
                        </td>
                        <td className="p-2 text-sm">{task.assignee}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel - Task Details */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-5 w-5" />
                Task Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Description */}
              <div>
                <h4 className="font-medium mb-2">{selectedTask.task}</h4>
                <p className="text-sm text-muted-foreground">{selectedTask.description}</p>
              </div>

              {/* Vehicle Summary */}
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Car className="h-4 w-4" />
                  Vehicle
                </h4>
                <div className="bg-muted/50 p-3 rounded-lg">
                  <p className="font-medium">
                    {selectedTask.vehicleDetails.make} {selectedTask.vehicleDetails.model}
                  </p>
                  <p className="text-sm text-muted-foreground">Year: {selectedTask.vehicleDetails.year}</p>
                  <p className="text-sm text-muted-foreground">License: {selectedTask.vehicleDetails.license}</p>
                </div>
              </div>

              {/* Timeline */}
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Timeline
                </h4>
                <div className="space-y-2">
                  {selectedTask.timeline.map((event, index) => (
                    <div key={index} className="flex items-start gap-2 text-sm">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <div>
                        <p className="font-medium">{event.action}</p>
                        <p className="text-muted-foreground text-xs">
                          {event.date} • {event.user}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Internal Notes */}
              <div>
                <h4 className="font-medium mb-2">Internal Notes</h4>
                {getCurrentTaskNotes().length > 0 ? (
                  <div className="space-y-2">
                    {getCurrentTaskNotes().map((note, index) => (
                      <div key={index} className="bg-muted/50 p-2 rounded text-sm">
                        {note}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No notes available</p>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 w-full bg-transparent"
                  onClick={() => setIsAddNoteOpen(true)}
                >
                  Add Note
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add Note Dialog */}
      <Dialog open={isAddNoteOpen} onOpenChange={setIsAddNoteOpen}>
        <DialogContent className="sm:max-w-[480px] flex flex-col max-h-[85vh]">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>Add Note</DialogTitle>
          </DialogHeader>
          <div className="flex-1 min-h-0 overflow-y-auto py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="note">Note</Label>
                <Textarea
                  id="note"
                  value={noteText}
                  onChange={(e) => {
                    setNoteText(e.target.value)
                    if (noteError) setNoteError("")
                  }}
                  placeholder="Enter your note here..."
                  className={`min-h-[120px] resize-none ${noteError ? "border-red-500" : ""}`}
                />
                {noteError && <span className="text-sm text-red-500">{noteError}</span>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="visibility">Visibility</Label>
                <Select value={noteVisibility} onValueChange={setNoteVisibility}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Internal">Internal</SelectItem>
                    <SelectItem value="Public">Public</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter className="flex-shrink-0">
            <Button
              variant="outline"
              onClick={() => {
                setIsAddNoteOpen(false)
                setNoteText("")
                setNoteError("")
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleAddNote}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
