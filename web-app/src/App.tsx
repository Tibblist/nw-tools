import { Button, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { add, isAfter } from "date-fns";

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
  [5, 36],
  [6, 32],
  [7, 0],
  [7, 56],
  [8, 23],
  [8, 52],
  [9, 20],
  [9, 48],
  [10, 7],
  [10, 52],
  [11, 29],
  [12, 3],
  [12, 40],
  [13, 44],
  [14, 28],
  [15, 4],
  [15, 40],
  [17, 8],
  [19, 12],
  [19, 56],
  [20, 48],
  [21, 40],
  [22, 32],
  [23, 24],
  [24, 16],
  [25, 8],
  [28, 8],
  [29, 10],
  [29, 60],
];
let baseTime = new Date();

const convertDigit = (time: number) => {
  return ("0" + time).slice(-2);
};

const TimerTable = (props: { timeElapsed: number }) => {
  console.debug(props.timeElapsed);
  return (
    <Grid item sx={{ border: "1px solid black", padding: 5 }}>
      <Typography>Respawn Times</Typography>
      {timers.map((timer) => {
        const isPast = props.timeElapsed >= timer[0] * 60 + timer[1];
        return (
          <Typography align="center" sx={isPast ? { color: "red" } : {}}>
            {convertDigit(timer[1] === 0 ? 30 - timer[0] : 29 - timer[0])}:
            {timer[1] === 0 ? "00" : convertDigit(60 - timer[1])}
          </Typography>
        );
      })}
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

  const startTimer = () => {
    clearInterval(warInterval);
    baseTime = new Date();
    setTimeRemaining(20);
    setIsStarted(true);
    const interval = setInterval(() => {
      const currentTime = new Date();
      for (let i = 0; i < timers.length; i++) {
        const timer = timers[i];
        const pastTime = add(baseTime, {
          minutes: timer[0],
          seconds: timer[1],
        });
        const skip = isAfter(new Date(), pastTime);
        if (skip) continue;
        else {
          const timeDiff = currentTime.getTime() - pastTime.getTime();
          const elapsedDiff = currentTime.getTime() - baseTime.getTime();
          setTimeRemaining(Math.abs(Math.floor(timeDiff / 1000)));
          setTimeElapsed(Math.abs(Math.floor(elapsedDiff / 1000)));
          break;
        }
      }
    }, 1000);
    setWarInterval(interval);
  };

  console.log(isStarted);

  return (
    <Grid
      container
      direction="column"
      justifyContent={"center"}
      alignItems={"center"}
    >
      {isStarted && <Typography>{timeRemaining} until respawn</Typography>}
      <Button onClick={startTimer}>
        {!isStarted ? "Start War" : "Restart War"}
      </Button>
      <TimerTable timeElapsed={timeElapsed} />
    </Grid>
  );
}

export default App;
