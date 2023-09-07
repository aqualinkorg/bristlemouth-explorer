import { AppBar, Grid, Typography, styled, useTheme } from '@mui/material';
import { DateTime } from 'luxon';
import aqualinkLogo from 'src/assets/aqualink-logo.png';
import sofarLogo from 'src/assets/sofar-logo.png';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  top: 'auto',
  bottom: 0,
  backgroundColor: theme.palette.dark.main,
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

function Footer() {
  const theme = useTheme();
  return (
    <StyledAppBar position="fixed">
      <GridContainer container>
        <Grid item>
          <MainText variant="h5">Bristlemouth for developers</MainText>
        </Grid>

        <Grid item>
          <GridMiddleContainer container style={{ gap: theme.spacing(4) }}>
            <Grid item>
              <GridMiddleContainer container style={{ gap: theme.spacing(1) }}>
                <Typography textAlign="center">Developed with ❤️ by</Typography>
                <Logo src={aqualinkLogo} alt="Aqualink logo" />
              </GridMiddleContainer>
            </Grid>
            <Grid item>
              <GridMiddleContainer container style={{ gap: theme.spacing(2) }}>
                <Typography textAlign="left">
                  Bristlemouth is an open <br /> standard pioneered by
                </Typography>
                <Logo src={sofarLogo} alt="Sofar logo" />
              </GridMiddleContainer>
            </Grid>
          </GridMiddleContainer>
        </Grid>

        <Grid item>
          <Typography textAlign="right">
            © {DateTime.utc().year} All rights reserved <br /> Privacy policy -
            Contact Us
          </Typography>
        </Grid>
      </GridContainer>
    </StyledAppBar>
  );
}

export default Footer;
