import {SignatureTransfer} from '@uniswap/permit2-sdk'
import {signTypedData, readContract, prepareWriteContract, writeContract} from 'wagmi/actions'
import {usePublicClient, useAccount} from 'wagmi'
import {Hash, maxUint256, PublicClient, toHex, TypedDataDomain} from 'viem'
import {getBlock, getBlockNumber} from 'viem/actions'
import {useContext} from 'react'
import {ActiveTokenContext} from './context/ActiveTokenContext'
import {permit2Address} from './tokens'
import LightweightERC20 from './abi/LightweightERC20'

const encodeDeadline = async (client: PublicClient, seconds: bigint) => {
  const blockNumber = await getBlockNumber(client)
  const block = await getBlock(client, {blockNumber: blockNumber})
  const timestamp = block.timestamp
  return timestamp + seconds
}

interface getPermit2DataProps {
  token: Hash, 
  amount: bigint, 
  deadline?: bigint, 
  nonce?: Hash,
}

type UsePermit2 = () => {
  getPermit2Data: ({token, amount, deadline, nonce}: getPermit2DataProps) => Promise<{nonce: Hash, sig: Hash, encodedDeadline: bigint} | undefined>
}

const usePermit2: UsePermit2 = () => {
    const {ammAddress} = useContext(ActiveTokenContext)
    const client = usePublicClient()
    const {id: chainId} = client.chain
    const {address} = useAccount()

  /**
   * @description ensure `spender` has max allowance for `token` owned by `address`, to be used for max allowing spend by the permit2 contract
   */
  const ensureAllowed = async (token: Hash, spender: Hash) => {
    if (!address) return

    const allowance = await readContract({
      address: token,
      abi: LightweightERC20,
      functionName: 'allowance',
      args: [address, spender]
    })

    if (allowance === BigInt(0)) {
      const {request} = await prepareWriteContract({
        address: token,
        abi: LightweightERC20,
        functionName: 'approve',
        args: [spender, maxUint256]
      })

      await writeContract(request)
    }
  }

    // this is generic for any permit2 function
    /**
     * @param deadline - the unencoded deadline
     */
    const getPermit2DataInternal = async (client: PublicClient, ammAddress: Hash, permit2Address: Hash, address: Hash, token: Hash, amount: bigint, deadline: bigint, nonce?: Hash) => {
        // max allow the permit2 contract if not already
        await ensureAllowed(token, permit2Address)

        // fetch the current nonce if not passed one
        if (!nonce) {
          const blockNumber = await getBlockNumber(client)
          console.log('tohexing bloc num',blockNumber)
          const txCount = await client.request({method: 'eth_getTransactionCount', params: [address, toHex(blockNumber)]})
          nonce = txCount
      }

      // encode the deadline
      const encodedDeadline = await encodeDeadline(client, deadline)

        // create data to sign
      const data = SignatureTransfer.getPermitData(
        {
          permitted: {
            token,
            amount,
          },
          spender: ammAddress,
          nonce,
          deadline: encodedDeadline,
        },
        permit2Address,
        chainId,
      )
          console.log('hhh')

        // TODO type message correctly
        // sign data
      const sig = await signTypedData({
        domain: data.domain as TypedDataDomain,
        types: data.types,
        message: data.values,
        primaryType: 'PermitTransferFrom'
      })
          console.log('hhha22')

      return {nonce, sig, encodedDeadline}
    }

    // getPermit2Data hiding the internal parameters that stay the same
    const getPermit2Data = async({token, amount, deadline = BigInt(1000), nonce}: {token: Hash, amount: bigint, deadline?: bigint, nonce?: Hash}) => 
      address && getPermit2DataInternal(client, ammAddress, permit2Address, address, token, amount, deadline, nonce)

    return {
      getPermit2Data,
    }
}

export {
    usePermit2,
}
