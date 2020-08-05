import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ButtonBase from '@material-ui/core/ButtonBase';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { deepOrange } from '@material-ui/core/colors';

import { get } from './utils';

const useStyles = makeStyles({
  cardAction: {
    width: '100%',
    display: 'block',
    textAlign: 'initial',
  },
  cardHeader: {
    padding: '8px',
  },
  avatar: {
    margin: '0 8px 0 0',
  },
  days: {
    marginTop: '16px',
  },
  number: {
    textAlign: 'right',
  },
});

const selected = {
  backgroundColor: deepOrange[500],
};

export default () => {
  const [langs, setLangs] = useState([]);
  const [days, setDays] = useState([]);
  const [months, setMonths] = useState([]);
  const [selectedLang, setSelectedLang] = useState('all');
  const classes = useStyles();

  useEffect(() => {
    const tzOffset = new Date().getTimezoneOffset();
    get(`/api/meta/${tzOffset}`, ({ langs: responseLangs, levels }) => {
      setLangs(Object.entries(responseLangs).sort());

      const newDays = [];
      const countBase = { E: 0, F: 0, J: 0, all: 0 };
      for (let i = 0; i < 11; i += 1) {
        newDays[i] = { day: i, streaks: [], sum: { ...countBase } };
        for (let j = 0; j < 11 - i && j < 10; j += 1) {
          newDays[i].streaks[j] = { streak: j, ...countBase };
        }
      }

      const monthSet = {};
      levels.forEach(({ level, summary }) => {
        const lang = level.substring(0, 1);
        const month = level.substring(1);
        monthSet[month] = month;
        summary.forEach(([streak, day, count]) => {
          const index = streak === 0 ? 9 : 10 - streak;
          newDays[day].streaks[index][lang] += count;
          newDays[day].streaks[index].all += count;
          newDays[day].sum[lang] += count;
          newDays[day].sum.all += count;
        });
      });
      setDays(newDays);

      let monthKeys = Object.keys(monthSet).sort();
      if (monthKeys.length > 10) {
        monthKeys = monthKeys.slice(-9);
        monthKeys.unshift('Old');
      }
      const newMonths = monthKeys.map((month) => ({ month, streaks: [] }));
      const monthMap = {};
      for (let i = 0; i < newMonths.length; i += 1) {
        const { month, streaks } = newMonths[i];
        monthMap[month] = newMonths[i];
        for (let j = 0; j < 10; j += 1) {
          streaks[j] = { streak: j, ...countBase };
        }
      }

      levels.forEach(({ level, summary }) => {
        const lang = level.substring(0, 1);
        const month = monthMap[level.substring(1)] ?? monthMap.Old;
        summary.forEach(([streak, , count]) => {
          const index = streak === 0 ? 9 : 10 - streak;
          month.streaks[index][lang] += count;
          month.streaks[index].all += count;
        });
      });
      setMonths(newMonths);
    });
  }, []);

  const toTitle = ({ learning, fresh }) => {
    return fresh === 0 ? learning : `${learning}.${fresh}`;
  };

  const filterByLang = (lang) => {
    setSelectedLang(lang === selectedLang ? 'all' : lang);
  };

  return (
    <>
      <Grid container spacing={1}>
        {langs.map(([lang, summary]) => (
          <Grid item key={lang} xs={4}>
            <Card variant="outlined">
              <ButtonBase
                className={classes.cardAction}
                onClick={() => filterByLang(lang)}
                aria-label={lang}
              >
                <CardHeader
                  classes={{
                    root: classes.cardHeader,
                    avatar: classes.avatar,
                  }}
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
      <Paper variant="outlined">
        <Grid container spacing={1} className={classes.days}>
          {months.map(({ month, streaks }) => (
            <Grid key={month} container item xs={12} spacing={1}>
              <Grid item xs={2} className={classes.number}>
                <b>{month}</b>
              </Grid>
              {streaks.map((streak) => (
                <Grid
                  key={streak.streak}
                  item
                  xs={1}
                  className={classes.number}
                  data-testid={`M-${month}-${streak.streak}`}
                >
                  {streak[selectedLang] === 0 ? null : streak[selectedLang]}
                </Grid>
              ))}
            </Grid>
          ))}
        </Grid>
      </Paper>
      <Paper variant="outlined">
        <Grid container spacing={1} className={classes.days}>
          {days.map(({ day, streaks, sum }) => (
            <Grid key={day} container item xs={12} spacing={1}>
              <Grid
                item
                xs={2}
                className={classes.number}
                data-testid={`D-${day}`}
              >
                <b>{sum[selectedLang]}</b>
              </Grid>
              {streaks.map((streak) => (
                <Grid
                  key={streak.streak}
                  item
                  xs={1}
                  className={classes.number}
                  data-testid={`D-${day}-${streak.streak}`}
                >
                  {streak[selectedLang] === 0 ? null : streak[selectedLang]}
                </Grid>
              ))}
            </Grid>
          ))}
        </Grid>
      </Paper>
    </>
  );
};
