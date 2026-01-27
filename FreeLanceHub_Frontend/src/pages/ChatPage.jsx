import { useState, useEffect, useRef } from 'react';
import { getCurrentUser, getUserChats, getChatMessages, sendMessage } from '../services/api';

export default function ChatPage() {
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef(null);
    const currentUser = getCurrentUser();

    // Fetch user chats on mount
    useEffect(() => {
        if (currentUser) {
            loadChats();
        }
    }, []);

    // Fetch messages when a chat is selected
    useEffect(() => {
        if (selectedChat) {
            loadMessages(selectedChat.id);
            // Optional: Polling for new messages
            const interval = setInterval(() => {
                loadMessages(selectedChat.id);
            }, 3000);
            return () => clearInterval(interval);
        }
    }, [selectedChat]);

    // Scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    async function loadChats() {
        try {
            const data = await getUserChats(currentUser.id);
            setChats(data);
            if (data.length > 0 && !selectedChat) {
                // Auto-select first chat if none selected? Or wait for user.
                // setSelectedChat(data[0]);
            }
        } catch (err) {
            console.error("Failed to load chats", err);
        } finally {
            setLoading(false);
        }
    }

    async function loadMessages(chatId) {
        try {
            const msgs = await getChatMessages(chatId);
            setMessages(msgs);
        } catch (err) {
            console.error("Failed to load messages", err);
        }
    }

    async function handleSend(e) {
        e.preventDefault();
        if (!newMessage.trim() || !selectedChat) return;

        try {
            await sendMessage(selectedChat.id, currentUser.id, newMessage);
            setNewMessage('');
            loadMessages(selectedChat.id); // Refresh immediately
        } catch (err) {
            console.error("Failed to send message", err);
            alert("Failed to send message");
        }
    }

    if (!currentUser) return <div style={{ padding: 20 }}>Please login to view messages.</div>;

    return (
        <div style={{
            display: 'flex',
            height: 'calc(100vh - 80px)', // Adjust for navbar
            maxWidth: '1400px',
            margin: '0 auto',
            background: 'white',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            marginTop: '20px'
        }}>
            {/* Sidebar: Chat List */}
            <div style={{
                width: '350px',
                borderRight: '1px solid #e5e7eb',
                background: '#f9fafb',
                display: 'flex',
                flexDirection: 'column'
            }}>
                <div style={{ padding: '20px', borderBottom: '1px solid #e5e7eb' }}>
                    <h2 style={{ margin: 0, fontSize: '1.25em', color: '#111827' }}>Messages</h2>
                </div>
                <div style={{ flex: 1, overflowY: 'auto' }}>
                    {loading && <div style={{ padding: 20 }}>Loading...</div>}
                    {!loading && chats.length === 0 && (
                        <div style={{ padding: 20, color: '#6b7280' }}>No active conversations.</div>
                    )}
                    {chats.map(chat => (
                        <div
                            key={chat.id}
                            onClick={() => setSelectedChat(chat)}
                            style={{
                                padding: '15px 20px',
                                cursor: 'pointer',
                                background: selectedChat?.id === chat.id ? 'white' : 'transparent',
                                borderLeft: selectedChat?.id === chat.id ? '4px solid #10b981' : '4px solid transparent',
                                borderBottom: '1px solid #e5e7eb'
                            }}
                        >
                            <div style={{ fontWeight: '600', color: '#111827', marginBottom: '4px' }}>
                                {chat.partnerName || "Unknown User"}
                            </div>
                            <div style={{ fontSize: '0.85em', color: '#6b7280' }}>
                                {chat.jobTitle}
                            </div>
                            <div style={{ fontSize: '0.9em', color: '#4b5563', marginTop: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {chat.lastMessage || "No messages yet"}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Area: Conversation */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                {selectedChat ? (
                    <>
                        {/* Header */}
                        <div style={{
                            padding: '20px',
                            borderBottom: '1px solid #e5e7eb',
                            background: 'white',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <div>
                                <h3 style={{ margin: 0, color: '#111827' }}>{selectedChat.partnerName}</h3>
                                <span style={{ fontSize: '0.9em', color: '#6b7280' }}>{selectedChat.jobTitle}</span>
                            </div>
                        </div>

                        {/* Messages */}
                        <div style={{ flex: 1, padding: '20px', overflowY: 'auto', background: '#f3f4f6' }}>
                            {messages.map((msg, index) => {
                                const isMe = msg.senderId === currentUser.id;
                                return (
                                    <div key={msg.id || index} style={{
                                        display: 'flex',
                                        justifyContent: isMe ? 'flex-end' : 'flex-start',
                                        marginBottom: '15px'
                                    }}>
                                        <div style={{
                                            maxWidth: '70%',
                                            padding: '12px 16px',
                                            borderRadius: '12px',
                                            background: isMe ? '#10b981' : 'white',
                                            color: isMe ? 'white' : '#1f2937',
                                            boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                                            borderBottomRightRadius: isMe ? '2px' : '12px',
                                            borderBottomLeftRadius: isMe ? '12px' : '2px'
                                        }}>
                                            <div>{msg.content}</div>
                                            <div style={{
                                                fontSize: '0.7em',
                                                marginTop: '4px',
                                                opacity: 0.8,
                                                textAlign: 'right'
                                            }}>
                                                {new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <form onSubmit={handleSend} style={{ padding: '20px', background: 'white', borderTop: '1px solid #e5e7eb', display: 'flex', gap: '10px' }}>
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Type a message..."
                                style={{
                                    flex: 1,
                                    padding: '12px',
                                    borderRadius: '8px',
                                    border: '1px solid #d1d5db',
                                    outline: 'none'
                                }}
                            />
                            <button
                                type="submit"
                                disabled={!newMessage.trim()}
                                style={{
                                    padding: '12px 24px',
                                    background: '#10b981',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    opacity: newMessage.trim() ? 1 : 0.6
                                }}
                            >
                                Send
                            </button>
                        </form>
                    </>
                ) : (
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>
                        Select a conversation to start chatting
                    </div>
                )}
            </div>
        </div>
    );
}
