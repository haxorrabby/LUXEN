import React, { useState } from 'react';
import { Box, Card, CardHeader, CardContent, TextField, Button, IconButton, Typography } from '@mui/material';
import { Close as CloseIcon, Send as SendIcon, Minimize as MinimizeIcon } from '@mui/icons-material';
import ApiService from '../../services/ApiService';

const ChatPanel = ({ onClose, isMinimized, onToggleMinimize }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (input.trim() === '') return;

    const newMessages = [...messages, { sender: 'user', text: input }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await ApiService.chatWithAI(input);
      setMessages([...newMessages, { sender: 'ai', text: response.reply }]);
    } catch (error) {
      setMessages([...newMessages, { sender: 'ai', text: 'Sorry, I am having trouble connecting. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card 
      sx={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        width: 350,
        height: isMinimized ? 'auto' : 500,
        zIndex: 1300,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CardHeader
        title="AI Assistant"
        action={
          <>
            <IconButton onClick={onToggleMinimize}>
              <MinimizeIcon />
            </IconButton>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </>
        }
      />
      {!isMinimized && (
        <>
          <CardContent sx={{ flex: 1, overflowY: 'auto' }}>
            {messages.map((msg, index) => (
              <Box key={index} sx={{ mb: 2, textAlign: msg.sender === 'user' ? 'right' : 'left' }}>
                <Typography 
                  variant="body2" 
                  sx={{
                    display: 'inline-block',
                    p: 1,
                    borderRadius: 2,
                    bgcolor: msg.sender === 'user' ? 'primary.main' : 'grey.300',
                    color: msg.sender === 'user' ? 'white' : 'black',
                  }}
                >
                  {msg.text}
                </Typography>
              </Box>
            ))}
            {isLoading && <Typography variant="body2">AI is thinking...</Typography>}
          </CardContent>
          <Box sx={{ p: 2, borderTop: '1px solid #ddd' }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Ask something..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              disabled={isLoading}
              InputProps={{
                endAdornment: (
                  <IconButton onClick={handleSend} disabled={isLoading}>
                    <SendIcon />
                  </IconButton>
                ),
              }}
            />
          </Box>
        </>
      )}
    </Card>
  );
};

export default ChatPanel;
