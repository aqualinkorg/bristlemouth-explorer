import React from 'react';
import {
  Button,
  FormControl,
  Link,
  MenuItem,
  Paper,
  Select,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
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

const PaperContainer = styled(Paper)(({ theme }) => ({
  width: '20rem',
  height: '60vh',
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
          spotterNodeId: nodeId,
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

    setAvailableNodeIds(uniqueNodeIds);
  }, [sensorData]);

  /**
   * Initialize the 'nodeId' after obtaining 'availableNodeIds' to prevent
   * MUI warnings related to out-of-range values for the 'Select' component.
   */
  React.useEffect(() => {
    if (!availableNodeIds) return;
    const node = availableNodeIds.find((x) => x === appSettings.spotterNodeId);
    if (node !== undefined) setNodeId(node);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [availableNodeIds]);

  return (
    <LocalizationProvider dateAdapter={AdapterLuxon}>
      <PaperContainer>
        <Stack justifyContent="space-between" height="100%" overflow="scroll">
          <Stack gap="1.5rem">
            <Stack gap="0.5rem">
              <Typography fontWeight="bold">SPOT ID</Typography>
              <FormControl size="small">
                <Select
                  value={
                    spottersList.length > 0 ? selectedSpotter?.spotterId : ''
                  }
                  onChange={(e) => handleChangeSpotter(e.target.value)}
                >
                  {spottersList.map((x) => (
                    <MenuItem value={x.spotterId} key={x.spotterId}>
                      {x.spotterId}
                    </MenuItem>
                  ))}
                </Select>
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
                  <MenuItem value="">&nbsp;</MenuItem>
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
              <Tooltip title="coming soon">
                <FormControl size="small">
                  <Select
                    disabled
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
                    <MenuItem value="">&nbsp;</MenuItem>
                  </Select>
                </FormControl>
              </Tooltip>
            </Stack>

            <Stack gap="0.5rem">
              <Typography fontWeight="bold">Timestamp</Typography>
              <ToggleButtonGroup
                color="primary"
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
                <ToggleButton value="user">User</ToggleButton>
                <ToggleButton value="utc">UTC</ToggleButton>
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
