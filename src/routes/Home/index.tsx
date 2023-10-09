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
import { bristlemouthURL, sofarDocsURL } from 'src/helpers/constants';
import Footer from 'src/common/Footer';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import {
  setSettings,
  settingsSelector,
} from 'src/store/settings/settingsSlice';
import { useSelector } from 'react-redux';

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

const StyledLink = styled(Link)(() => ({
  color: 'black',
  textDecorationColor: 'unset',
}));

function Home() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { sofarApiToken } = useSelector(settingsSelector);

  const [token, setToken] = React.useState<string>(sofarApiToken || '');

  async function onTokenSubmit() {
    const result = await dispatch(spottersRequest({ token }));
    if (result.meta.requestStatus === 'rejected') return;

    dispatch(setSettings({ sofarApiToken: token }));
    navigate('/sensors');
  }

  const handleTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setToken(e.target.value);
  };

  // Mask all characters except the last 6
  const maskedToken = token.replace(/.(?=.{6})/g, '•');

  return (
    <WrapperDiv>
      <Stack direction="column" alignItems="center" spacing={10}>
        <Link target="_blank" rel="noopener noreferrer" href={bristlemouthURL}>
          <Logo src={bristlemouthLogo} alt="Bristlemouth logo" />
        </Link>
        <Stack direction="column" alignItems="center" spacing={5}>
          <Typography variant="h1" fontWeight="bold">
            Bristlemouth Explorer
          </Typography>
          <Stack direction="column" gap="1rem" spacing={1} width="20rem">
            <Stack>
              <Typography fontWeight="bold">
                Enter your Sofar API Token
              </Typography>
              <TextField
                value={maskedToken}
                onChange={handleTokenChange}
                placeholder="XXXX-XXX-XXXX-XXX"
                variant="outlined"
                size="small"
              />
            </Stack>

            <Button
              color="primary"
              variant="contained"
              style={{
                color: 'white',
                fontWeight: 'bold',
                textTransform: 'none',
              }}
              onClick={() => onTokenSubmit()}
            >
              Go
            </Button>
          </Stack>
          <Stack direction="column" alignItems="center" spacing={1}>
            <StyledLink
              target="_blank"
              rel="noopener noreferrer"
              href="mailto:info@aqualink.org"
            >
              Can&apos;t find or need a Sofar API Token?
            </StyledLink>
            <StyledLink
              target="_blank"
              rel="noopener noreferrer"
              href={sofarDocsURL}
            >
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
