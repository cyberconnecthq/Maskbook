import { sha3, toHex } from 'web3-utils'
import { unreachable } from '@dimensiondev/kit'
import { Transaction, TransactionStateType } from '../types'
import { isEmptyHex } from './address'
import { ZERO_ADDRESS } from '../constants'

export function isEIP1559Transaction(receipt: Transaction) {
    return typeof receipt.maxFeePerGas !== 'undefined' && typeof receipt.maxPriorityFeePerGas !== 'undefined'
}

export function isFinalState(type: TransactionStateType) {
    return [TransactionStateType.CONFIRMED, TransactionStateType.FAILED].includes(type)
}

/**
 * UNKNOWN -> WAIT_FOR_CONFIRMING
 * UNKNOWN, WAIT_FOR_CONFIRMING -> HASH
 * UNKNOWN, WAIT_FOR_CONFIRMING, HASH -> RECEIPT
 * WAIT_FOR_CONFIRMING, HASH, RECEIPT -> CONFIRMED
 * UNKNOWN, WAIT_FOR_CONFIRMING, HASH, RECEIPT -> FAILED
 */
export function isNextStateAvailable(type: TransactionStateType, nextType: TransactionStateType) {
    switch (nextType) {
        case TransactionStateType.UNKNOWN:
            return false
        case TransactionStateType.WAIT_FOR_CONFIRMING:
            return [TransactionStateType.UNKNOWN].includes(type)
        case TransactionStateType.HASH:
            return [TransactionStateType.UNKNOWN, TransactionStateType.WAIT_FOR_CONFIRMING].includes(type)
        case TransactionStateType.RECEIPT:
            return [
                TransactionStateType.UNKNOWN,
                TransactionStateType.WAIT_FOR_CONFIRMING,
                TransactionStateType.HASH,
            ].includes(type)
        case TransactionStateType.CONFIRMED:
            return [
                TransactionStateType.WAIT_FOR_CONFIRMING,
                TransactionStateType.HASH,
                TransactionStateType.RECEIPT,
            ].includes(type)
        case TransactionStateType.FAILED:
            return [
                TransactionStateType.UNKNOWN,
                TransactionStateType.WAIT_FOR_CONFIRMING,
                TransactionStateType.HASH,
                TransactionStateType.RECEIPT,
            ].includes(type)
        default:
            unreachable(nextType)
    }
}

export function getData(config: Transaction) {
    const { data } = config
    if (!data) return
    if (isEmptyHex(data)) return
    if (!data.startsWith('0x')) return `0x${data}`
    return data
}

export function getTo(config: Transaction) {
    const { to } = config
    if (!to) return ZERO_ADDRESS
    if (isEmptyHex(to)) return ZERO_ADDRESS
    return to
}

export function getFunctionSignature(tx: Transaction) {
    const data = getData(tx)
    return data?.slice(0, 10)
}

export function getFunctionParameters(tx: Transaction) {
    const data = getData(tx)
    return data?.slice(10)
}

export function getTransactionSignature(transaction: Transaction | null) {
    if (!transaction) return
    const { from, to, data, value } = transaction
    return sha3([from, to, data || '0x0', toHex((value as string) || '0x0') || '0x0'].join('_')) ?? undefined
}
