import { runActivationOperator,activationOperatorFailure } from "./activation-operator";
runActivationOperator(true).catch(activationOperatorFailure);
