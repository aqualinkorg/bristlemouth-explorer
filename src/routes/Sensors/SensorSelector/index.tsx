import React from 'react';
import {
  Button,
  Divider,
  Paper,
  Stack,
  Typography,
  styled,
} from '@mui/material';
import ExpandCircleDownIcon from '@mui/icons-material/ExpandCircleDown';
import MapIcon from '@mui/icons-material/Map';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { DateTime } from 'luxon';

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

function SensorSelector() {
  const [startDate, setStartDate] = React.useState<DateTime | null>(null);
  const [endDate, setEndDate] = React.useState<DateTime | null>(null);

  return (
    <LocalizationProvider dateAdapter={AdapterLuxon}>
      <PaperContainer>
        <Stack gap="2rem">
          <Typography variant="h6" fontWeight="bold">
            Spot ID
          </Typography>
          <Stack>
            <Stack direction="row" justifyContent="space-between">
              <StyledButton variant="text" endIcon={<ExpandCircleDownIcon />}>
                Change
              </StyledButton>
              <StyledButton variant="text" endIcon={<MapIcon />}>
                Locate on map
              </StyledButton>
            </Stack>
            <Divider />
          </Stack>
          <Typography variant="h5" fontWeight="bold">
            SPOT - 1742
          </Typography>

          <DatePicker
            label="Start Date"
            value={startDate}
            onChange={(newValue) => setStartDate(newValue)}
          />
          <DatePicker
            label="Start Date"
            value={endDate}
            onChange={(newValue) => setEndDate(newValue)}
          />

          <StyledButton variant="contained">
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
      </PaperContainer>
    </LocalizationProvider>
  );
}

export default SensorSelector;
