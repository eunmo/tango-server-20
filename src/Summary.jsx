import { useEffect, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Fab from '@mui/material/Fab';
import Grid from '@mui/material/Grid';
import LinearProgress from '@mui/material/LinearProgress';
import Paper from '@mui/material/Paper';
import { pink } from '@mui/material/colors';
import {
  EventAvailable,
  EventBusy,
  Refresh,
  ShowChart,
} from '@mui/icons-material';

import { get } from './utils';

const selected = {
  backgroundColor: pink.A400,
};

const oldMonthLimit = 13;

function Streaks({ streaks, dataPrefix }) {
  return streaks.map(({ streak, sum }) => (
    <Grid key={streak} item xs={1} data-testid={`${dataPrefix}-${streak}`}>
      {sum === 0 ? null : sum}
    </Grid>
  ));
}

export default function Summary() {
  const [langs, setLangs] = useState([]);
  const [levels, setLevels] = useState([]);
  const [selectedLang, setSelectedLang] = useState('all');
  const [filterToday, setFilterToday] = useState(false);

  function fetch() {
    const tzOffset = new Date().getTimezoneOffset();
    get(`/api/meta/${tzOffset}`, ({ langs: resLangs, levels: resLevels }) => {
      setLangs(Object.entries(resLangs).sort());
      setLevels(resLevels);
    });
  }

  useEffect(() => {
    fetch();
  }, []);

  const toTitle = ({ learning, fresh }) => {
    return fresh === 0 ? learning : `${learning}.${fresh}`;
  };

  const filterByLang = (lang) => {
    setSelectedLang(lang === selectedLang ? 'all' : lang);
  };

  if (langs.length === 0) {
    return <LinearProgress />;
  }

  const days = [];
  for (let i = 0; i < 11; i += 1) {
    days[i] = { day: i, streaks: [], sum: 0 };
    for (let j = 0; j < 11 - i && j < 10; j += 1) {
      days[i].streaks[j] = { streak: j, sum: 0 };
    }
  }

  const sums = [];
  for (let i = 0; i < 10; i += 1) {
    sums[i] = { streak: i, sum: 0 };
  }

  const monthSet = {};
  levels.forEach(({ level }) => {
    const month = level.substring(1);
    monthSet[month] = month;
  });

  let monthKeys = Object.keys(monthSet).sort();
  if (monthKeys.length > oldMonthLimit) {
    monthKeys = monthKeys.slice(1 - oldMonthLimit);
    monthKeys.unshift('Old');
  }
  const months = monthKeys.map((month) => ({ month, streaks: [] }));
  const monthMap = {};
  for (let i = 0; i < months.length; i += 1) {
    const { month, streaks } = months[i];
    monthMap[month] = months[i];
    for (let j = 0; j < 10; j += 1) {
      streaks[j] = { streak: j, sum: 0 };
    }
  }

  levels.forEach(({ level, summary }) => {
    const lang = level.substring(0, 1);
    if (selectedLang !== 'all' && lang !== selectedLang) {
      return;
    }
    const month = monthMap[level.substring(1)] ?? monthMap.Old;
    summary.forEach(([streak, day, count]) => {
      if (filterToday && day !== 0) {
        return;
      }
      const index = streak === 0 ? 9 : 10 - streak;
      month.streaks[index].sum += count;
      sums[index].sum += count;
      days[day].streaks[index].sum += count;
      days[day].sum += count;
    });
  });

  return (
    <>
      <Grid container spacing={1} mb={1}>
        {langs.map(([lang, summary]) => (
          <Grid item key={lang} xs={4}>
            <Card variant="outlined">
              <ButtonBase
                sx={{ width: '100%', display: 'block', textAlign: 'initial' }}
                onClick={() => filterByLang(lang)}
                aria-label={lang}
              >
                <CardHeader
                  sx={{ p: 1, '& .MuiCardHeader-avatar': { mr: 1 } }}
                  avatar={
                    <Avatar
                      style={selectedLang === lang ? selected : {}}
                      aria-label={`Avatar-${lang}`}
                    >
                      {lang}
                    </Avatar>
                  }
                  title={toTitle(summary)}
                  subheader={summary.learned}
                />
              </ButtonBase>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Paper
        variant="outlined"
        sx={{ p: 1, position: 'relative', textAlign: 'right' }}
      >
        <Grid container>
          {months.map(({ month, streaks }) => (
            <Grid key={month} container item xs={12}>
              {month === 'Old' ? (
                <Grid item xs={2}>
                  <b>{month}</b>
                </Grid>
              ) : (
                <>
                  <Grid item xs={1}>
                    {month.substring(0, 2)}
                  </Grid>
                  <Grid item xs={1}>
                    <b>{month.substring(2, 4)}</b>
                  </Grid>
                </>
              )}
              <Streaks streaks={streaks} dataPrefix={`M-${month}`} />
            </Grid>
          ))}
          <Grid container item xs={12} sx={{ fontWeight: 'bold' }}>
            <Grid item xs={2} sx={{ height: '24px' }}>
              <ShowChart />
            </Grid>
            <Streaks streaks={sums} dataPrefix="S" />
          </Grid>
          {days.map(({ day, streaks, sum }) => (
            <Grid key={day} container item xs={12}>
              <Grid item xs={2} data-testid={`D-${day}`}>
                <b>{sum}</b>
              </Grid>
              <Streaks streaks={streaks} dataPrefix={`D-${day}`} />
            </Grid>
          ))}
        </Grid>
        <Box sx={{ position: 'absolute', bottom: '16px', right: '16px' }}>
          <Fab
            color={filterToday ? 'secondary' : 'default'}
            aria-label="today"
            sx={{ mr: 2 }}
            onClick={() => setFilterToday(!filterToday)}
          >
            {filterToday ? <EventBusy /> : <EventAvailable />}
          </Fab>
          <Fab color="primary" aria-label="refresh" onClick={() => fetch()}>
            <Refresh />
          </Fab>
        </Box>
      </Paper>
    </>
  );
}
