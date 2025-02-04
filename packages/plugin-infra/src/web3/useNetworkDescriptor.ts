import type { NetworkPluginID } from '@masknet/web3-shared-base'
import { useNetworkType } from './useNetworkType'
import { useCurrentWeb3NetworkPluginID } from './Context'
import { getPluginDefine } from '../manager/store'
import type { Web3Helper } from '../web3-helpers'

export function useNetworkDescriptor<S extends 'all' | void = void, T extends NetworkPluginID = NetworkPluginID>(
    expectedPluginID?: T,
    expectedChainIdOrNetworkTypeOrID?: string | number,
) {
    type Result = S extends 'all' ? Web3Helper.NetworkDescriptorAll : Web3Helper.Web3NetworkDescriptor<T>

    const pluginID = useCurrentWeb3NetworkPluginID(expectedPluginID)
    const networkType = useNetworkType(pluginID)

    return getPluginDefine(pluginID)?.declareWeb3Networks?.find((x) =>
        [x.chainId, x.type, x.ID].includes(expectedChainIdOrNetworkTypeOrID ?? networkType ?? ''),
    ) as Result
}
