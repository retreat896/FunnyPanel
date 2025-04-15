import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';

function Panels() {
  const [command, setCommand] = useState('');
  const [output, setOutput] = useState([]);

  const handleSend = () => {
    if (command.trim() === '') return;
    // Simulate command output
    setOutput((prev) => [...prev, `$ ${command}`, 'Command executed (simulation)']);
    setCommand('');
  };

  return (
    <Box>
      <h2>Panels Terminal</h2>
      <Paper
        variant="outlined"
        sx={{ background: '#111', color: '#0f0', minHeight: 200, p: 2, mb: 2, fontFamily: 'monospace' }}
      >
        {output.length === 0 ? (
          <div>Type a command below and press Send.</div>
        ) : (
          output.map((line, idx) => <div key={idx}>{line}</div>)
        )}
      </Paper>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          variant="outlined"
          size="small"
          fullWidth
          placeholder="Enter command..."
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
          InputProps={{ sx: { fontFamily: 'monospace', background: '#222', color: '#0f0' } }}
        />
        <Button variant="contained" onClick={handleSend}>Send</Button>
      </Box>
    </Box>
  );
}

export default Panels;
