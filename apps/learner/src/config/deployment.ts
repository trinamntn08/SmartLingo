export type LearnerDeploymentMode = 'local' | 'hosted';

export type LearnerCapabilities = Readonly<{
  mode: LearnerDeploymentMode;
  label: 'LOCAL PREVIEW' | 'FREE TEST PREVIEW';
  localContentApi: boolean;
  aiPractice: boolean;
  neuralSpeechGeneration: boolean;
}>;

const localCapabilities: LearnerCapabilities = {
  mode: 'local',
  label: 'LOCAL PREVIEW',
  localContentApi: true,
  aiPractice: true,
  neuralSpeechGeneration: true,
};

const hostedCapabilities: LearnerCapabilities = {
  mode: 'hosted',
  label: 'FREE TEST PREVIEW',
  localContentApi: false,
  aiPractice: false,
  neuralSpeechGeneration: false,
};

export function resolveLearnerCapabilities(value: string | undefined): LearnerCapabilities {
  return value === 'hosted' ? hostedCapabilities : localCapabilities;
}

export const learnerCapabilities = resolveLearnerCapabilities(
  process.env.EXPO_PUBLIC_SMARTLINGO_DEPLOYMENT_MODE,
);
