export const MdxError: React.FC<{ error: string | Error | any }> = ({
  error,
}) => {
  let message: string;
  if (typeof error === "string") message = error;
  else if ("message" in error) message = error.message;
  else message = JSON.stringify(error);

  return (
    <div className="flex flex-col gap-1 w-full">
      <div>Something went wrong</div>
      <div className="text-destructive">{message}</div>
    </div>
  );
};
