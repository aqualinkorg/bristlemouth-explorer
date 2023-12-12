import {
  AppBar,
  Link,
  Stack,
  Typography,
  styled,
  useMediaQuery,
} from '@mui/material';
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
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    gap: '1rem',
    position: 'relative',
  },
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

const ContactUsTypography = styled(Typography)(({ theme }) => ({
  textAlign: 'right',
  position: 'absolute',
  top: theme.spacing(2),
  right: theme.spacing(2),
  [theme.breakpoints.down('md')]: {
    position: 'initial',
    textAlign: 'center',
  },
}));

const BristlemouthLinkTypography = styled(Typography)(({ theme }) => ({
  position: 'absolute',
  left: theme.spacing(2),
  display: 'flex',
  [theme.breakpoints.down('md')]: {
    position: 'initial',
  },
}));

function Footer() {
  const isMobile = useMediaQuery('(max-width: 760px)');
  return (
    <StyledAppBar position={isMobile ? 'relative' : 'fixed'}>
      <StackContainer direction="row">
        <BristlemouthLinkTypography>
          <StyledLink
            target="_blank"
            rel="noopener noreferrer"
            href={bristlemouthURL}
          >
            Bristlemouth.org
          </StyledLink>
          <StyledLink
            target="_blank"
            rel="noopener noreferrer"
            href={bristlemouthURL}
            style={{
              marginLeft: '2rem',
              fontWeight: 'bold',
              textAlign: 'center',
            }}
          >
            Apply for the pioneer program
          </StyledLink>
        </BristlemouthLinkTypography>

        <StackAqualinkLogo direction="row">
          <Typography textAlign="center">Developed with ❤️ by</Typography>
          <Link target="_blank" rel="noopener noreferrer" href={aqualinkURL}>
            <Logo src={aqualinkLogo} alt="Aqualink logo" />
          </Link>
        </StackAqualinkLogo>

        <ContactUsTypography>
          Bristlemouth Explorer is open source!
          <br />
          Find us on{' '}
          <StyledLink
            target="_blank"
            rel="noopener noreferrer"
            href={bristlemouthExplorerGithub}
          >
            GitHub
          </StyledLink>
        </ContactUsTypography>
      </StackContainer>
    </StyledAppBar>
  );
}

export default Footer;
