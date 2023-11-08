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
  TablePagination,
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
import { toast } from 'react-toastify';

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

const FormattedNumber = ({ n }: { n: number }) => {
  if (n > 10 * 9 - 1 || n < 1 - 10 * 9) {
    const exponentialForm = n.toExponential(4);
    const match = exponentialForm.match(/e[+-](\d+)/);
    const digits = match ? match[1] : '';

    return (
      <span>
        {exponentialForm.replace(/e[+-](\d+)/, ' x 10')}
        <sup>{digits}</sup>
      </span>
    );
  }
  return <>{n.toFixed(2)}</>;
};

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
          <Typography whiteSpace="nowrap" width="11rem">
            {data.timestamp}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography
            width="12rem"
            textOverflow="ellipsis"
            whiteSpace="nowrap"
            overflow="hidden"
          >
            {data.nodeId}
          </Typography>
        </TableCell>
        {extraColumns === undefined && (
          <TableCell>
            <Typography
              textOverflow="ellipsis"
              whiteSpace="nowrap"
              overflow="hidden"
              marginLeft="auto"
              maxWidth={`calc(100vw - 60rem)`}
            >
              {data.encodedData}
            </Typography>
          </TableCell>
        )}
        {extraColumns?.map((x) => (
          <TableCell key={`${x.sensor}_${x.key}`}>
            <Typography>
              {data.decodedData && (
                <FormattedNumber n={data.decodedData[x.sensor][x.key]} />
              )}
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
      ? decode({ decoderConfig, hexData: String(x.value) })
      : null,
    nodeId: x.bristlemouth_node_id || '',
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
      ? decode({ decoderConfig, hexData: String(curr.value) })
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
  const [tableData, setTableData] = React.useState<TableData[]>([]);
  const [rowsPerPage, setRowsPerPage] = React.useState(25);
  const [page, setPage] = React.useState(0);

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

    try {
      const csv = transformToCsv(sensorData, csvConfig, decoderConfig);
      download(csvConfig)(csv);
    } catch (error) {
      toast.warn('Could not use this decoder');
    }
  }

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  React.useEffect(() => {
    try {
      const newData = transformToTableData(
        sensorData,
        spotterNodeId || '',
        timestampFormat || 'utc',
        decoderConfig,
      );
      setTableData(newData);
    } catch {
      toast.warn('Could not use this decoder');
      setTableData([]);
    }
  }, [decoderConfig, sensorData, spotterNodeId, timestampFormat]);

  return (
    <PaperContainer>
      <Stack height="100%" justifyContent="space-between">
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

        <TableContainer style={{ height: '100%', marginTop: '1rem' }}>
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
                <HeaderTableCell>Node ID</HeaderTableCell>
                {extraColumns === undefined && (
                  <HeaderTableCell>Raw data</HeaderTableCell>
                )}
                {extraColumns?.map((x) => (
                  <HeaderTableCell
                    key={`${x.sensor}_${x.key}`}
                  >{`${x.sensor}_${x.key}`}</HeaderTableCell>
                ))}
              </TableRow>
            </StyledTableHead>
            <TableBody>
              {tableData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((data) => (
                  <Row
                    key={`${data.timestamp}_${data.nodeId}`}
                    data={data}
                    extraColumns={extraColumns}
                  />
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          style={{ minHeight: '52px' }}
          rowsPerPageOptions={[25, 50, 100]}
          count={tableData.length}
          rowsPerPage={rowsPerPage}
          component="div"
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Stack>
    </PaperContainer>
  );
}

export default DataTable;
