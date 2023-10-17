import React from 'react';
import {
  Autocomplete,
  Button,
  FormControl,
  Link,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  styled,
} from '@mui/material';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { useSelector } from 'react-redux';
import {
  sensorDataRequest,
  sensorDataSelector,
  spottersListSelector,
} from 'src/store/spotters/spottersSlice';
import { Spotter } from 'src/helpers/types';
import { DateTime } from 'luxon';
import { useAppDispatch } from 'src/store/hooks';
import {
  setSettings,
  settingsSelector,
} from 'src/store/settings/settingsSlice';
import { decoders } from 'src/helpers/decoder';
import AddDecoderDialog from './AddDecoderDialog';

const PaperContainer = styled(Paper)(({ theme }) => ({
  width: '20rem',
  height: '100%',
  margin: '0.5rem 0.5rem 0.5rem 1rem',
  padding: '1rem',
  flexShrink: 0,
  borderRadius: theme.spacing(1),
}));

const StyledButton = styled(Button)(() => ({
  textTransform: 'none',
  borderRadius: '50px',
}));

function SensorSelector() {
  const dispatch = useAppDispatch();

  const spottersList = useSelector(spottersListSelector);
  const appSettings = useSelector(settingsSelector);
  const sensorData = useSelector(sensorDataSelector);

  const [timestampFormat, setTimestampFormat] = React.useState<'user' | 'utc'>(
    appSettings.timestampFormat || 'utc',
  );
  const [startDate, setStartDate] = React.useState<DateTime | null>(
    appSettings.spotterDataStartDate
      ? DateTime.fromISO(appSettings.spotterDataStartDate)
      : DateTime.now().minus({ month: 1 }),
  );
  const [endDate, setEndDate] = React.useState<DateTime | null>(
    appSettings.spotterDataEndDate
      ? DateTime.fromISO(appSettings.spotterDataEndDate)
      : DateTime.now(),
  );
  const [selectedSpotter, setSelectedSpotter] = React.useState<Spotter | null>(
    appSettings.selectedSpotter || null,
  );
  const [availableNodeIds, setAvailableNodeIds] = React.useState<string[]>([]);
  const [nodeId, setNodeId] = React.useState<string>('');
  const [decoder, setDecoder] = React.useState<string>(
    appSettings.decoder || '',
  );
  const [decoderDialogOpen, setDecoderDialogOpen] =
    React.useState<boolean>(false);

  const decoderOptions = [
    ...decoders,
    ...(appSettings.userDefinedDecoders || []),
  ];

  const handleChangeSpotter = (spotterId: string) => {
    const spotter = spottersList.find((x) => x.spotterId === spotterId);
    if (spotter) setSelectedSpotter(spotter);
  };

  async function handleRefresh(updateSettings: boolean) {
    if (selectedSpotter?.spotterId && appSettings.sofarApiToken)
      dispatch(
        sensorDataRequest({
          token: appSettings.sofarApiToken,
          spotterId: selectedSpotter.spotterId,
          startDate: startDate?.startOf('day').toISO() || undefined,
          endDate: endDate?.endOf('day').toISO() || undefined,
        }),
      );

    if (updateSettings)
      dispatch(
        setSettings({
          timestampFormat,
          spotterDataStartDate: startDate?.toISO(),
          spotterDataEndDate: endDate?.toISO(),
          selectedSpotter,
          spotterNodeId:
            appSettings.selectedSpotter?.spotterId ===
            selectedSpotter?.spotterId
              ? appSettings.spotterNodeId
              : null,
          decoder,
        }),
      );
  }

  // automatically fetch information on first render
  React.useEffect(() => {
    handleRefresh(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (selectedSpotter === null && spottersList.length !== 0) {
      setSelectedSpotter(spottersList[0]);
    }
  }, [setSelectedSpotter, selectedSpotter, spottersList]);

  React.useEffect(() => {
    if (sensorData.length === 0) return;

    const uniqueNodeIds = [
      ...new Map(sensorData.map((x) => [x.bristlemouth_node_id, null])).keys(),
    ];

    const filtered = uniqueNodeIds.filter((x): x is string => x !== undefined);

    setAvailableNodeIds(filtered);
  }, [sensorData]);

  /**
   * Initialize the 'nodeId' after obtaining 'availableNodeIds' to prevent
   * MUI warnings related to out-of-range values for the 'Select' component.
   */
  React.useEffect(() => {
    if (availableNodeIds.length === 0) return;
    const node = availableNodeIds.find((x) => x === appSettings.spotterNodeId);
    if (node !== undefined) setNodeId(node);
    else if (appSettings.spotterNodeId !== '') setNodeId(availableNodeIds[0]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [availableNodeIds]);

  return (
    <LocalizationProvider dateAdapter={AdapterLuxon}>
      <AddDecoderDialog
        open={decoderDialogOpen}
        onClose={() => setDecoderDialogOpen(false)}
      />
      <PaperContainer>
        <Stack justifyContent="space-between" height="100%" overflow="auto">
          <Stack gap="1.5rem">
            <Stack gap="0.5rem">
              <Typography fontWeight="bold">SPOT ID</Typography>
              <FormControl size="small">
                <Autocomplete
                  options={spottersList.map((x) => x.spotterId)}
                  value={
                    spottersList.length > 0 ? selectedSpotter?.spotterId : ''
                  }
                  onChange={(_e, val) => handleChangeSpotter(val || '')}
                  renderInput={(params) => <TextField {...params} />}
                />
              </FormControl>
            </Stack>

            <Stack gap="0.5rem">
              <Typography fontWeight="bold">Date range</Typography>
              <Stack direction="row" justifyContent="space-between" gap="1rem">
                <Stack>
                  <Typography>Start date</Typography>
                  <DatePicker
                    maxDate={endDate}
                    slotProps={{ textField: { size: 'small' } }}
                    disabled={spottersList.length === 0}
                    timezone="UTC"
                    value={startDate}
                    onChange={(newValue) => setStartDate(newValue)}
                  />
                </Stack>
                <Stack>
                  <Typography>End date</Typography>
                  <DatePicker
                    minDate={startDate}
                    slotProps={{ textField: { size: 'small' } }}
                    disabled={spottersList.length === 0}
                    timezone="UTC"
                    value={endDate}
                    onChange={(newValue) => setEndDate(newValue)}
                  />
                </Stack>
              </Stack>
            </Stack>

            <Stack gap="0.5rem">
              <Typography fontWeight="bold">Node ID</Typography>
              <FormControl size="small">
                <Select
                  value={nodeId}
                  onChange={(e) => {
                    const { value } = e.target;
                    setNodeId(value);
                    dispatch(
                      setSettings({
                        spotterNodeId: value,
                      }),
                    );
                  }}
                >
                  <MenuItem value="">All nodes</MenuItem>
                  {availableNodeIds.map((x) => (
                    <MenuItem key={x} value={x}>
                      {x}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>

            <Stack gap="0.5rem">
              <Typography fontWeight="bold">Decoder</Typography>
              <Stack gap="1rem" direction="row" justifyContent="space-between">
                <FormControl size="small" fullWidth>
                  <Select
                    value={decoder}
                    onChange={(e) => {
                      const { value } = e.target;
                      setDecoder(value);
                      dispatch(
                        setSettings({
                          decoder: value,
                        }),
                      );
                    }}
                  >
                    <MenuItem value="">Unselect decoder</MenuItem>
                    {decoderOptions.map((x) => (
                      <MenuItem key={x.name} value={x.name}>
                        {x.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {/* hide add local decoder functionality for now */}
                {/* <IconButton
                  color="primary"
                  style={{ padding: '0 0.5rem 0 0.5rem' }}
                  onClick={() => setDecoderDialogOpen(true)}
                >
                  <AddCircleIcon style={{ fontSize: '2rem' }} />
                </IconButton> */}
              </Stack>
            </Stack>

            <Stack gap="0.5rem">
              <Typography fontWeight="bold">Timestamp</Typography>
              <ToggleButtonGroup
                exclusive
                value={timestampFormat}
                onChange={(_, val) => {
                  if (val) {
                    setTimestampFormat(val);
                    dispatch(
                      setSettings({
                        timestampFormat: val,
                      }),
                    );
                  }
                }}
              >
                <ToggleButton
                  selected={timestampFormat === 'user'}
                  value="user"
                >
                  User
                </ToggleButton>
                <ToggleButton selected={timestampFormat === 'utc'} value="utc">
                  UTC
                </ToggleButton>
              </ToggleButtonGroup>
            </Stack>

            <StyledButton
              disabled={
                !(selectedSpotter?.spotterId && appSettings.sofarApiToken)
              }
              variant="contained"
              onClick={() => handleRefresh(true)}
            >
              <Typography
                lineHeight="2rem"
                fontWeight="bold"
                color="white"
                height="2rem"
              >
                Refresh
              </Typography>
            </StyledButton>
          </Stack>
          <Link paddingTop="0.5rem" href="/">
            Change your API token
          </Link>
        </Stack>
      </PaperContainer>
    </LocalizationProvider>
  );
}

export default SensorSelector;
