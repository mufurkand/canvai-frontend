import { useTimer } from "react-timer-hook";

export default function MyTimer({
  expiryTimestamp,
  setIsLocked,
  saveCroppedCanvas,
  key,
}: {
  expiryTimestamp: Date;
  setIsLocked: React.Dispatch<React.SetStateAction<boolean>>;
  saveCroppedCanvas: () => void;
  key: number;
}) {
  const { totalSeconds } = useTimer({
    expiryTimestamp,
    onExpire: () => {
      setIsLocked(true);
      saveCroppedCanvas();
    },
  });

  return (
    <div className="flex flex-col items-center">
      <p className="text-lg text-center">
        Remaining <br /> Time
      </p>
      <p className="text-4xl">{totalSeconds}</p>
    </div>
  );
}
