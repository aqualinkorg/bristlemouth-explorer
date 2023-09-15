import {
  Button,
  Link,
  Stack,
  TextField,
  Typography,
  styled,
} from '@mui/material';
import bristlemouthLogo from 'src/assets/bristlemouth-logo.png';
import { spottersRequest } from 'src/store/spotters/spottersSlice';
import { useAppDispatch } from 'src/store/hooks';
import {
  bristlemouthURL,
  sofarApiTokenStorageKey,
  sofarDocsURL,
} from 'src/helpers/constants';
import useLocalStorage from 'src/helpers/useLocalStorage';
import Footer from 'src/common/Footer';
import { useNavigate } from 'react-router-dom';

const WrapperDiv = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end',
  alignItems: 'center',
  paddingTop: theme.spacing(10),
  gap: theme.spacing(12),
}));

const Logo = styled('img')(({ theme }) => ({
  borderRadius: theme.spacing(1),
  height: '5rem',
  width: '5rem',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  color: 'white',
}));

const StyledLink = styled(Link)(() => ({
  color: 'black',
  textDecorationColor: 'unset',
}));

function Home() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [token, setToken] = useLocalStorage<string>(
    sofarApiTokenStorageKey,
    '',
  );

  async function onTokenSubmit() {
    const result = await dispatch(spottersRequest(token));
    if (result.meta.requestStatus === 'rejected') return;

    navigate('/sensors');
  }

  return (
    <WrapperDiv>
      <Stack direction="column" alignItems="center" spacing={10}>
        <Link target="_blank" rel="noopener" href={bristlemouthURL}>
          <Logo src={bristlemouthLogo} alt="Bristlemouth logo" />
        </Link>
        <Stack direction="column" alignItems="center" spacing={5}>
          <Typography variant="h3" fontWeight="bold">
            Bristlemouth for developers
          </Typography>
          <Stack direction="column" spacing={1} width="50%">
            <Typography fontWeight="bold">
              Enter your Sofar API Token
            </Typography>
            <TextField
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="XXXX-XXX-XXXX-XXX"
              variant="outlined"
              size="small"
            />
            <StyledButton
              color="primary"
              variant="contained"
              onClick={() => onTokenSubmit()}
            >
              GO
            </StyledButton>
          </Stack>
          <Stack direction="column" alignItems="center" spacing={1}>
            <StyledLink
              target="_blank"
              rel="noopener"
              href="mailto:info@aqualink.org"
            >
              Can&apos;t find or need a Sofar API Token?
            </StyledLink>
            <StyledLink target="_blank" rel="noopener" href={sofarDocsURL}>
              What can you do with this Sofar API?
            </StyledLink>
          </Stack>
        </Stack>
      </Stack>
      <Footer />
    </WrapperDiv>
  );
}

export default Home;
