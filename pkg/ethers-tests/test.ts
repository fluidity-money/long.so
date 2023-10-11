import {Contract, ContractFactory, JsonRpcProvider, Wallet } from "ethers";
import LightweightERC20 from "../out/LightweightERC20.sol/LightweightERC20.json"
import {abi as SeawaterABI}  from "../out/SeawaterAMM.sol/SeawaterAMM.json"
import test from "node:test"
import assert from "node:assert"

test("amm", async t => {
    const RPC_URL = process.env.RPC_URL ?? "http://127.0.0.1:8547"
    const defaultAccount = "0x3f1Eae7D46d88F08fc2F8ed27FCb2AB183EB2d0E";
    const provider = new JsonRpcProvider(RPC_URL)
    const signer = new Wallet("0xb6b15c8cb491557369f3c7d2c287b053eb229daa9c22138887752191c9520659", provider)

    const amm = new Contract("0x4CeF6f83aD0176094a2Cf9dF04Edc8B730600E44", SeawaterABI, signer);
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
    let response = await amm.init(fusdcAddress, 1,0,2,10000000000);
    console.log("init result",response)

    await t.test("swap in amounts correct", async _ => {
        const fusdcBeforeBalance = await fusdcContract.balanceOf(defaultAccount)
        const tusdcBeforeBalance = await tusdcContract.balanceOf(defaultAccount)

        response = await amm.swapIn(tusdcAddress, 10, 0)
        console.log("result",response)

        const fusdcAfterBalance = await fusdcContract.balanceOf(defaultAccount)
        const tusdcAfterBalance = await tusdcContract.balanceOf(defaultAccount)
        const expectedFusdcAfterBalance = fusdcBeforeBalance - BigInt(10);
        const expectedTusdcAfterBalance = tusdcBeforeBalance - BigInt(10);

        assert(fusdcAfterBalance === expectedFusdcAfterBalance, `expected balances to match! got: ${fusdcAfterBalance}, expected ${expectedFusdcAfterBalance}`)
        assert(tusdcAfterBalance === expectedTusdcAfterBalance, `expected balances to match! got: ${tusdcAfterBalance}, expected ${expectedTusdcAfterBalance}`)

    })
    await t.test("swap out amounts correct", async _ => {
        const fusdcBeforeBalance = await fusdcContract.balanceOf(defaultAccount)
        const tusdcBeforeBalance = await tusdcContract.balanceOf(defaultAccount)

        response = await amm.swapOut(tusdcAddress, 10, 0)

        const fusdcAfterBalance = await fusdcContract.balanceOf(defaultAccount)
        const tusdcAfterBalance = await tusdcContract.balanceOf(defaultAccount)
        const expectedFusdcAfterBalance = fusdcBeforeBalance - BigInt(10);
        const expectedTusdcAfterBalance = tusdcBeforeBalance - BigInt(10);

        assert(fusdcAfterBalance === expectedFusdcAfterBalance, `expected balances to match! got: ${fusdcAfterBalance}, expected ${expectedFusdcAfterBalance}`)
        assert(tusdcAfterBalance === expectedTusdcAfterBalance, `expected balances to match! got: ${tusdcAfterBalance}, expected ${expectedTusdcAfterBalance}`)
    })

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
