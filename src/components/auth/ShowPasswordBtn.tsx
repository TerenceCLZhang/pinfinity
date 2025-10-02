import { Dispatch, SetStateAction } from "react";
import { Button } from "../ui/button";
import { Eye, EyeClosed } from "lucide-react";

const ShowPasswordBtn = ({
  viewPassword,
  setViewPassword,
  submitting,
}: {
  viewPassword: boolean;
  setViewPassword: Dispatch<SetStateAction<boolean>>;
  submitting: boolean;
}) => {
  return (
    <Button
      type="button"
      variant={"ghost"}
      size={"icon"}
      aria-label={viewPassword ? "Hide password" : "View password"}
      disabled={submitting}
      aria-disabled={submitting}
      onClick={() => setViewPassword(!viewPassword)}
      className="absolute right-1 top-1/2 -translate-y-1/2 cursor-pointer hover:text-primary hover:!bg-transparent"
    >
      {viewPassword ? <EyeClosed /> : <Eye />}
    </Button>
  );
};

export default ShowPasswordBtn;
