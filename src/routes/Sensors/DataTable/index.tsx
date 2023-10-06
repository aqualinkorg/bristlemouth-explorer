import React from 'react';
import {
  Box,
  Button,
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
import {
  mkConfig,
  generateCsv,
  download,
  ConfigOptions,
  CsvOutput,
} from 'export-to-csv';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

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
        <TableCell align="left">
          <Typography>{data.nodeId}</Typography>
        </TableCell>
        {extraColumns?.map((x) => (
          <TableCell align="left" key={`${x.sensor}_${x.key}`}>
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

const RoundedButton = styled(Button)(() => ({
  textTransform: 'none',
  borderRadius: '50px',
}));

interface NestedObject {
  [key: string]: NestedObject | number;
}

function flattenObject(obj: NestedObject): { [key: string]: number } {
  return Object.keys(obj).reduce(
    (acc, key) => {
      if (typeof obj[key] !== 'number') {
        const nestedObject = flattenObject(obj[key] as NestedObject);
        for (const nestedKey in nestedObject) {
          // eslint-disable-next-line fp/no-mutation
          acc[`${key}_${nestedKey}`] = nestedObject[nestedKey];
        }
      } else {
        // eslint-disable-next-line fp/no-mutation
        acc[key] = obj[key] as number;
      }
      return acc;
    },
    {} as { [key: string]: number },
  );
}

function transformToTableData(
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

function transformToCsv(
  data: SensorData[],
  csvConfig: Required<ConfigOptions>,
  decoderConfig?: DecoderConfig,
): CsvOutput {
  const csvData = data.reduce((acc, curr) => {
    const decodedData = decoderConfig
      ? decode({ decoderConfig, hexData: curr.value })
      : {};
    const newRow = {
      ...curr,
      ...flattenObject(decodedData),
    };

    return [...acc, newRow];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }, [] as Array<any>);

  return generateCsv(csvConfig)(csvData);
}

function DataTable() {
  const sensorData = useSelector(sensorDataSelector);
  const {
    spotterNodeId,
    timestampFormat,
    decoder,
    userDefinedDecoders,
    selectedSpotter,
    spotterDataStartDate,
    spotterDataEndDate,
  } = useSelector(settingsSelector);

  const decoderConfig = [...decoders, ...(userDefinedDecoders || [])].find(
    (x) => x.name === decoder,
  )?.config;

  const extraColumns = decoderConfig
    ?.map((x) => {
      const displayValues = x.struct.filter((y) => y.display);
      return displayValues.map((y) => ({ sensor: x.name, key: y.key }));
    })
    .flat();

  function downloadCsv() {
    const filename = `${selectedSpotter?.spotterId}_${DateTime.fromISO(
      spotterDataStartDate || '',
    ).toFormat('yyyy-MM-dd')}_${DateTime.fromISO(
      spotterDataEndDate || '',
    ).toFormat('yyyy-MM-dd')}`;
    const csvConfig = mkConfig({ useKeysAsHeaders: true, filename });

    const csv = transformToCsv(sensorData, csvConfig, decoderConfig);

    download(csvConfig)(csv);
  }

  return (
    <PaperContainer>
      <Stack gap="2rem" height="100%">
        <Stack direction="row" display="flex" justifyContent="space-between">
          <Typography variant="h6" fontWeight="bold">
            Data
          </Typography>

          <RoundedButton
            variant="outlined"
            disabled={sensorData.length === 0}
            startIcon={<FileDownloadIcon />}
            onClick={() => downloadCsv()}
          >
            Download CSV
          </RoundedButton>
        </Stack>

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
                <HeaderTableCell align="left">Node ID</HeaderTableCell>
                {extraColumns?.map((x) => (
                  <HeaderTableCell align="left">{`${x.sensor}_${x.key}`}</HeaderTableCell>
                ))}
              </TableRow>
            </StyledTableHead>
            <TableBody>
              {transformToTableData(
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
