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
import {
  bristlemouthURL,
  sofarApiTokenLocalStorageKey,
  sofarDocsURL,
} from 'src/helpers/constants';
import useLocalStorage from 'src/helpers/useLocalStorage';
import Footer from 'src/common/Footer';

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
  const [token, setToken] = useLocalStorage<string>(
    sofarApiTokenLocalStorageKey,
    '',
  );
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
