import {
  Button,
  Link,
  Stack,
  Tooltip,
  Typography,
  styled,
} from '@mui/material';
import bristlemouthLogo from 'src/assets/bristlemouth-logo.png';
import SensorSelector from './SensorSelector';
import DataTable from './DataTable';
import React from 'react';
import { useSelector } from 'react-redux';
import {
  sensorDataSelector,
  spottersListSelector,
  spottersRequest,
} from 'src/store/spotters/spottersSlice';
import { useAppDispatch } from 'src/store/hooks';
import { useNavigate } from 'react-router-dom';
import MapIcon from '@mui/icons-material/Map';
import { settingsSelector } from 'src/store/settings/settingsSlice';
import { Location, SensorData } from 'src/helpers/types';

const Logo = styled('img')(({ theme }) => ({
  borderRadius: theme.spacing(1),
  height: '2.5rem',
  width: '2.5rem',
}));

const StackContainer = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.grey[100],
  height: '100vh',
}));

const RoundedButton = styled(Button)(() => ({
  textTransform: 'none',
  borderRadius: '50px',
}));

function findLastSensorPosition(data: SensorData[]): Location | null {
  if (data.length === 0) return null;
  const latest = data.reduce((max, curr) => {
    if (max.timestamp < curr.timestamp) return curr;
    else return max;
  }, data[0]);

  return {
    latitude: latest.latitude,
    longitude: latest.longitude,
  };
}

function Sensors() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { sofarApiToken } = useSelector(settingsSelector);
  const spottersList = useSelector(spottersListSelector);
  const sensorData = useSelector(sensorDataSelector);

  const latestSpotterPosition = findLastSensorPosition(sensorData);

  React.useEffect(() => {
    async function getSpotters() {
      if (sofarApiToken && spottersList.length === 0) {
        const result = await dispatch(
          spottersRequest({ token: sofarApiToken }),
        );
        if (result.meta.requestStatus === 'fulfilled') return;

        navigate('/');
      }
    }

    getSpotters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <StackContainer>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        padding="1rem 1rem 0.5rem 1rem"
      >
        <Stack direction="row" alignItems="center" gap="1rem">
          <Link target="_blank" rel="noopener noreferrer" href="/">
            <Logo src={bristlemouthLogo} alt="Bristlemouth logo" />
          </Link>
          <Typography variant="h4">Bristlemouth Explorer</Typography>
        </Stack>
        <Tooltip
          title={
            latestSpotterPosition === null
              ? 'No spotter information'
              : 'Last known position"'
          }
        >
          <span>
            <RoundedButton
              disabled={latestSpotterPosition === null}
              variant="outlined"
              startIcon={<MapIcon />}
            >
              <Link
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: 'none' }}
                href={`http://www.google.com/maps/place/${latestSpotterPosition?.latitude},${latestSpotterPosition?.longitude}`}
              >
                <Typography variant="inherit" color="black">
                  View on map
                </Typography>
              </Link>
            </RoundedButton>
          </span>
        </Tooltip>
      </Stack>

      <Stack direction="row" height="calc(100vh - 8rem)">
        <SensorSelector />
        <DataTable />
      </Stack>
    </StackContainer>
  );
}

export default Sensors;
