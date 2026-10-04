import { runActivationOperator,activationOperatorFailure } from "./activation-operator";
runActivationOperator(false).catch(activationOperatorFailure);
