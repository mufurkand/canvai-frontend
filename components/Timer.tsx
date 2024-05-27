import { useTimer } from "react-timer-hook";

export default function MyTimer({
  expiryTimestamp,
  expireFunction,
}: {
  expiryTimestamp: Date;
  expireFunction: () => void;
}) {
  const { totalSeconds } = useTimer({
    expiryTimestamp,
    onExpire: expireFunction,
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
