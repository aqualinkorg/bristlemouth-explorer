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
import { DecoderConfig, DecoderOutput, SensorData } from 'src/helpers/types';
import { settingsSelector } from 'src/store/settings/settingsSlice';
import { Settings } from 'src/store/settings/types';
import { DateTime } from 'luxon';
import { decode, decoders } from 'src/helpers/decoder';

interface TableData {
  timestamp: string;
  encodedData: string;
  decodedData: DecoderOutput | null;
  nodeId: string;
  rawJSON: string;
}

interface RowProps {
  data: TableData;
  extraColumns?: Array<{
    sensor: string;
    key: string;
  }>;
}

const StyledCode = styled('code')(() => ({
  whiteSpace: 'break-spaces',
  overflowWrap: 'anywhere',
}));

function Row({ data, extraColumns }: RowProps) {
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
          <Typography>{data.nodeId}</Typography>
        </TableCell>
        {extraColumns?.map((x) => (
          <TableCell align="right">
            <Typography>
              {data.decodedData && data.decodedData[x.sensor][x.key].toFixed(2)}
            </Typography>
          </TableCell>
        ))}
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
                  <Typography fontWeight="bold">Decoded Data:</Typography>
                  <StyledCode>
                    {JSON.stringify(data.decodedData, null, 2)}
                  </StyledCode>
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
  height: '100%',
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
  timestamp: Settings['timestampFormat'],
  decoderConfig?: DecoderConfig,
): TableData[] {
  const unique = [
    ...new Map(
      data.map((x) => [`${x.timestamp}${x.bristlemouth_node_id}`, x]),
    ).values(),
  ];

  const filteredByNodeId =
    nodeId === ''
      ? unique
      : unique.filter((x) => x.bristlemouth_node_id === nodeId);

  // eslint-disable-next-line fp/no-mutating-methods
  const orderedByTimestamp = filteredByNodeId.sort((a, b) => {
    if (a.timestamp > b.timestamp) return -1;
    else if (a.timestamp < b.timestamp) return 1;
    else return 0;
  });

  return orderedByTimestamp.map((x) => ({
    timestamp: String(
      timestamp === 'user'
        ? DateTime.fromISO(x.timestamp).toFormat('yyyy-MM-dd HH:mm:ss')
        : DateTime.fromISO(x.timestamp).toUTC().toFormat('yyyy-MM-dd HH:mm:ss'),
    ),
    encodedData: String(x.value),
    decodedData: decoderConfig
      ? decode({ decoderConfig, hexData: x.value })
      : null,
    nodeId: x.bristlemouth_node_id,
    rawJSON: JSON.stringify(x, null, 2),
  }));
}

function DataTable() {
  const sensorData = useSelector(sensorDataSelector);
  const { spotterNodeId, timestampFormat, decoder, userDefinedDecoders } =
    useSelector(settingsSelector);

  const decoderConfig = [...decoders, ...(userDefinedDecoders || [])].find(
    (x) => x.name === decoder,
  )?.config;

  const extraColumns = decoderConfig
    ?.map((x) => {
      const displayValues = x.struct.filter((y) => y.display);
      return displayValues.map((y) => ({ sensor: x.name, key: y.key }));
    })
    .flat();

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
                <HeaderTableCell>
                  Timestamp{' '}
                  {timestampFormat === 'utc'
                    ? 'UTC'
                    : DateTime.now().offsetNameShort}
                </HeaderTableCell>
                <HeaderTableCell align="right">Node ID</HeaderTableCell>
                {extraColumns?.map((x) => (
                  <HeaderTableCell align="right">{`${x.sensor}_${x.key}`}</HeaderTableCell>
                ))}
              </TableRow>
            </StyledTableHead>
            <TableBody>
              {transform(
                sensorData,
                spotterNodeId || '',
                timestampFormat || 'utc',
                decoderConfig,
              ).map((data) => (
                <Row
                  key={`${data.timestamp}_${data.nodeId}`}
                  data={data}
                  extraColumns={extraColumns}
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
