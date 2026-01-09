import Title from "../utils/Title";

type FormProps = {
  title: string;
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void | Promise<void>;
  footer: React.ReactNode;
};

export default function AuthFormTemplate({ title, children, onSubmit, footer }: FormProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 md:gap-8 h-full px-12 md:px-48 min-h-0 py-4 md:py-0">
      <Title dark className="flex-shrink-0">
        {title}
      </Title>
      <div className="flex flex-col justify-start w-full flex-shrink-0">
        <form
          className="flex flex-col items-center gap-3 justify-center w-full max-w-[600px]  md:w-auto md:max-w-none"
          onSubmit={onSubmit}
        >
          {children}
        </form>
      </div>
      {footer}
    </div>
  );
}
