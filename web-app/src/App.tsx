import { Button, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { add, isAfter } from "date-fns";
import KillThemNow from "./assets/kill-them-now.mp3";
import DieNow from "./assets/die-now.mp3";

const killAudio = new Audio(KillThemNow);
const dieAudio = new Audio(DieNow);

const timers = [
  [0, 20],
  [0, 40],
  [1, 0],
  [1, 20],
  [1, 40],
  [2, 0],
  [2, 20],
  [2, 40],
  [3, 0],
  [3, 20],
  [3, 40],
  [4, 0],
  [4, 20],
  [4, 40],
  [5, 0],
  [5, 20],
  [5, 40],
  [6, 0],
  [6, 30],
  [6, 59],
  [7, 27],
  [7, 55],
  [8, 23],
  [8, 51],
  [9, 18],
  [9, 46],
  [10, 14],
  [10, 52],
  [11, 28],
  [12, 4],
  [12, 40],
  [13, 16],
  [13, 52],
  [14, 28],
  [15, 4],
  [15, 40],
  [16, 25],
  [17, 9],
  [17, 53],
  [18, 37],
  [19, 21],
  [20, 5],
  [20, 49],
  [21, 40],
  [22, 32],
  [23, 24],
  [24, 16],
  [25, 8],
  [26, 8],
  [27, 8],
  [28, 8],
  [29, 8],
];
let baseTime = new Date();

const convertDigit = (time: number) => {
  return ("0" + time).slice(-2);
};

const TimerTable = (props: { timeElapsed: number }) => {
  return (
    <Grid
      container
      flexDirection={"column"}
      alignItems={"center"}
      justifyContent="center"
      sx={{ border: "1px solid black", padding: 5, width: "max-content" }}
    >
      <Typography>Respawn Times</Typography>
      <Grid
        container
        flexDirection={"row"}
        justifyContent={"center"}
        alignItems="center"
      >
        <Grid
          container
          direction="column"
          sx={{ width: "fit-content", paddingRight: 1 }}
        >
          {timers.slice(0, timers.length / 2).map((timer) => {
            const isPast = props.timeElapsed >= timer[0] * 60 + timer[1];
            return (
              <Grid item>
                <Typography align="center" sx={isPast ? { color: "red" } : {}}>
                  {convertDigit(timer[1] === 0 ? 30 - timer[0] : 29 - timer[0])}
                  :{timer[1] === 0 ? "00" : convertDigit(60 - timer[1])}
                </Typography>
              </Grid>
            );
          })}
        </Grid>
        <Grid container direction="column" sx={{ width: "fit-content" }}>
          {timers.slice(timers.length / 2, timers.length).map((timer) => {
            const isPast = props.timeElapsed >= timer[0] * 60 + timer[1];
            return (
              <Grid item>
                <Typography align="center" sx={isPast ? { color: "red" } : {}}>
                  {convertDigit(timer[1] === 0 ? 30 - timer[0] : 29 - timer[0])}
                  :{timer[1] === 0 ? "00" : convertDigit(60 - timer[1])}
                </Typography>
              </Grid>
            );
          })}
        </Grid>
      </Grid>
    </Grid>
  );
};

function App() {
  const [warInterval, setWarInterval] = useState<
    ReturnType<typeof setInterval>
  >(setTimeout(() => {}));
  const [timeRemaining, setTimeRemaining] = useState(20);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [timeSinceRespawn, setTimeSinceRespawn] = useState(
    Number.MAX_SAFE_INTEGER
  );

  useEffect(() => {
    if (
      timeSinceRespawn === 0 ||
      timeSinceRespawn === 5 ||
      timeSinceRespawn === 10
    ) {
      killAudio.play();
    }
  }, [timeSinceRespawn]);

  useEffect(() => {
    if (timeRemaining === 5) {
      dieAudio.play();
    }
  }, [timeRemaining]);

  const startTimer = () => {
    clearInterval(warInterval);
    baseTime = new Date();
    setTimeRemaining(20);
    setTimeElapsed(0);
    setTimeSinceRespawn(0);
    setIsStarted(true);
    const interval = setInterval(() => {
      const currentTime = new Date();
      for (let i = 0; i < timers.length; i++) {
        const timer = timers[i];
        const pastTime =
          i > 0
            ? add(baseTime, {
                minutes: timers[i - 1][0],
                seconds: timers[i - 1][1],
              })
            : baseTime;
        const futureTime = add(baseTime, {
          minutes: timer[0],
          seconds: timer[1],
        });
        const skip = isAfter(new Date(), futureTime);
        if (skip) continue;
        else {
          const timeDiff = currentTime.getTime() - futureTime.getTime();
          const elapsedDiff = currentTime.getTime() - baseTime.getTime();
          const timeSinceDiff = currentTime.getTime() - pastTime.getTime();
          setTimeRemaining(Math.abs(Math.floor(timeDiff / 1000)));
          setTimeElapsed(Math.abs(Math.floor(elapsedDiff / 1000)));
          setTimeSinceRespawn(Math.abs(Math.floor(timeSinceDiff / 1000)));
          break;
        }
      }
    }, 1000);
    setWarInterval(interval);
  };

  const endTimer = () => {
    clearInterval(warInterval);
    setTimeRemaining(20);
    setTimeElapsed(0);
    setIsStarted(false);
    setTimeSinceRespawn(Number.MAX_SAFE_INTEGER);
  };

  return (
    <Grid
      container
      direction="column"
      justifyContent={"center"}
      alignItems={"center"}
    >
      {isStarted && (
        <Typography variant="h3">{timeRemaining} until respawn</Typography>
      )}
      {timeRemaining < 6 && (
        <Typography variant="h4" sx={{ color: "red" }}>
          DIE NOW
        </Typography>
      )}
      {timeSinceRespawn < 10 && (
        <Typography variant="h1" sx={{ color: "green" }}>
          KILL NOW
        </Typography>
      )}
      <Button
        variant={isStarted ? "outlined" : "contained"}
        onClick={startTimer}
        sx={{ marginTop: 2, marginBottom: 2 }}
      >
        {!isStarted ? "Start War" : "Restart War"}
      </Button>
      <Button variant="contained" onClick={endTimer} sx={{ marginBottom: 2 }}>
        End War
      </Button>
      <TimerTable timeElapsed={timeElapsed} />
    </Grid>
  );
}

export default App;
