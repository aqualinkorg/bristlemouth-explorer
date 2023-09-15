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
import { useSelector } from 'react-redux';
import { sensorDataSelector } from 'src/store/spotters/spottersSlice';
import { SensorData } from 'src/helpers/types';

interface TableData {
  timestamp: string;
  sensorPosition: string;
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
              <ExpandCircleDownIcon
                color="primary"
                fontSize="small"
                style={{ transform: 'rotate(180deg)' }}
              />
            ) : (
              <ExpandCircleDownIcon color="primary" fontSize="small" />
            )}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {data.timestamp}
        </TableCell>
        <TableCell align="right">{data.sensorPosition}</TableCell>
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

function transform(data: SensorData[]): TableData[] {
  return data.map((x) => ({
    timestamp: x.timestamp,
    sensorPosition: String(x.sensorPosition),
    rawData: x.value as string,
  }));
}

function DataTable() {
  const sensorData = useSelector(sensorDataSelector);

  return (
    <PaperContainer>
      <Stack gap="2rem" height="100%">
        <Typography variant="h6" fontWeight="bold">
          Data
        </Typography>

        <TableContainer>
          <Table size="small" stickyHeader>
            <StyledTableHead>
              <TableRow>
                <HeaderTableCell />
                <HeaderTableCell>Timestamp</HeaderTableCell>
                <HeaderTableCell align="right">Sensor Position</HeaderTableCell>
                <HeaderTableCell align="right">Encoded value</HeaderTableCell>
              </TableRow>
            </StyledTableHead>
            <TableBody>
              {transform(sensorData).map((data) => (
                <Row
                  key={`${data.timestamp}_${data.sensorPosition}`}
                  data={data}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
    </PaperContainer>
  );
}

export default DataTable;
