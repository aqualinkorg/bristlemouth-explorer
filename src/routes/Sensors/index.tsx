import { bristlemouthURL } from 'src/helpers/constants';
import { Link, Stack, Typography, styled } from '@mui/material';
import bristlemouthLogo from 'src/assets/bristlemouth-logo.png';
import SensorSelector from './SensorSelector';
import DataTable from './DataTable';
import Decoder from './Decoder';
import Terminal from './Terminal';

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
