import { Button, Dialog, TextField } from "@radix-ui/themes";
import { FormEvent, useState } from "react";

export default function LoadCodeBaseDialog(props: {
  busy: boolean;
  onLoad: (entrypoint: string, outputDir?: string) => void;
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [entrypoint, setEntrypoint] = useState<string>("");
  const [outputDir, setOutputDir] = useState<string>("");

  function handleAction(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    props.onLoad(entrypoint, outputDir || undefined);
    setIsOpen(false);
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <Dialog.Trigger>
        <Button disabled={props.busy} color="plum">
          <svg
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.81825 1.18188C7.64251 1.00615 7.35759 1.00615 7.18185 1.18188L4.18185 4.18188C4.00611 4.35762 4.00611 4.64254 4.18185 4.81828C4.35759 4.99401 4.64251 4.99401 4.81825 4.81828L7.05005 2.58648V9.49996C7.05005 9.74849 7.25152 9.94996 7.50005 9.94996C7.74858 9.94996 7.95005 9.74849 7.95005 9.49996V2.58648L10.1819 4.81828C10.3576 4.99401 10.6425 4.99401 10.8182 4.81828C10.994 4.64254 10.994 4.35762 10.8182 4.18188L7.81825 1.18188ZM2.5 9.99997C2.77614 9.99997 3 10.2238 3 10.5V12C3 12.5538 3.44565 13 3.99635 13H11.0012C11.5529 13 12 12.5528 12 12V10.5C12 10.2238 12.2239 9.99997 12.5 9.99997C12.7761 9.99997 13 10.2238 13 10.5V12C13 13.104 12.1062 14 11.0012 14H3.99635C2.89019 14 2 13.103 2 12V10.5C2 10.2238 2.22386 9.99997 2.5 9.99997Z"
              fill="currentColor"
              fill-rule="evenodd"
              clip-rule="evenodd"
            ></path>
          </svg>
          Load codebase
        </Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Title>Load codebase</Dialog.Title>
        <Dialog.Description>
          In order to load a representation of your codebase, please provide the
          entrypoint file of your application. We will then build a
          representation of your application endpoints.
        </Dialog.Description>
        <form onSubmit={handleAction}>
          <div className="flex flex-col gap-2 mt-2">
            <TextField.Root
              required
              value={entrypoint}
              onChange={(e) => {
                setEntrypoint(e.target.value);
              }}
              disabled={props.busy}
              type="text"
              placeholder="Absolute path of the entrypoint of your application"
            />
            <TextField.Root
              value={outputDir}
              onChange={(e) => {
                setOutputDir(e.target.value);
              }}
              disabled={props.busy}
              type="text"
              placeholder="Absolute path of the output directory of the split operation"
            />
          </div>
          <div className="flex justify-end gap-2 mt-2">
            <Dialog.Close>
              <Button color="red" disabled={props.busy}>
                Cancel
              </Button>
            </Dialog.Close>
            <Button type="submit" disabled={props.busy} color="green">
              Load
            </Button>
          </div>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
}
