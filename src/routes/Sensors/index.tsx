import { bristlemouthURL } from 'src/helpers/constants';
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
  spottersListSelector,
  spottersRequest,
} from 'src/store/spotters/spottersSlice';
import { useAppDispatch } from 'src/store/hooks';
import { useNavigate } from 'react-router-dom';
import MapIcon from '@mui/icons-material/Map';
import { settingsSelector } from 'src/store/settings/settingsSlice';

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

function Sensors() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { sofarApiToken } = useSelector(settingsSelector);
  const spottersList = useSelector(spottersListSelector);

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
          <Link target="_blank" rel="noopener" href={bristlemouthURL}>
            <Logo src={bristlemouthLogo} alt="Bristlemouth logo" />
          </Link>
          <Typography variant="h5">Bristlemouth Explorer</Typography>
        </Stack>
        <Tooltip title="coming soon">
          <span>
            <RoundedButton disabled variant="outlined" startIcon={<MapIcon />}>
              <Typography variant="inherit" color="black" fontWeight="bold">
                View on map
              </Typography>
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
