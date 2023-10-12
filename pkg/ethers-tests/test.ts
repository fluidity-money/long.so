import {Contract, ContractFactory, JsonRpcProvider, Log, MaxUint256, Wallet } from "ethers";
import LightweightERC20 from "../out/LightweightERC20.sol/LightweightERC20.json"
import {abi as SeawaterABI}  from "../out/SeawaterAMM.sol/SeawaterAMM.json"
import test from "node:test"
import assert from "node:assert"

test("amm", async t => {
    const RPC_URL = process.env.RPC_URL ?? "http://127.0.0.1:8547"
    const defaultAccount = "0x3f1Eae7D46d88F08fc2F8ed27FCb2AB183EB2d0E";
    const provider = new JsonRpcProvider(RPC_URL)
    const signer = new Wallet("0xb6b15c8cb491557369f3c7d2c287b053eb229daa9c22138887752191c9520659", provider)

    // FIXME needs to be manually set
    const amm = new Contract("0xCA73cf68a91E7173d4A989A02227d9721519e585", SeawaterABI, signer);
    const erc20Factory = new ContractFactory(LightweightERC20.abi, LightweightERC20.bytecode, signer)

    const erc20ContractTusdc = await erc20Factory.deploy("Test USDC", "TUSDC", 6, 1_000_000*1_000_000, defaultAccount);
    const tusdcAddress = await erc20ContractTusdc.getAddress();
    await erc20ContractTusdc.waitForDeployment();
    console.log("tusdc",tusdcAddress)

    const erc20ContractFusdc = await erc20Factory.deploy("fUSDC", "fUSDC", 6, 1_000_000*1_000_000, defaultAccount);
    const fusdcAddress = await erc20ContractFusdc.getAddress();
    await erc20ContractFusdc.waitForDeployment();
    console.log("fusdc",fusdcAddress)

    const fusdcContract = new Contract(fusdcAddress, LightweightERC20.abi, signer)
    const tusdcContract = new Contract(tusdcAddress, LightweightERC20.abi, signer)
    
    // address token,
    // uint256 sqrtPriceX96,
    // uint32 fee,
    // uint8 tickSpacing,
    // uint128 maxLiquidityPerTick
    let response = await amm.init(tusdcAddress, BigInt("792281625142643375935439503360"),0,1,100000000000);
    await response.wait();
    // approve amm for both contracts
    // initialise an empty position
    // update the position with liquidity
    // then make a swap
    await (await fusdcContract.approve(await amm.getAddress(), MaxUint256)).wait()
    await (await tusdcContract.approve(await amm.getAddress(), MaxUint256)).wait()

    const mintResult = await amm.mintPosition(tusdcAddress, BigInt("39122"), BigInt("50108"))
    const [mintLog]: [mintLog: Log] = await mintResult.wait()
    type mintEventArgs = [
        BigInt,
        string,
        string,
        BigInt,
        BigInt,
    ]

    // has an issue with readonly typing
    // @ts-ignore
    const {args}  = amm.interface.parseLog(mintLog) || {}
    const [id, _, pool, low, high] = args as unknown as mintEventArgs

    // @ts-ignore
    console.log("pool",pool,"id",id,"delta",high - low)

    const updatePositionResult = await amm.updatePosition(tusdcAddress, id, 200)
    await updatePositionResult.wait()
    const receipt = await provider.getTransactionReceipt(updatePositionResult.hash)
    console.log("updatePosition logs",receipt?.logs)

    await t.test("swap in amounts correct", async _ => {
        const fusdcBeforeBalance = await fusdcContract.balanceOf(defaultAccount)
        const tusdcBeforeBalance = await tusdcContract.balanceOf(defaultAccount)

        // TODO test on swapIn, not raw swap
        // address _token,
        // bool _zeroForOne,
        // int256 _amount,
        // uint256 _priceLimitX96
        response = await amm.swap(tusdcAddress, true, 10000, BigInt("0x0000000000000000000000000000000000000007bef7ac53d3b66c5eba01e41f"))
        await response.wait();

        console.log("swap logs",(await provider.getTransactionReceipt(response.hash))?.logs)

        const fusdcAfterBalance = await fusdcContract.balanceOf(defaultAccount)
        const tusdcAfterBalance = await tusdcContract.balanceOf(defaultAccount)
        const expectedFusdcAfterBalance = fusdcBeforeBalance - BigInt(1000);
        const expectedTusdcAfterBalance = tusdcBeforeBalance - BigInt(1000);

        console.log("fusdc after",fusdcAfterBalance)
        console.log("tusdc after",tusdcAfterBalance)

        assert(fusdcAfterBalance === expectedFusdcAfterBalance, `expected balances to match! got: ${fusdcAfterBalance}, expected ${expectedFusdcAfterBalance}`)
        assert(tusdcAfterBalance === expectedTusdcAfterBalance, `expected balances to match! got: ${tusdcAfterBalance}, expected ${expectedTusdcAfterBalance}`)

    })
    // await t.test("swap out amounts correct", async _ => {
    //     const fusdcBeforeBalance = await fusdcContract.balanceOf(defaultAccount)
    //     const tusdcBeforeBalance = await tusdcContract.balanceOf(defaultAccount)

    //     response = await amm.swapOut(tusdcAddress, 10, 0)

    //     const fusdcAfterBalance = await fusdcContract.balanceOf(defaultAccount)
    //     const tusdcAfterBalance = await tusdcContract.balanceOf(defaultAccount)
    //     const expectedFusdcAfterBalance = fusdcBeforeBalance - BigInt(10);
    //     const expectedTusdcAfterBalance = tusdcBeforeBalance - BigInt(10);

    //     assert(fusdcAfterBalance === expectedFusdcAfterBalance, `expected balances to match! got: ${fusdcAfterBalance}, expected ${expectedFusdcAfterBalance}`)
    //     assert(tusdcAfterBalance === expectedTusdcAfterBalance, `expected balances to match! got: ${tusdcAfterBalance}, expected ${expectedTusdcAfterBalance}`)
    // })

    await t.test("raw swap", async t => {
        t.todo();
    })
    await t.test("swap to exact in", async t => {
        t.todo();
    })
    await t.test("admin functions", async t => {
        t.todo();
    })
})
