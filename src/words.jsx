import React from 'react';
import { Link } from 'react-router-dom';
import { makeStyles, styled } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import { Edit } from '@material-ui/icons';

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
  >
    <Edit />
  </IconButton>
);

const XsDown = ({ words }) => (
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
          <TableCell>{chip(level, streak)}</TableCell>
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

const ThinCell = styled(TableCell)({
  padding: '6px 0px 6px 8px',
});

const SmUp = ({ words }) => (
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

const useStyles = makeStyles({
  root: {
    marginBottom: '16px',
  },
});

export default ({ words }) => {
  const classes = useStyles();

  return (
    <TableContainer
      component={Paper}
      variant="outlined"
      className={classes.root}
    >
      <Hidden xsDown>
        <XsDown words={words} />
      </Hidden>
      <Hidden smUp>
        <SmUp words={words} />
      </Hidden>
    </TableContainer>
  );
};
