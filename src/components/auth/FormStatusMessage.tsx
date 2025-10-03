const FormStatusMessage = ({
  message,
  error = true,
}: {
  message: string | null;
  error?: boolean;
}) => {
  if (message == null) {
    return;
  }

  return (
    <div
      className={`bg-neutral-100 rounded-lg p-5 text-center text-sm font-bold ${
        error && "text-red-500"
      }`}
    >
      <p>{message}</p>
    </div>
  );
};

export default FormStatusMessage;
