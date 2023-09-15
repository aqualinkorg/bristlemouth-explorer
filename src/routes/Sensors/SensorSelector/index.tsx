import React from 'react';
import {
  Button,
  Divider,
  Link,
  Menu,
  MenuItem,
  Paper,
  Stack,
  Typography,
  styled,
} from '@mui/material';
import ExpandCircleDownIcon from '@mui/icons-material/ExpandCircleDown';
import MapIcon from '@mui/icons-material/Map';
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
  width: '15rem',
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

const TypographyWrapText = styled(Typography)(() => ({
  wordWrap: 'break-word',
}));

function parseDateTime(parsedValue: unknown) {
  if (typeof parsedValue !== 'string') return null;
  return DateTime.fromISO(parsedValue);
}

function SensorSelector() {
  const dispatch = useAppDispatch();

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
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  const handleChangeSpotterClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    setAnchorEl(event.currentTarget);
  };

  const handleChangeSpotterClose = (spotter?: Spotter) => {
    if (spotter) setSelectedSpotter(spotter);
    setAnchorEl(null);
  };

  async function handleRefresh() {
    if (selectedSpotter?.spotterId && token)
      dispatch(
        sensorDataRequest({
          token,
          spotterId: selectedSpotter?.spotterId,
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
            <TypographyWrapText variant="h6" fontWeight="bold">
              {selectedSpotter?.name || '(no name)'}
            </TypographyWrapText>
            <Stack>
              <Stack direction="row" justifyContent="space-between">
                <StyledButton
                  onClick={(e) => handleChangeSpotterClick(e)}
                  variant="text"
                  endIcon={<ExpandCircleDownIcon />}
                >
                  Change
                </StyledButton>
                <Menu
                  anchorEl={anchorEl}
                  open={open}
                  onClose={() => handleChangeSpotterClose()}
                >
                  {spottersList.map((spotter) => (
                    <MenuItem
                      key={spotter.spotterId}
                      onClick={() => handleChangeSpotterClose(spotter)}
                    >
                      {spotter.spotterId}
                    </MenuItem>
                  ))}
                </Menu>
                <StyledButton disabled variant="text" endIcon={<MapIcon />}>
                  Locate on map
                </StyledButton>
              </Stack>
              <Divider />
            </Stack>
            <TypographyWrapText variant="h5" fontWeight="bold">
              {selectedSpotter?.spotterId}
            </TypographyWrapText>

            <DatePicker
              timezone="UTC"
              label="Start Date"
              value={startDate}
              onChange={(newValue) => setStartDate(newValue)}
            />
            <DatePicker
              timezone="UTC"
              label="End Date"
              value={endDate}
              onChange={(newValue) => setEndDate(newValue)}
            />

            <StyledButton variant="contained" onClick={() => handleRefresh()}>
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
          <Link href="/">Change your api token</Link>
        </Stack>
      </PaperContainer>
    </LocalizationProvider>
  );
}

export default SensorSelector;
