
import { FanLevel } from '../types';

const levels: FanLevel[] = [
  { name: 'Bronze', minPoints: 0, nextLevelPoints: 5000, color: 'from-orange-700 to-orange-400' },
  { name: 'Prata', minPoints: 5001, nextLevelPoints: 10000, color: 'from-gray-500 to-gray-300' },
  { name: 'Ouro', minPoints: 10001, nextLevelPoints: 20000, color: 'from-yellow-600 to-yellow-300' },
  { name: 'Platina', minPoints: 20001, nextLevelPoints: null, color: 'from-teal-500 to-teal-200' },
];

export const getFanLevel = (points: number): FanLevel => {
  return levels.slice().reverse().find(level => points >= level.minPoints) || levels[0];
};

export const calculateLevelProgress = (points: number): { progressPercentage: number; pointsToNextLevel: number } => {
  const currentLevel = getFanLevel(points);
  
  if (!currentLevel.nextLevelPoints) {
    return { progressPercentage: 100, pointsToNextLevel: 0 };
  }
  
  const levelPointRange = currentLevel.nextLevelPoints - currentLevel.minPoints;
  const pointsInCurrentLevel = points - currentLevel.minPoints;
  
  const progressPercentage = Math.min((pointsInCurrentLevel / levelPointRange) * 100, 100);
  const pointsToNextLevel = currentLevel.nextLevelPoints - points;

  return {
    progressPercentage,
    pointsToNextLevel
  };
};