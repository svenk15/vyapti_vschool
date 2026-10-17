import type {AssistantModelPort} from '../application/assistant';
import {deterministicDraft,validateNumbers} from '../domain/assistant';

export class DeterministicAssistantModel implements AssistantModelPort {
 async generate(input:Parameters<AssistantModelPort['generate']>[0]){const text=deterministicDraft(input.facts);return {text,providerCode:'deterministic-test-v1',evaluation:{citationsValid:true,numbersValid:validateNumbers(text,input.facts),sourceMinimized:true,providerSynthetic:true,warnings:['Synthetic deterministic adapter; no approved AI provider was called.','No causal explanation, ranking or consequential action was generated.']}} as const;}
}
