import {Contract, ContractFactory, JsonRpcProvider, Log, MaxUint256, Wallet } from "ethers";
import LightweightERC20 from "../out/LightweightERC20.sol/LightweightERC20.json"
import {abi as SeawaterABI}  from "../out/SeawaterAMM.sol/SeawaterAMM.json"
import test from "node:test"
import assert from "node:assert"
import {execSync} from "node:child_process";

function encodeSqrtPrice(price: number): BigInt {
    return BigInt(Math.sqrt(price) * 2**96);
}

function encodeTick(price: number): number {
    // log_1.0001(num/denom)
    return Math.floor(Math.log(price) / Math.log(1.0001));
}

async function deployToken(factory: ContractFactory, name: string, sym: string, decimals: number, amount: number, account: string) {
    const contract = await factory.deploy(name, sym, decimals, amount, account);
    const address = await contract.getAddress();
    await contract.waitForDeployment();
    return address;
}

test("amm", async t => {
    console.log(execSync("forge b").toString());
    const RPC_URL = process.env.RPC_URL ?? "http://127.0.0.1:8547"
    const provider = new JsonRpcProvider(RPC_URL)
    const signer = new Wallet("0xb6b15c8cb491557369f3c7d2c287b053eb229daa9c22138887752191c9520659", provider)
    const defaultAccount = await signer.getAddress();

    const erc20Factory = new ContractFactory(LightweightERC20.abi, LightweightERC20.bytecode, signer)

    const fusdcAddress = await deployToken(erc20Factory, "Fluid USDC", "FUSDC", 6, 1_000_000*1_000_000, defaultAccount);
    console.log("fusdc",fusdcAddress)

    const tusdcAddress = await deployToken(erc20Factory, "Test USDC", "TUSDC", 6, 1_000_000*1_000_000, defaultAccount);
    console.log("tusdc",tusdcAddress)

    let stdout = execSync(
        "./deploy.sh",
        { env: {
            "PROXY_ADMIN_ADDR": defaultAccount,
            "SEAWATER_ADMIN_ADDR": defaultAccount,
            "NFT_MANAGER_ADDR": defaultAccount,
            "FUSDC_TOKEN_ADDR": fusdcAddress,
            ...process.env,
        } },
    );
    let ammAddressMatch = stdout.toString().split("\n").find(line => line.startsWith("Deployed to: "))?.match(/(0x.{40})/);

    if (!ammAddressMatch) throw new Error("Amm address not found in deploy.sh output!");
    const ammAddress = ammAddressMatch[1]

    const amm = new Contract(ammAddress, SeawaterABI, signer);

    const fusdcContract = new Contract(fusdcAddress, LightweightERC20.abi, signer)
    const tusdcContract = new Contract(tusdcAddress, LightweightERC20.abi, signer)

    // address token,
    // uint256 sqrtPriceX96,
    // uint32 fee,
    // uint8 tickSpacing,
    // uint128 maxLiquidityPerTick
    let response = await amm.init(tusdcAddress, encodeSqrtPrice(100), 0, 1, 100000000000);

    await response.wait();
    // approve amm for both contracts
    // initialise an empty position
    // update the position with liquidity
    // then make a swap
    await (await fusdcContract.approve(ammAddress, MaxUint256)).wait()
    await (await tusdcContract.approve(ammAddress, MaxUint256)).wait()

    const mintResult = await amm.mintPosition(tusdcAddress, encodeTick(50), encodeTick(150))
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
        response = await amm.swap(tusdcAddress, true, 1000, encodeSqrtPrice(80))
        await response.wait();

        console.log("swap logs",(await provider.getTransactionReceipt(response.hash))?.logs)

        return;
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
