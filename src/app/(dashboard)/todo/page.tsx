import { Metadata } from 'next';
import TodoList from '@/components/features/todo/todo-list';

export const metadata: Metadata = {
  title: 'Todo | Dashboard',
  description: 'Manage your todos efficiently',
};

export default function TodoPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Todo Management
        </h1>
        
        <div className="bg-gray-50 rounded-lg p-6">
          <TodoList />
        </div>
      </div>
    </div>
  );
} 