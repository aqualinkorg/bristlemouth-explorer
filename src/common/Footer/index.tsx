import { AppBar, Link, Stack, Typography, styled } from '@mui/material';
import aqualinkLogo from 'src/assets/aqualink-logo.png';
import {
  aqualinkURL,
  bristlemouthURL,
  bristlemouthExplorerGithub,
} from 'src/helpers/constants';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  top: 'auto',
  bottom: 0,
  backgroundColor: theme.palette.dark?.main,
  color: 'white',
}));

const StackContainer = styled(Stack)(({ theme }) => ({
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(2),
}));

const StackAqualinkLogo = styled(Stack)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'nowrap',
  justifyContent: 'center',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

const Logo = styled('img')(({ theme }) => ({
  borderRadius: theme.spacing(1),
  height: '2.5rem',
}));

const StyledLink = styled(Link)(() => ({
  textDecoration: 'none',
}));

const ContractUsTypography = styled(Typography)(({ theme }) => ({
  textAlign: 'right',
  position: 'absolute',
  top: theme.spacing(2),
  right: theme.spacing(2),
}));

const BristlemouthLinkTypography = styled(Typography)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: theme.spacing(2),
  display: 'flex',
  textAlign: 'center',
}));

function Footer() {
  return (
    <StyledAppBar position="fixed">
      <StackContainer direction="row">
        <BristlemouthLinkTypography>
          <StyledLink
            target="_blank"
            rel="noopener noreferrer"
            href={bristlemouthURL}
          >
            Bristlemouth.org
          </StyledLink>
        </BristlemouthLinkTypography>

        <StackAqualinkLogo direction="row">
          <Typography textAlign="center">Developed with ❤️ by</Typography>
          <Link target="_blank" rel="noopener noreferrer" href={aqualinkURL}>
            <Logo src={aqualinkLogo} alt="Aqualink logo" />
          </Link>
        </StackAqualinkLogo>

        <ContractUsTypography>
          Bristlemouth Explorer is open source!
          <br />
          Find us on{' '}
          <StyledLink
            target="_blank"
            rel="noopener noreferrer"
            href={bristlemouthExplorerGithub}
          >
            GitHub
          </StyledLink>{' '}
          or{' '}
          <StyledLink
            target="_blank"
            rel="noopener noreferrer"
            href="mailto:info@aqualink.org"
          >
            Contact Us
          </StyledLink>
        </ContractUsTypography>
      </StackContainer>
    </StyledAppBar>
  );
}

export default Footer;
