"use client";

import { useState, useEffect } from 'react';
import { Todo } from '@/lib/types/todo';
import TodoItem from './todo-item';
import TodoForm from './todo-form';

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  // todosを取得
  const fetchTodos = async () => {
    try {
      const response = await fetch('/api/todos');
      const data = await response.json();
      
      if (data.success) {
        setTodos(data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch todos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 新しいtodoを作成
  const handleCreateTodo = async (todoData: { title: string; description?: string }) => {
    setIsAdding(true);
    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(todoData),
      });

      const data = await response.json();
      
      if (data.success && data.data) {
        setTodos(prev => [data.data, ...prev]);
      }
    } catch (error) {
      console.error('Failed to create todo:', error);
    } finally {
      setIsAdding(false);
    }
  };

  // todoを更新
  const handleUpdateTodo = async (id: string, updates: Partial<Todo>) => {
    try {
      const response = await fetch('/api/todos', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, ...updates }),
      });

      const data = await response.json();
      
      if (data.success && data.data) {
        setTodos(prev => prev.map(todo => 
          todo.id === id ? data.data : todo
        ));
      }
    } catch (error) {
      console.error('Failed to update todo:', error);
    }
  };

  // todoを削除
  const handleDeleteTodo = async (id: string) => {
    try {
      const response = await fetch(`/api/todos?id=${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (data.success) {
        setTodos(prev => prev.filter(todo => todo.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete todo:', error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-gray-500">Loading todos...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <TodoForm onSubmit={handleCreateTodo} isLoading={isAdding} />
      
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Your Todos ({todos.length})
        </h3>
        
        {todos.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No todos yet. Add your first todo above!
          </div>
        ) : (
          <div className="space-y-3">
            {todos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onUpdate={handleUpdateTodo}
                onDelete={handleDeleteTodo}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 