"use client"

import { useEffect, useMemo, useState } from "react"
import { Home, ChevronRight, Search, Plus, Wrench, Car } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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

import {
  type MaintenanceTask,
  type MaintenanceTaskNote,
  listTasks,
  createTask,
  listNotes,
  addNote,
} from "@/lib/supabase/maintenance"

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

type SortField = "task" | "vehicle_label" | "due_date" | "assignee" | "severity" | "status"

export function MaintenanceContent() {
  // Data state
  const [tasks, setTasks] = useState<MaintenanceTask[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTask, setSelectedTask] = useState<MaintenanceTask | null>(null)

  // Notes state
  const [notes, setNotes] = useState<MaintenanceTaskNote[]>([])
  const [notesLoading, setNotesLoading] = useState(false)

  // Filters & sort
  const [severityFilter, setSeverityFilter] = useState<"all" | MaintenanceTask["severity"]>("all")
  const [statusFilter, setStatusFilter] = useState<"all" | MaintenanceTask["status"]>("all")
  const [vehicleFilter, setVehicleFilter] = useState<string | "all">("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [sortField, setSortField] = useState<SortField>("due_date")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  // Create task modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [newTask, setNewTask] = useState({
    task: "",
    vehicle_label: "",
    due_date: "",
    due_km: "" as string | number,
    severity: "Medium" as MaintenanceTask["severity"],
    assignee: "",
    description: "",
  })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  // Add note modal state
  const [isAddNoteOpen, setIsAddNoteOpen] = useState(false)
  const [noteText, setNoteText] = useState("")
  const [noteVisibility, setNoteVisibility] = useState<MaintenanceTaskNote["visibility"]>("Internal")
  const [noteError, setNoteError] = useState("")

  // Initial fetch
  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true)
        const data = await listTasks({ limit: 200 })
        setTasks(data)
        if (data.length) setSelectedTask(data[0])
      } catch (err: any) {
        console.error(err)
        toast({ title: "Failed to load tasks", description: err.message, variant: "destructive" })
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [])

  // Load notes for selected task
  useEffect(() => {
    const run = async () => {
      if (!selectedTask) return
      try {
        setNotesLoading(true)
        const data = await listNotes(selectedTask.id)
        setNotes(data)
      } catch (err: any) {
        console.error(err)
        toast({ title: "Failed to load notes", description: err.message, variant: "destructive" })
      } finally {
        setNotesLoading(false)
      }
    }
    run()
  }, [selectedTask])

  const vehicles = useMemo(() => {
    const vals = new Set<string>()
    tasks.forEach((t) => {
      if (t.vehicle_label) vals.add(t.vehicle_label)
    })
    return Array.from(vals)
  }, [tasks])

  const filteredTasks = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    let res = tasks.filter((t) => {
      if (severityFilter !== "all" && t.severity !== severityFilter) return false
      if (statusFilter !== "all" && t.status !== statusFilter) return false
      if (vehicleFilter !== "all" && (t.vehicle_label ?? "").indexOf(vehicleFilter) === -1) return false
      if (startDate && t.due_date < startDate) return false
      if (endDate && t.due_date > endDate) return false
      if (q) {
        const hay = `${t.task} ${t.assignee} ${t.vehicle_label ?? ""}`.toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })

    res.sort((a, b) => {
      let av: any = a[sortField]
      let bv: any = b[sortField]
      if (sortField === "due_date") {
        av = new Date(a.due_date).getTime()
        bv = new Date(b.due_date).getTime()
      }
      if (sortDirection === "asc") return av < bv ? -1 : av > bv ? 1 : 0
      return av > bv ? -1 : av < bv ? 1 : 0
    })

    return res
  }, [tasks, severityFilter, statusFilter, vehicleFilter, searchQuery, startDate, endDate, sortField, sortDirection])

  const handleSort = (field: SortField) => {
    if (sortField === field) setSortDirection((d) => (d === "asc" ? "desc" : "asc"))
    else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const validateForm = () => {
    const errors: Record<string, string> = {}
    if (!newTask.task.trim()) errors.task = "Task name is required"
    if (!newTask.vehicle_label.trim()) errors.vehicle_label = "Vehicle is required"
    if (!newTask.due_date) errors.due_date = "Due date is required"
    const km = typeof newTask.due_km === "string" ? parseInt(newTask.due_km) : newTask.due_km
    if (!km || km <= 0) errors.due_km = "Valid due kilometers required"
    if (!newTask.assignee.trim()) errors.assignee = "Assignee is required"
    if (!newTask.description.trim()) errors.description = "Description is required"
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleCreateTask = async () => {
    if (!validateForm()) return
    try {
      const km = typeof newTask.due_km === "string" ? parseInt(newTask.due_km) : newTask.due_km
      const created = await createTask({
        task: newTask.task,
        description: newTask.description,
        due_date: newTask.due_date,
        due_km: km,
        severity: newTask.severity,
        assignee: newTask.assignee,
        vehicle_label: newTask.vehicle_label,
      })
      setTasks((prev) => [created, ...prev])
      setSelectedTask(created)
      toast({ title: "Task Created", description: `"${newTask.task}" has been created.` })
      setIsCreateModalOpen(false)
      setNewTask({ task: "", vehicle_label: "", due_date: "", due_km: "", severity: "Medium", assignee: "", description: "" })
      setFormErrors({})
    } catch (err: any) {
      console.error(err)
      toast({ title: "Failed to create task", description: err.message, variant: "destructive" })
    }
  }

  const handleAddNote = async () => {
    if (!selectedTask) return
    if (!noteText.trim()) {
      setNoteError("Note is required")
      return
    }
    try {
      const created = await addNote({ task_id: selectedTask.id, content: noteText.trim(), visibility: noteVisibility })
      setNotes((prev) => [created, ...prev])
      toast({ title: "Note Added", description: "Internal note has been added to the task." })
      setIsAddNoteOpen(false)
      setNoteText("")
      setNoteError("")
    } catch (err: any) {
      console.error(err)
      toast({ title: "Failed to add note", description: err.message, variant: "destructive" })
    }
  }

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
                  value={newTask.vehicle_label}
                  onChange={(e) => setNewTask({ ...newTask, vehicle_label: e.target.value })}
                  placeholder="e.g., Toyota Corolla (ABC-123)"
                  className={formErrors.vehicle_label ? "border-red-500" : ""}
                />
                {formErrors.vehicle_label && (
                  <span className="text-sm text-red-500">{formErrors.vehicle_label}</span>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={newTask.due_date}
                    onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
                    className={formErrors.due_date ? "border-red-500" : ""}
                  />
                  {formErrors.due_date && <span className="text-sm text-red-500">{formErrors.due_date}</span>}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="dueKm">Due (km)</Label>
                  <Input
                    id="dueKm"
                    type="number"
                    value={newTask.due_km}
                    onChange={(e) => setNewTask({ ...newTask, due_km: e.target.value })}
                    placeholder="15000"
                    className={formErrors.due_km ? "border-red-500" : ""}
                  />
                  {formErrors.due_km && <span className="text-sm text-red-500">{formErrors.due_km}</span>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="severity">Severity</Label>
                  <Select value={newTask.severity} onValueChange={(value) => setNewTask({ ...newTask, severity: value as MaintenanceTask["severity"] })}>
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
                {formErrors.description && (
                  <span className="text-sm text-red-500">{formErrors.description}</span>
                )}
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
            <Select value={severityFilter} onValueChange={(v) => setSeverityFilter(v as any)}>
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
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
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
              <SelectTrigger className="w-[180px] h-10">
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
            <Input type="date" className="w-[140px] h-10" placeholder="Start Date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            <Input type="date" className="w-[140px] h-10" placeholder="End Date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
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
                      <th className="text-left p-2 cursor-pointer hover:bg-muted/50" onClick={() => handleSort("vehicle_label")}>
                        Vehicle {sortField === "vehicle_label" && (sortDirection === "asc" ? "↑" : "↓")}
                      </th>
                      <th className="text-left p-2 cursor-pointer hover:bg-muted/50" onClick={() => handleSort("due_date")}>
                        Due {sortField === "due_date" && (sortDirection === "asc" ? "↑" : "↓")}
                      </th>
                      <th className="text-left p-2">Severity</th>
                      <th className="text-left p-2">Status</th>
                      <th className="text-left p-2">Assignee</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={6} className="p-4 text-center text-sm text-muted-foreground">
                          Loading tasks...
                        </td>
                      </tr>
                    ) : filteredTasks.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-4 text-center text-sm text-muted-foreground">
                          No tasks found
                        </td>
                      </tr>
                    ) : (
                      filteredTasks.map((task) => (
                        <tr
                          key={task.id}
                          className={`border-b cursor-pointer hover:bg-muted/50 ${selectedTask?.id === task.id ? "bg-muted" : ""}`}
                          onClick={() => setSelectedTask(task)}
                        >
                          <td className="p-2 font-medium">{task.task}</td>
                          <td className="p-2 text-sm text-muted-foreground">{task.vehicle_label}</td>
                          <td className="p-2 text-sm">
                            <div>{task.due_date}</div>
                            <div className="text-xs text-muted-foreground">{task.due_km.toLocaleString()} km</div>
                          </td>
                          <td className="p-2">
                            <Badge className={`text-xs ${getSeverityColor(task.severity)}`}>{task.severity}</Badge>
                          </td>
                          <td className="p-2">
                            <Badge className={`text-xs ${getStatusColor(task.status)}`}>{task.status}</Badge>
                          </td>
                          <td className="p-2 text-sm">{task.assignee}</td>
                        </tr>
                      ))
                    )}
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
              {!selectedTask ? (
                <p className="text-sm text-muted-foreground">Select a task to view details</p>
              ) : (
                <>
                  {/* Description */}
                  <div>
                    <h4 className="font-medium mb-2">{selectedTask.task}</h4>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{selectedTask.description}</p>
                  </div>

                  {/* Vehicle Summary */}
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Car className="h-4 w-4" />
                      Vehicle
                    </h4>
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <p className="font-medium">{selectedTask.vehicle_label ?? "—"}</p>
                      <div className="grid grid-cols-2 gap-3 text-sm mt-2">
                        <div>
                          <div className="text-xs text-muted-foreground">Due Date</div>
                          <div>{selectedTask.due_date}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Due (km)</div>
                          <div>{selectedTask.due_km.toLocaleString()} km</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Severity</div>
                          <div>
                            <Badge className={`text-xs ${getSeverityColor(selectedTask.severity)}`}>
                              {selectedTask.severity}
                            </Badge>
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Status</div>
                          <div>
                            <Badge className={`text-xs ${getStatusColor(selectedTask.status)}`}>
                              {selectedTask.status}
                            </Badge>
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Assignee</div>
                          <div>{selectedTask.assignee}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Internal Notes */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Notes</h4>
                      <Button variant="outline" size="sm" onClick={() => setIsAddNoteOpen(true)}>
                        Add Note
                      </Button>
                    </div>
                    {notesLoading ? (
                      <p className="text-sm text-muted-foreground">Loading notes…</p>
                    ) : notes.length > 0 ? (
                      <div className="space-y-2">
                        {notes.map((note) => (
                          <div key={note.id} className="bg-muted/50 p-2 rounded text-sm">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{note.visibility}</span>
                              <span className="text-xs text-muted-foreground">{new Date(note.created_at).toLocaleString()}</span>
                            </div>
                            <div className="mt-1 whitespace-pre-wrap">{note.content}</div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No notes available</p>
                    )}
                  </div>
                </>
              )}
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
                <Select value={noteVisibility} onValueChange={(v) => setNoteVisibility(v as any)}>
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
            <Button onClick={handleAddNote} disabled={!selectedTask}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
