const FormErrorMessage = ({
  errorMessage,
}: {
  errorMessage: string | null;
}) => {
  if (errorMessage == null) {
    return;
  }

  return (
    <div className="bg-neutral-100 rounded-lg p-5 text-center text-sm font-bold text-red-500">
      <p>{errorMessage}</p>
    </div>
  );
};

export default FormErrorMessage;
