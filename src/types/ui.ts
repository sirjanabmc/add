// Common loading and error states for service actions
export type ActionStatus = {
  loading: boolean;
  error: string | null;
};

export type ActionMap = {
  delete?: ActionStatus;
  edit?: ActionStatus;
  call?: ActionStatus;
};