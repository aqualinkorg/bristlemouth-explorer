import { Paper, styled } from '@mui/material';

const PaperContainer = styled(Paper)(({ theme }) => ({
  height: 'calc(40vh - 12rem)',
  margin: '0.5rem 1rem 1rem 1rem',
  padding: '1rem',
  flexShrink: 0,
  borderRadius: theme.spacing(1),
}));

function Terminal() {
  return <PaperContainer>Terminal</PaperContainer>;
}

export default Terminal;
