export type ExecuteCommandOptions = {
  focus?: boolean;
  fromConsole?: boolean;
};

export type ExecuteCommand = (
  command: string,
  options?: ExecuteCommandOptions,
) => void;
