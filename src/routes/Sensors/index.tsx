import {
  bristlemouthURL,
  sofarApiTokenStorageKey,
} from 'src/helpers/constants';
import { Link, Stack, Typography, styled } from '@mui/material';
import bristlemouthLogo from 'src/assets/bristlemouth-logo.png';
import SensorSelector from './SensorSelector';
import DataTable from './DataTable';
import Decoder from './Decoder';
import Terminal from './Terminal';
import useLocalStorage from 'src/helpers/useLocalStorage';
import React from 'react';
import { useSelector } from 'react-redux';
import {
  spottersListSelector,
  spottersRequest,
} from 'src/store/spotters/spottersSlice';
import { useAppDispatch } from 'src/store/hooks';
import { useNavigate } from 'react-router-dom';

const Logo = styled('img')(({ theme }) => ({
  borderRadius: theme.spacing(1),
  height: '2.5rem',
  width: '2.5rem',
}));

const StackContainer = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.grey[100],
  height: '100vh',
}));

function Sensors() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [token] = useLocalStorage<string>(sofarApiTokenStorageKey, '');
  const spottersList = useSelector(spottersListSelector);

  React.useEffect(() => {
    async function getSpotters() {
      if (token !== '' && spottersList.length === 0) {
        const result = await dispatch(spottersRequest(token));
        if (result.meta.requestStatus === 'fulfilled') return;

        navigate('/');
      }
    }

    getSpotters();
  }, [token, spottersList, dispatch, navigate]);

  return (
    <StackContainer>
      <Stack direction="row" alignItems="center" gap="1rem" padding="1rem">
        <Link target="_blank" rel="noopener" href={bristlemouthURL}>
          <Logo src={bristlemouthLogo} alt="Bristlemouth logo" />
        </Link>
        <Typography variant="h5">Bristlemouth for developers</Typography>
      </Stack>
      <Stack direction="row">
        <SensorSelector />
        <DataTable />
        <Decoder />
      </Stack>
      <Terminal />
    </StackContainer>
  );
}

export default Sensors;
