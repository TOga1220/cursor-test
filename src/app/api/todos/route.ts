import { NextRequest, NextResponse } from 'next/server';
import { Todo, CreateTodoRequest, UpdateTodoRequest, TodoResponse, TodosResponse } from '@/lib/types/todo';

// 簡易的なインメモリストレージ（実際のプロジェクトではデータベースを使用）
let todos: Todo[] = [];
let nextId = 1;

// GET: すべてのtodosを取得
export async function GET(): Promise<NextResponse<TodosResponse>> {
  try {
    return NextResponse.json({
      success: true,
      data: todos
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch todos' },
      { status: 500 }
    );
  }
}

// POST: 新しいtodoを作成
export async function POST(request: NextRequest): Promise<NextResponse<TodoResponse>> {
  try {
    const body: CreateTodoRequest = await request.json();
    
    if (!body.title || body.title.trim() === '') {
      return NextResponse.json(
        { success: false, error: 'Title is required' },
        { status: 400 }
      );
    }

    const newTodo: Todo = {
      id: `todo-${nextId++}`,
      title: body.title.trim(),
      description: body.description?.trim(),
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    todos.push(newTodo);

    return NextResponse.json({
      success: true,
      data: newTodo
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create todo' },
      { status: 500 }
    );
  }
}

// PATCH: todoを更新
export async function PATCH(request: NextRequest): Promise<NextResponse<TodoResponse>> {
  try {
    const body: UpdateTodoRequest & { id: string } = await request.json();
    
    if (!body.id) {
      return NextResponse.json(
        { success: false, error: 'Todo ID is required' },
        { status: 400 }
      );
    }

    const todoIndex = todos.findIndex(todo => todo.id === body.id);
    
    if (todoIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Todo not found' },
        { status: 404 }
      );
    }

    const updatedTodo = {
      ...todos[todoIndex],
      ...(body.title !== undefined && { title: body.title.trim() }),
      ...(body.description !== undefined && { description: body.description.trim() }),
      ...(body.completed !== undefined && { completed: body.completed }),
      updatedAt: new Date()
    };

    todos[todoIndex] = updatedTodo;

    return NextResponse.json({
      success: true,
      data: updatedTodo
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update todo' },
      { status: 500 }
    );
  }
}

// DELETE: todoを削除
export async function DELETE(request: NextRequest): Promise<NextResponse<TodoResponse>> {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Todo ID is required' },
        { status: 400 }
      );
    }

    const todoIndex = todos.findIndex(todo => todo.id === id);
    
    if (todoIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Todo not found' },
        { status: 404 }
      );
    }

    const deletedTodo = todos[todoIndex];
    todos.splice(todoIndex, 1);

    return NextResponse.json({
      success: true,
      data: deletedTodo
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete todo' },
      { status: 500 }
    );
  }
} 