class Timer {
  constructor () {
    this.isActive = false;
    this.isComplete = false;
    this.startTime = 0;
    this.totalTimeElapsed = 0;
    this.goalTime = 1000 * 60 * 25;
  }

  raiseGoalTime () {
    if (this.goalTime < 1000 * 60 * 90) {
      this.goalTime = this.goalTime + (1000 * 60);
    }
  }

  lowerGoalTime () {
    if (this.goalTime > 1000 * 60) {
      this.goalTime = this.goalTime - (1000 * 60);
    }
  }

  timeElapsed () {
    return Date.now() - this.startTime;
  }

  getTime () {
    if (this.isActive) {
      return this.goalTime - (this.totalTimeElapsed + this.timeElapsed());
    }
    return this.goalTime - this.totalTimeElapsed;
  }

  start () {
    if (!this.isActive) {
      this.isActive = true;
      this.startTime = Date.now();
    }
  }

  pause () {
    if (this.isActive) {
      this.isActive = false;
      this.totalTimeElapsed += this.timeElapsed();
    }
  }

  reset () {
    this.isActive = false;
    this.isComplete = false;
    this.startTime = 0;
    this.totalTimeElapsed = 0;
    document.getElementById('message-bar').textContent = "Pomodoro Clock";
  }
}

// Time formatter
const formatSecToMMSS = (sec) => {
  const min = Math.floor(sec / 60);
  const remSec = sec % 60;

  return twoDigits(min) + ':' + twoDigits(remSec);
};

const twoDigits = (num) => {
  if (num < 10) {
    return '0' + num.toString();
  } else {
    return num.toString();
  }
};

// Main function
const pomodoro = new Timer();
const breakTimer = new Timer();
pomodoro.goalTime = 1000 * 60 * 25;
breakTimer.goalTime = 1000 * 60 * 5;

document.addEventListener('DOMContentLoaded', () => {
  intervalTimer();
});

// Display current time parameters
const intervalTimer = () => {
  document.getElementById('pomodoro-time').textContent = pomodoro.goalTime / (1000 * 60);
  document.getElementById('break-time').textContent = breakTimer.goalTime / (1000 * 60);

  const interval = setInterval(() => {
    const timeInSec = Math.round(pomodoro.getTime() / 1000);
    if (timeInSec > 0) {
      document.getElementById('time-display').textContent = formatSecToMMSS(timeInSec);
    }
    if (timeInSec === 0 && !pomodoro.isComplete) {
      pomodoro.isComplete = true;
      breakTimer.start();
      pomodoro.pause();
    }

    // Message Bar
    if (!pomodoro.isComplete && timeInSec < (pomodoro.goalTime / 1000)) {
      document.getElementById('message-bar').textContent = 'Stay focused!';
    } else {
      if (!breakTimer.isComplete && pomodoro.isComplete) {
        document.getElementById('message-bar').textContent = 'Time for a break!';
      }
    }

    // Start Break Timer
    if (pomodoro.isComplete) {
      const breakTimeInSec = Math.round(breakTimer.getTime() / 1000);
      document.getElementById('time-display').textContent = formatSecToMMSS(breakTimeInSec);

      if (breakTimeInSec === 0) {
        document.getElementById('message-bar').textContent = 'Great work!';
        breakTimer.reset();
        clearInterval(interval);
      }
    }
  }, 100);
};

// Start button
document.getElementById('start').addEventListener('click', () => {
  if (!pomodoro.isComplete) {
    pomodoro.start();
  } else {
    breakTimer.start();
  }
});

// Pause button
document.getElementById('pause').addEventListener('click', () => {
  if (!pomodoro.isComplete) {
    pomodoro.pause();
  } else {
    breakTimer.pause();
  }
});

// Reset button
document.getElementById('reset').addEventListener('click', () => {
  pomodoro.reset();
  breakTimer.reset();
  pomodoro.goalTime = 1000 * 60 * 25;
  breakTimer.goalTime = 1000 * 60 * 5;
  intervalTimer();
});

// Pomodoro Time Toggle Buttons
document.getElementById('lower-pomo-time').addEventListener('click', () => {
  pomodoro.lowerGoalTime();
  document.getElementById('pomodoro-time').textContent = pomodoro.goalTime / (1000 * 60);
});

document.getElementById('raise-pomo-time').addEventListener('click', () => {
  pomodoro.raiseGoalTime();
  document.getElementById('pomodoro-time').textContent = pomodoro.goalTime / (1000 * 60);
});

// Break Time Toggle Buttons
document.getElementById('lower-break-time').addEventListener('click', () => {
  breakTimer.lowerGoalTime();
  document.getElementById('break-time').textContent = breakTimer.goalTime / (1000 * 60);
});

document.getElementById('raise-break-time').addEventListener('click', () => {
  breakTimer.raiseGoalTime();
  document.getElementById('break-time').textContent = breakTimer.goalTime / (1000 * 60);
});
