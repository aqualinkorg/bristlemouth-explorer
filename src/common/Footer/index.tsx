import {
  AppBar,
  Grid,
  Link,
  Typography,
  styled,
  useTheme,
} from '@mui/material';
import { DateTime } from 'luxon';
import aqualinkLogo from 'src/assets/aqualink-logo.png';
import sofarLogo from 'src/assets/sofar-logo.png';
import { aqualinkURL, bristlemouthURL, sofarURL } from 'src/helpers/constants';

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

const MainText = styled(Typography)(({ theme }) => ({
  width: '10rem',
  textAlign: 'left',
  color: theme.palette.primary.main,
}));
const Logo = styled('img')(() => ({
  borderRadius: '8px',
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
          <MainText variant="h5">
            <StyledLink target="_blank" rel="noopener" href={bristlemouthURL}>
              Bristlemouth
            </StyledLink>{' '}
            for developers
          </MainText>
        </Grid>

        <Grid item>
          <GridMiddleContainer container style={{ gap: theme.spacing(4) }}>
            <Grid item>
              <GridMiddleContainer container style={{ gap: theme.spacing(1) }}>
                <Typography textAlign="center">Developed with ❤️ by</Typography>
                <Link target="_blank" rel="noopener" href={aqualinkURL}>
                  <Logo src={aqualinkLogo} alt="Aqualink logo" />
                </Link>
              </GridMiddleContainer>
            </Grid>
            <Grid item>
              <GridMiddleContainer container style={{ gap: theme.spacing(2) }}>
                <Typography textAlign="left">
                  Bristlemouth is an open <br /> standard pioneered by
                </Typography>
                <Link target="_blank" rel="noopener" href={sofarURL}>
                  <Logo src={sofarLogo} alt="Sofar logo" />
                </Link>
              </GridMiddleContainer>
            </Grid>
          </GridMiddleContainer>
        </Grid>

        <Grid item>
          <Typography textAlign="right">
            © {DateTime.utc().year} All rights reserved <br /> Privacy policy
            -&nbsp;
            <StyledLink
              target="_blank"
              rel="noopener"
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
