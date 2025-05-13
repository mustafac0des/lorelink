import { createPost } from '../functions/postService';

const cannedStory = `Once upon a time, in a land far away, there lived a hero who embarked on an epic adventure to discover hidden treasures and forge lifelong friendships.`;

// Append a message, and optionally simulate AI reply
export function addMessage({ draft, mode, setMessages, setDraft, setEditingId, setLoading }) {
  const id = Date.now();
  setMessages(prev => [...prev, { id, text: draft, sender: 'user', mode }]);
  setDraft(''); setEditingId(null);
  if (mode === 'ai') {
    setLoading(true);
    setTimeout(() => {
      setMessages(prev => [...prev, { id: Date.now(), text: cannedStory, sender: 'bot', mode: 'ai' }]);
      setLoading(false);
    }, 1000);
  }
}

// Load a message into edit state
export function handleEdit(msg, setDraft, setEditingId) {
  setEditingId(msg.id);
  setDraft(msg.text);
}

// Persist an edited message
export function handleUpdate({ draft, editingId, setMessages, setDraft, setEditingId }) {
  setMessages(prev => prev.map(m => m.id === editingId ? { ...m, text: draft } : m));
  setDraft(''); setEditingId(null);
}

// Send a single message to backend
export async function handlePost(id, messages) {
  const msg = messages.find(m => m.id === id);
  if (msg) await createPost({ postText: msg.text, isGenerated: msg.mode === 'ai', isEdited: false });
}

// Wrapper for send icon
export function handleSend(params) {
  addMessage(params);
}
