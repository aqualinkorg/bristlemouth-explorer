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
import { settingsSelector } from 'src/store/settings/settingsSlice';
import { Settings, SettingsState } from 'src/store/settings/types';
import { DateTime } from 'luxon';

interface TableData {
  timestamp: string;
  encodedData: string;
  decodedData: string;
  nodeId: string;
  rawJSON: string;
}

interface RowProps {
  data: TableData;
  timestampFormat: SettingsState['timestamp'];
}

const StyledCode = styled('code')(() => ({
  whiteSpace: 'break-spaces',
  overflowWrap: 'anywhere',
}));

function Row({ data, timestampFormat }: RowProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell width="2rem">
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
          <Typography whiteSpace="nowrap">{data.timestamp}</Typography>
        </TableCell>
        <TableCell align="right">
          <Typography
            whiteSpace="nowrap"
            maxWidth="12rem"
            overflow="hidden"
            textOverflow="ellipsis"
          >
            {data.encodedData}
          </Typography>
        </TableCell>
        <TableCell align="right">
          <Typography
            textOverflow="ellipsis"
            whiteSpace="nowrap"
            overflow="hidden"
            maxWidth={`calc(100vw - ${
              timestampFormat === 'utc' ? '63rem' : '65rem'
            })`}
          >
            {data.encodedData}
          </Typography>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell
          style={{
            paddingBottom: 0,
            paddingTop: 0,
            borderBottom: open ? undefined : 0,
          }}
          colSpan={6}
        >
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Stack gap="1rem">
                <Stack gap="0.5rem">
                  <Typography fontWeight="bold">Decoded value:</Typography>
                  <StyledCode>{data.decodedData}</StyledCode>
                </Stack>
                <Stack gap="0.5rem">
                  <Typography fontWeight="bold">Raw data:</Typography>
                  <StyledCode>{data.rawJSON}</StyledCode>
                </Stack>
              </Stack>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

const PaperContainer = styled(Paper)(({ theme }) => ({
  width: 'calc(100vw - 27rem)',
  height: '60vh',
  margin: '0.5rem',
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

function transform(
  data: SensorData[],
  nodeId: string,
  timestamp: Settings['timestamp'],
): TableData[] {
  const unique = [
    ...new Map(
      data.map((x) => [`${x.timestamp}${x.bristlemouth_node_id}`, x]),
    ).values(),
  ];

  const filtered =
    nodeId === ''
      ? unique
      : unique.filter((x) => x.bristlemouth_node_id === nodeId);

  return filtered.map((x) => ({
    timestamp: String(
      timestamp === 'user'
        ? DateTime.fromISO(x.timestamp).toISO()
        : DateTime.fromISO(x.timestamp).toUTC().toISO(),
    ),
    encodedData: String(x.value),
    decodedData: 'coming soon',
    nodeId: x.bristlemouth_node_id,
    rawJSON: JSON.stringify(x, null, 2),
  }));
}

function DataTable() {
  const sensorData = useSelector(sensorDataSelector);
  const { spotterNodeId, timestamp } = useSelector(settingsSelector);

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
                <HeaderTableCell width="2rem" />
                <HeaderTableCell>Timestamp</HeaderTableCell>
                <HeaderTableCell width="12rem" align="right">
                  Encoded value
                </HeaderTableCell>
                <HeaderTableCell align="right">Decoded value</HeaderTableCell>
              </TableRow>
            </StyledTableHead>
            <TableBody>
              {transform(
                sensorData,
                spotterNodeId || '',
                timestamp || 'utc',
              ).map((data) => (
                <Row
                  key={`${data.timestamp}_${data.nodeId}`}
                  timestampFormat={timestamp}
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
