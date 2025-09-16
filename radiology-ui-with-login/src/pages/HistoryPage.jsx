import { Box, Typography, TextField, Select, MenuItem, FormControl, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip } from '@mui/material';

const mockHistory = [
  { id: 'SCAN-001', patientId: 'PAT-2025-001', date: '2025-09-12', time: '08:30', result: 'Normal', confidence: 92.3, status: 'Completed', radiologist: 'Dr. Smith' },
  { id: 'SCAN-002', patientId: 'PAT-2025-002', date: '2025-09-12', time: '07:45', result: 'Abnormal', confidence: 87.1, status: 'Under Review', radiologist: 'Dr. Johnson' },
  { id: 'SCAN-003', patientId: 'PAT-2025-003', date: '2025-09-12', time: '07:15', result: 'Normal', confidence: 95.7, status: 'Completed', radiologist: 'Dr. Brown' }
];

export default function HistoryPage() {
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h2" fontWeight={600}>
          Scan History
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            size="small"
            placeholder="Search by Patient ID..."
            sx={{ minWidth: 200 }}
          />
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <Select defaultValue="">
              <MenuItem value="">All Status</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
              <MenuItem value="Under Review">Under Review</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'action.hover' }}>
              <TableCell sx={{ fontWeight: 600 }}>Scan ID</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Patient ID</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Date & Time</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Result</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Confidence</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Radiologist</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mockHistory.map((row) => (
              <TableRow key={row.id} sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.patientId}</TableCell>
                <TableCell>{row.date} {row.time}</TableCell>
                <TableCell>
                  <Chip
                    label={row.result}
                    color={row.result === 'Normal' ? 'success' : 'error'}
                    size="small"
                  />
                </TableCell>
                <TableCell>{row.confidence}%</TableCell>
                <TableCell>
                  <Chip
                    label={row.status}
                    color={row.status === 'Completed' ? 'success' : 'warning'}
                    variant="outlined"
                    size="small"
                  />
                </TableCell>
                <TableCell>{row.radiologist}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
