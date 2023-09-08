import { Button, Stack, TextField, Typography, styled } from '@mui/material';
import Footer from 'src/common/Footer';
import bristlemouthLogo from 'src/assets/bristlemouth-logo.png';
import React from 'react';

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

const StyledLink = styled('a')(() => ({
  color: 'black',
}));

function Home() {
  const [token, setToken] = React.useState<string>('');

  return (
    <WrapperDiv>
      <Stack direction="column" alignItems="center" spacing={10}>
        <Logo src={bristlemouthLogo} alt="Bristlemouth logo" />
        <Stack direction="column" alignItems="center" spacing={5}>
          <Typography variant="h3" fontWeight="bold">
            Bristlemouth for developers
          </Typography>
          <Stack direction="column" spacing={1} width="50%">
            <Typography fontWeight="bold">
              Enter your Bristlemouth API Token
            </Typography>
            <TextField
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="XXXX-XXX-XXXX-XXX"
              variant="outlined"
              size="small"
            />
            <StyledButton color="primary" variant="contained">
              GO
            </StyledButton>
          </Stack>
          <Stack direction="column" alignItems="center" spacing={1}>
            <StyledLink href="google.com">
              Can’t find or need a Bristlemouth API Token?
            </StyledLink>
            <StyledLink href="google.com">
              What can you do with this Bristlemouth API?
            </StyledLink>
          </Stack>
        </Stack>
      </Stack>

      <Footer />
    </WrapperDiv>
  );
}

export default Home;
