export interface DiaryEntry {
  id: string;                    // UUID вместо числового ID
  dateTime: string;              // ISO string
  situationDescription: string;
  attentionFocus: string;
  thoughts: string;
  bodySensations: string;
  actions: string;
  futureActions: string;
}

export type FormStep = 
  | 'situation'
  | 'attention'
  | 'thoughts'
  | 'bodySensations'
  | 'actions'
  | 'futureActions';

export interface FormState {
  currentStep: FormStep;
  situationDescription: string;
  selectedAttentionOption: string | null;
  attentionText: string;
  selectedThoughtOption: string | null;
  thoughtsText: string;
  bodySensationsIntensity: number;
  bodySensationsText: string;
  actionsText: string;
  selectedActionResult: string | null;
  selectedFutureActionOption: string | null;
  futureActionsText: string;
  entryDateTime: Date;
}

