import { buildFileTree } from '@/lib/markdown';
import ChatInterface from '@/components/ChatInterface';

export default function Home() {
  const fileTree = buildFileTree();

  return <ChatInterface fileTree={fileTree} />;
}
