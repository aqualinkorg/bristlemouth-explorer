import { Button, Paper, Stack, Typography, styled } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const PaperContainer = styled(Paper)(({ theme }) => ({
  width: '20rem',
  height: '60vh',
  margin: '1rem 1rem 0.5rem 0.5rem',
  padding: '1rem',
  flexShrink: 0,
  borderRadius: theme.spacing(1),
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}));

const StyledButton = styled(Button)(() => ({
  textTransform: 'none',
  borderRadius: '50px',
}));

const ButtonContentsWrapper = styled('div')(() => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  width: '100%',
  paddingLeft: '1rem',
}));

const mockDecoderOptions = [
  'Decoder #1',
  'Decoder #2',
  'Decoder #3',
  'Create my own decoder',
];

function Decoder() {
  return (
    <PaperContainer>
      <Stack gap="0.5rem" textAlign="center" margin="1rem">
        <Typography variant="h5" fontWeight="bold">
          Select decoder
        </Typography>
        <Typography textAlign="left" fontSize="small">
          You can either select one of our decoders or create your own
        </Typography>
        <Stack gap="0.7rem">
          {mockDecoderOptions.map((option) => (
            <StyledButton key={option} variant="outlined">
              <ButtonContentsWrapper>
                <Typography>{option}</Typography>
                <ChevronRightIcon />
              </ButtonContentsWrapper>
            </StyledButton>
          ))}
        </Stack>
      </Stack>
    </PaperContainer>
  );
}

export default Decoder;
