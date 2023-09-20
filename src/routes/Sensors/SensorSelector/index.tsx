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
  Typography,
  styled,
} from '@mui/material';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { useSelector } from 'react-redux';
import {
  sensorDataRequest,
  spottersListSelector,
} from 'src/store/spotters/spottersSlice';
import useLocalStorage from 'src/helpers/useLocalStorage';
import {
  selectedSpotterStorageKey,
  sofarApiTokenStorageKey,
  spotterDataEndDateStorageKey,
  spotterDataStartDateStorageKey,
} from 'src/helpers/constants';
import { Spotter } from 'src/helpers/types';
import { DateTime } from 'luxon';
import { useAppDispatch } from 'src/store/hooks';

const PaperContainer = styled(Paper)(({ theme }) => ({
  width: '20rem',
  height: '60vh',
  margin: '1rem 0.5rem 0.5rem 1rem',
  padding: '1rem',
  flexShrink: 0,
  borderRadius: theme.spacing(1),
}));

const StyledButton = styled(Button)(() => ({
  textTransform: 'none',
  borderRadius: '50px',
}));

function parseDateTime(parsedValue: unknown) {
  if (typeof parsedValue !== 'string') return null;
  return DateTime.fromISO(parsedValue);
}

function SensorSelector() {
  const dispatch = useAppDispatch();

  const [timezone, setTimezone] = React.useState<'native' | 'UTC'>('native');
  const [token] = useLocalStorage<string>(sofarApiTokenStorageKey, '');
  const [startDate, setStartDate] = useLocalStorage<DateTime | null>(
    spotterDataStartDateStorageKey,
    null,
    parseDateTime,
  );
  const [endDate, setEndDate] = useLocalStorage<DateTime | null>(
    spotterDataEndDateStorageKey,
    null,
    parseDateTime,
  );
  const [selectedSpotter, setSelectedSpotter] = useLocalStorage<Spotter | null>(
    selectedSpotterStorageKey,
    null,
  );
  const spottersList = useSelector(spottersListSelector);

  const canFetchData = selectedSpotter?.spotterId && token;

  const handleChangeSpotter = (spotterId: string) => {
    const spotter = spottersList.find((x) => x.spotterId === spotterId);
    if (spotter) setSelectedSpotter(spotter);
  };

  async function handleRefresh() {
    if (canFetchData)
      dispatch(
        sensorDataRequest({
          token,
          spotterId: selectedSpotter.spotterId,
          startDate: startDate?.startOf('day').toISO() || undefined,
          endDate: endDate?.endOf('day').toISO() || undefined,
        }),
      );
  }

  // automatically fetch information on first render
  React.useEffect(() => {
    handleRefresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (selectedSpotter === null && spottersList.length !== 0) {
      setSelectedSpotter(spottersList[0]);
    }
  }, [setSelectedSpotter, selectedSpotter, spottersList]);

  return (
    <LocalizationProvider dateAdapter={AdapterLuxon}>
      <PaperContainer>
        <Stack justifyContent="space-between" height="100%">
          <Stack gap="2rem">
            <Stack gap="0.5rem">
              <Typography fontWeight="bold">SPOT ID</Typography>
              <FormControl size="small">
                <Select
                  value={selectedSpotter?.spotterId}
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
                <Select>
                  <MenuItem value="some value">some value</MenuItem>
                  <MenuItem value="some other value">some other value</MenuItem>
                </Select>
              </FormControl>
            </Stack>

            <Stack gap="0.5rem">
              <Typography fontWeight="bold">Decoder</Typography>
              <FormControl size="small">
                <Select>
                  <MenuItem value="Decoder 1">Decoder 1</MenuItem>
                  <MenuItem value="Decoder 1">Decoder 1</MenuItem>
                </Select>
              </FormControl>
            </Stack>

            <Stack gap="0.5rem">
              <Typography fontWeight="bold">Timestamp</Typography>
              <ToggleButtonGroup
                color="primary"
                exclusive
                value={timezone}
                onChange={(_, val) => setTimezone(val)}
              >
                <ToggleButton value="native">Native</ToggleButton>
                <ToggleButton value="UTC">UTC</ToggleButton>
              </ToggleButtonGroup>
            </Stack>

            <StyledButton
              disabled={!canFetchData}
              variant="contained"
              onClick={() => handleRefresh()}
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
          <Link href="/">Change your API token</Link>
        </Stack>
      </PaperContainer>
    </LocalizationProvider>
  );
}

export default SensorSelector;
