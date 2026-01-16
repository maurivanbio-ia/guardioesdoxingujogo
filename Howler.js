import { Howl } from 'howler';

const playAchievementSound = () => {
  const sound = new Howl({ src: ['/sounds/achievement.mp3'], volume: 0.4 });
  sound.play();
  if (navigator.vibrate) navigator.vibrate([30, 20, 30]);
};
