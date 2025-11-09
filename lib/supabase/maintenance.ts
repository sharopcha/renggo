import { createClient } from './client'
import type { Tables, TablesInsert } from './database.types'

export type MaintenanceTask = Tables<'maintenance_tasks'>
export type MaintenanceTaskNote = Tables<'maintenance_task_notes'>

export interface ListTasksOptions {
  search?: string
  severity?: MaintenanceTask['severity'] | 'all'
  status?: MaintenanceTask['status'] | 'all'
  vehicle?: string | 'all'
  startDate?: string
  endDate?: string
  sortField?: keyof Pick<MaintenanceTask, 'due_date' | 'task' | 'assignee' | 'severity' | 'status'>
  sortDirection?: 'asc' | 'desc'
  limit?: number
}

export async function listTasks(opts: ListTasksOptions = {}) {
  const supabase = createClient()
  const {
    search,
    severity = 'all',
    status = 'all',
    vehicle = 'all',
    startDate,
    endDate,
    sortField = 'due_date',
    sortDirection = 'asc',
    limit = 100,
  } = opts

  let q = supabase.from('maintenance_tasks').select('*').limit(limit)

  if (severity !== 'all') q = q.eq('severity', severity)
  if (status !== 'all') q = q.eq('status', status)
  if (vehicle !== 'all') q = q.ilike('vehicle_label', `%${vehicle}%`)
  if (startDate) q = q.gte('due_date', startDate)
  if (endDate) q = q.lte('due_date', endDate)
  if (search) {
    // Search across task, assignee, vehicle_label
    q = q.or(
      `task.ilike.%${search}%,assignee.ilike.%${search}%,vehicle_label.ilike.%${search}%`
    )
  }

  q = q.order(sortField, { ascending: sortDirection === 'asc' })

  const { data, error } = await q
  if (error) throw error
  return data as MaintenanceTask[]
}

export interface CreateTaskInput {
  task: string
  description: string
  due_date: string
  due_km: number
  severity: MaintenanceTask['severity']
  status?: MaintenanceTask['status']
  assignee: string
  vehicle_id?: string
  vehicle_label?: string
  organization_id?: string
}

export async function createTask(input: CreateTaskInput) {
  const supabase = createClient()
  const payload: TablesInsert<'maintenance_tasks'> = {
    task: input.task,
    description: input.description,
    due_date: input.due_date,
    due_km: input.due_km,
    severity: input.severity,
    status: input.status ?? 'Open',
    assignee: input.assignee,
    vehicle_id: input.vehicle_id,
    vehicle_label: input.vehicle_label,
    organization_id: input.organization_id,
  }
  const { data, error } = await (supabase.from('maintenance_tasks') as any)
    .insert(payload as any)
    .select('*')
    .single()
  if (error) throw error
  return data as MaintenanceTask
}

export async function listNotes(taskId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('maintenance_task_notes')
    .select('*')
    .eq('task_id', taskId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data as MaintenanceTaskNote[]
}

export interface AddNoteInput {
  task_id: string
  content: string
  visibility: MaintenanceTaskNote['visibility']
  created_by?: string | null
}

export async function addNote(input: AddNoteInput) {
  const supabase = createClient()
  const { data, error } = await (supabase.from('maintenance_task_notes') as any)
    .insert({
      task_id: input.task_id,
      content: input.content,
      visibility: input.visibility,
      created_by: input.created_by ?? null,
    } as any)
    .select('*')
    .single()
  if (error) throw error
  return data as MaintenanceTaskNote
}
