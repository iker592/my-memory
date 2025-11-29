import { buildCombinedFileTree } from '@/lib/markdown';
import ChatInterface from '@/components/ChatInterface';

export default function Home() {
  const fileTree = buildCombinedFileTree();

  return <ChatInterface fileTree={fileTree} />;
}
