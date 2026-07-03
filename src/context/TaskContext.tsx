import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'

export type Task = {
  id: string
  title: string
  status: 'Pending' | 'Completed'
  due: string
  note: string
}

type TaskContextValue = {
  tasks: Task[]
  addTask: (task: Omit<Task, 'id'>) => void
  completeTask: (id: string) => void
}

const TaskContext = createContext<TaskContextValue | undefined>(undefined)

const initialTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Physics Problem Set',
    status: 'Pending',
    due: 'Oct 26',
    note: 'Complete chapter 7 questions',
  },
  {
    id: 'task-2',
    title: 'Chemistry Lab Report',
    status: 'Pending',
    due: 'Oct 28',
    note: 'Finish titration notes',
  },
  {
    id: 'task-3',
    title: 'Operating Systems Quiz',
    status: 'Completed',
    due: 'Oct 30',
    note: 'Reviewed process scheduling',
  },
  {
    id: 'task-4',
    title: 'Biology Revision',
    status: 'Pending',
    due: 'Nov 2',
    note: 'Go over cell structure',
  },
]

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)

  const addTask = (task: Omit<Task, 'id'>) => {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      ...task,
    }
    setTasks((current) => [newTask, ...current])
  }

  const completeTask = (id: string) => {
    setTasks((current) =>
      current.map((task) =>
        task.id === id
          ? {
              ...task,
              status: 'Completed',
            }
          : task,
      ),
    )
  }

  const value = useMemo(
    () => ({ tasks, addTask, completeTask }),
    [tasks],
  )

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>
}

export function useTasks() {
  const context = useContext(TaskContext)
  if (!context) {
    throw new Error('useTasks must be used within TaskProvider')
  }
  return context
}