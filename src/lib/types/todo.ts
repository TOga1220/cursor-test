export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTodoRequest {
  title: string;
  description?: string;
}

export interface UpdateTodoRequest {
  title?: string;
  description?: string;
  completed?: boolean;
}

export interface TodoResponse {
  success: boolean;
  data?: Todo;
  error?: string;
}

export interface TodosResponse {
  success: boolean;
  data?: Todo[];
  error?: string;
} 