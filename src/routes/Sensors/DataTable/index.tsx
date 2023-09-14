import React from 'react';
import {
  Box,
  Collapse,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  styled,
} from '@mui/material';
import ExpandCircleDownIcon from '@mui/icons-material/ExpandCircleDown';

interface TableData {
  timestamp: string;
  nodeId: string;
  rawData: string;
}

interface RowProps {
  data: TableData;
}

function Row({ data }: RowProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? (
              <ExpandCircleDownIcon color="primary" fontSize="small" />
            ) : (
              <ExpandCircleDownIcon
                color="primary"
                fontSize="small"
                style={{ transform: 'rotate(180deg)' }}
              />
            )}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {data.timestamp}
        </TableCell>
        <TableCell align="right">{data.nodeId}</TableCell>
        <TableCell align="right">{data.rawData}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Extra Information
              </Typography>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

const PaperContainer = styled(Paper)(({ theme }) => ({
  width: '100vw',
  height: '60vh',
  margin: '1rem 0.5rem 0.5rem 0.5rem',
  padding: '1rem',
  borderRadius: theme.spacing(1),
}));

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  backgroundColor: theme.palette.grey[100],
  borderRadius: theme.spacing(1),
}));

const HeaderTableCell = styled(TableCell)(() => ({
  fontWeight: 'bold',
}));

const mockData: TableData[] = [
  {
    timestamp: '2023-09-14T00:00:00Z',
    nodeId: 'node001',
    rawData: '123.45',
  },
  {
    timestamp: '2023-09-14T12:30:00Z',
    nodeId: 'node002',
    rawData: '78.90',
  },
  {
    timestamp: '2023-09-14T16:15:00Z',
    nodeId: 'node003',
    rawData: '56.78',
  },
  {
    timestamp: '2023-09-15T08:45:00Z',
    nodeId: 'node001',
    rawData: '98.76',
  },
  {
    timestamp: '2023-09-15T18:20:00Z',
    nodeId: 'node002',
    rawData: '34.21',
  },
];

function DataTable() {
  return (
    <PaperContainer>
      <Stack gap="2rem">
        <Typography variant="h6" fontWeight="bold">
          Data
        </Typography>

        <TableContainer>
          <Table size="small">
            <StyledTableHead>
              <TableRow>
                <HeaderTableCell />
                <HeaderTableCell>Timestamp</HeaderTableCell>
                <HeaderTableCell align="right">Node_ID</HeaderTableCell>
                <HeaderTableCell align="right">Encoded value</HeaderTableCell>
              </TableRow>
            </StyledTableHead>
            <TableBody>
              {mockData.map((data) => (
                <Row key={`${data.timestamp}_${data.nodeId}`} data={data} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
    </PaperContainer>
  );
}

export default DataTable;
