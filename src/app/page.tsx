import { redirect } from 'next/navigation';

export default function HomePage() {
  // ルートページにアクセスした際に、todoページにリダイレクト
  redirect('/todo');
} 