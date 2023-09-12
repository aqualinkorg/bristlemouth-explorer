import {
  Backdrop,
  Button,
  CircularProgress,
  Link,
  Stack,
  TextField,
  Typography,
  styled,
} from '@mui/material';
import Footer from 'src/common/Footer';
import bristlemouthLogo from 'src/assets/bristlemouth-logo.png';
import React from 'react';
import {
  spottersListErrorSelector,
  spottersListLoadingSelector,
  spottersListSelector,
  spottersRequest,
} from 'src/store/spotters/spottersSlice';
import { useSelector } from 'react-redux';
import { useAppDispatch } from 'src/store/hooks';
import { toast } from 'react-toastify';
import { bristlemouthURL, sofarDocsURL } from 'src/helpers/constants';

const WrapperDiv = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end',
  alignItems: 'center',
  paddingTop: theme.spacing(10),
  gap: theme.spacing(12),
}));

const Logo = styled('img')(() => ({
  borderRadius: '8px',
  height: '5rem',
  width: '5rem',
}));

const StyledButton = styled(Button)(() => ({
  borderRadius: '16px',
  color: 'white',
}));

const StyledLink = styled(Link)(() => ({
  color: 'black',
  textDecorationColor: 'unset',
}));

function Home() {
  const dispatch = useAppDispatch();
  const [token, setToken] = React.useState<string>('');
  const spottersRequestLoading = useSelector(spottersListLoadingSelector);
  const spotters = useSelector(spottersListSelector);
  const spottersRequestError = useSelector(spottersListErrorSelector);

  function onTokenSubmit() {
    dispatch(spottersRequest(token));
  }

  React.useEffect(() => {
    // eslint-disable-next-line no-console
    console.log(spotters);
  }, [spotters]);

  React.useEffect(() => {
    if (spottersRequestError !== null) toast.warn(spottersRequestError);
  }, [spottersRequestError]);

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

      <Backdrop open={spottersRequestLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <Footer />
    </WrapperDiv>
  );
}

export default Home;
