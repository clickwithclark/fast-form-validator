import { saveInput } from './saveInput';
import { executeStrategies } from './executeStrategies';

export function evaluateInput(event) {
  saveInput(event);
  executeStrategies();
}
