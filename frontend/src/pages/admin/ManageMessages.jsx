import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Toast } from '../../components/Toast';
import { ConfirmModal } from '../../components/ConfirmModal';
import {
  MessageSquare,
  Mail,
  Trash2,
  CheckCircle,
  Eye,
  Reply,
  Loader2,
  Clock,
  User,
} from 'lucide-react';

export const ManageMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null, title: '' });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await api.getMessages();
      if (res.success) {
        setMessages(res.messages || []);
      }
    } catch (err) {
      showToast(err.message || 'Failed to fetch messages.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
  };

  const toggleReadStatus = async (msg) => {
    try {
      const res = await api.toggleMessageRead(msg.id, !msg.is_read);
      if (res.success) {
        showToast(msg.is_read ? 'Marked as unread' : 'Marked as read');
        setMessages((prev) =>
          prev.map((m) => (m.id === msg.id ? { ...m, is_read: !m.is_read } : m))
        );
      }
    } catch (err) {
      showToast(err.message || 'Failed to update message status.', 'error');
    }
  };

  const confirmDelete = async () => {
    if (!deleteModal.id) return;
    try {
      setSaving(true);
      await api.deleteMessage(deleteModal.id);
      showToast('Message deleted successfully.');
      setMessages((prev) => prev.filter((m) => m.id !== deleteModal.id));
    } catch (err) {
      showToast(err.message || 'Failed to delete message.', 'error');
    } finally {
      setSaving(false);
      setDeleteModal({ open: false, id: null, title: '' });
    }
  };

  if (loading && messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-900" />
        <p className="text-xs font-mono text-zinc-500">Loading messages...</p>
      </div>
    );
  }

  const unreadCount = messages.filter((m) => !m.is_read).length;

  return (
    <div className="space-y-8 animate-fade-in">
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ show: false, message: '', type: 'success' })}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.open}
        title="Delete Message"
        message={`Are you sure you want to delete message from "${deleteModal.title}"?`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteModal({ open: false, id: null, title: '' })}
        loading={saving}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-zinc-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950">
            Contact Messages
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Inquiries and proposals received from your portfolio contact form.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-zinc-900 text-white">
            {messages.length} Total
          </span>
          {unreadCount > 0 && (
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200">
              {unreadCount} Unread
            </span>
          )}
        </div>
      </div>

      {/* Messages List */}
      <div className="space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-6 rounded-2xl border transition-all ${
              msg.is_read
                ? 'bg-white border-zinc-200 hover:border-zinc-300'
                : 'bg-zinc-50/80 border-zinc-300 shadow-2xs'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-zinc-100">
              <div className="flex items-center space-x-3">
                <div
                  className={`w-3 h-3 rounded-full flex-shrink-0 ${
                    msg.is_read ? 'bg-zinc-300' : 'bg-emerald-500 animate-pulse'
                  }`}
                  title={msg.is_read ? 'Read' : 'New Unread'}
                ></div>
                <div>
                  <h3 className="font-bold text-base text-zinc-950">{msg.name}</h3>
                  <a
                    href={`mailto:${msg.email}`}
                    className="text-xs font-medium text-zinc-600 hover:underline"
                  >
                    {msg.email}
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-2 self-end sm:self-auto">
                <span className="text-[11px] font-mono text-zinc-400 mr-2">
                  {new Date(msg.created_at).toLocaleString()}
                </span>

                <button
                  onClick={() => toggleReadStatus(msg)}
                  className="px-2.5 py-1.5 text-xs font-medium text-zinc-700 bg-zinc-100 hover:bg-zinc-200 rounded-lg transition-colors flex items-center space-x-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{msg.is_read ? 'Mark Unread' : 'Mark Read'}</span>
                </button>

                <a
                  href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject || 'Portfolio Inquiry')}`}
                  className="px-2.5 py-1.5 text-xs font-medium text-white bg-zinc-900 hover:bg-black rounded-lg transition-colors flex items-center space-x-1"
                >
                  <Reply className="w-3.5 h-3.5" />
                  <span>Reply</span>
                </a>

                <button
                  onClick={() =>
                    setDeleteModal({
                      open: true,
                      id: msg.id,
                      title: msg.name,
                    })
                  }
                  className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete message"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="pt-3 space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 font-mono">
                Subject: {msg.subject || 'No Subject'}
              </p>
              <p className="text-sm text-zinc-700 whitespace-pre-wrap leading-relaxed mt-2 bg-zinc-50/50 p-4 rounded-xl border border-zinc-100">
                {msg.message}
              </p>
            </div>
          </div>
        ))}

        {messages.length === 0 && (
          <div className="p-12 text-center text-zinc-400 bg-zinc-50 rounded-2xl border border-zinc-200">
            No contact submissions yet. Incoming form submissions will appear here.
          </div>
        )}
      </div>
    </div>
  );
};
