import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import Hidden from '@mui/material/Hidden';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { Edit } from '@mui/icons-material';

const BoldCell = styled(TableCell)({
  fontWeight: 'bold',
});

const chip = (level, streak) => (
  <Chip color={streak === 11 ? 'default' : 'primary'} label={level} />
);

const editButton = (level, index) => (
  <IconButton
    aria-label="edit word"
    component={Link}
    to={`/edit/${level}/${index}`}
    size="large"
  >
    <Edit />
  </IconButton>
);

function XsDown({ words }) {
  return (
    <Table aria-label="search results">
      <TableHead>
        <TableRow>
          <BoldCell>Level</BoldCell>
          <BoldCell>Index</BoldCell>
          <BoldCell>Streak</BoldCell>
          <BoldCell>Word</BoldCell>
          <BoldCell>Yomigana</BoldCell>
          <BoldCell>Meaning</BoldCell>
          <TableCell />
        </TableRow>
      </TableHead>
      <TableBody>
        {words.map(({ level, index, streak, word, yomigana, meaning }) => (
          <TableRow key={level + index}>
            <TableCell aria-label="level">{chip(level, streak)}</TableCell>
            <TableCell>{index}</TableCell>
            <TableCell>{streak}</TableCell>
            <TableCell>{word}</TableCell>
            <TableCell>{yomigana}</TableCell>
            <TableCell>{meaning}</TableCell>
            <TableCell style={{ padding: '6px' }}>
              {editButton(level, index)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

const ThinCell = styled(TableCell)({
  padding: '6px 0px 6px 8px',
});

function SmUp({ words }) {
  return (
    <Table size="small" aria-label="search results">
      <TableBody>
        {words.map(({ level, index, streak, word, yomigana, meaning }) => (
          <TableRow key={level + index}>
            <ThinCell>{chip(level, streak)}</ThinCell>
            <ThinCell style={{ width: '100%' }}>
              <Typography variant="body2" color="textSecondary">
                {yomigana}
              </Typography>
              <Typography variant="body2">{word}</Typography>
              <Typography variant="body2" color="textSecondary">
                {meaning}
              </Typography>
            </ThinCell>
            <ThinCell style={{ padding: '6px' }}>
              {editButton(level, index)}
            </ThinCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default function Words({ words }) {
  return (
    <TableContainer component={Paper}>
      <Hidden smDown>
        <XsDown words={words} />
      </Hidden>
      <Hidden smUp>
        <SmUp words={words} />
      </Hidden>
    </TableContainer>
  );
}
