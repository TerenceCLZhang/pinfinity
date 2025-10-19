import { Spinner } from "./ui/spinner";


const LoadingSpinner = () => {
  return (
    <div className="flex justify-center py-10">
      <Spinner className="size-10 text-primary" />
    </div>
  );
};

export default LoadingSpinner;
