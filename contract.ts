import {
    allowance,
    approve,
    decreaseAllowance,
    increaseAllowance,
    balanceOf,
    owner,
    totalSupply,
    transfer,
    transferFrom,
    AtomicAssetState
} from "atomic-asset-typescript";

declare global {
    var ContractError: any;
}

type Action = {
    input: Record<string, any>
}

export function handle(state: AtomicAssetState, action: Action) {
    const { input } = action;

    switch (action.input.function) {
        case FUNCTIONS.TRANSFER:
            return transfer(state, input.to, input.amount);
        case FUNCTIONS.TRANSFER_FROM:
            return transferFrom(state, input.from, input.to, input.amount);
        case FUNCTIONS.APPROVE:
            return approve(state, input.spender, input.amount);
        case FUNCTIONS.ALLOWANCE:
            return allowance(state, input.owner, input.spender);
        case FUNCTIONS.BALANCE_OF:
            return balanceOf(state, input.target);
        case FUNCTIONS.TOTAL_SUPPLY:
            return totalSupply(state);
        case FUNCTIONS.INCREASE_ALLOWANCE:
            return increaseAllowance(state, input.spender, input.amountToAdd);
        case FUNCTIONS.DECREASE_ALLOWANCE:
            return decreaseAllowance(state, input.spender, input.amountToSubtract);
        case FUNCTIONS.OWNER:
            return owner(state);
        default:
            throw new ContractError(`Function ${action.input.function} is not supported by this contract`)
    }

}

enum FUNCTIONS {
    TRANSFER = 'transfer',
    TRANSFER_FROM = 'transferFrom',
    ALLOWANCE = 'allowance',
    APPROVE = 'approve',
    BALANCE_OF = 'balanceOf',
    TOTAL_SUPPLY = 'totalSupply',
    OWNER = 'owner',
    INCREASE_ALLOWANCE = 'increaseAllowance',
    DECREASE_ALLOWANCE = 'decreaseAllowance'
}
