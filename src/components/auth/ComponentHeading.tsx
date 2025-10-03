const ComponentHeading = ({
  heading,
  subheading,
}: {
  heading: string;
  subheading: string;
}) => {
  return (
    <div className="text-center">
      <h1 className="text-4xl mb-2">{heading}</h1>
      <span className=" text-lg">{subheading}</span>
    </div>
  );
};

export default ComponentHeading;
