import {
  AppBar,
  Grid,
  Link,
  Typography,
  styled,
  useTheme,
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

const GridContainer = styled(Grid)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(2),
}));

const GridMiddleContainer = styled(Grid)(() => ({
  display: 'flex',
  flexWrap: 'nowrap',
  justifyContent: 'center',
  alignItems: 'center',
}));

const Logo = styled('img')(({ theme }) => ({
  borderRadius: theme.spacing(1),
  height: '2.5rem',
}));

const StyledLink = styled(Link)(() => ({
  textDecoration: 'none',
}));

function Footer() {
  const theme = useTheme();
  return (
    <StyledAppBar position="fixed">
      <GridContainer container>
        <Grid item>
          <Typography>
            <StyledLink
              target="_blank"
              rel="noopener noreferrer"
              href={bristlemouthURL}
            >
              Bristlemouth.org
            </StyledLink>
          </Typography>
        </Grid>

        <Grid item>
          <GridMiddleContainer container style={{ gap: theme.spacing(1) }}>
            <Typography textAlign="center">Developed with ❤️ by</Typography>
            <Link target="_blank" rel="noopener noreferrer" href={aqualinkURL}>
              <Logo src={aqualinkLogo} alt="Aqualink logo" />
            </Link>
          </GridMiddleContainer>
        </Grid>

        <Grid item>
          <Typography textAlign="right">
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
          </Typography>
        </Grid>
      </GridContainer>
    </StyledAppBar>
  );
}

export default Footer;
