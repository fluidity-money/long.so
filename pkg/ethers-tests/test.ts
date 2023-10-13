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

// force mutable logs to allow parseLog (which doesn't mutate anyway)
type MutableLog = Omit<Log, 'topics'> & {topics: Array<string>}

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
    const {args}  = amm.interface.parseLog(mintLog as MutableLog) || {}
    const logArgs = args?.toArray()
    const [id, _, pool, low, high] = logArgs as mintEventArgs || []
    
    console.log("pool",pool,"id",id,"delta",high.valueOf() - low.valueOf())

    const updatePositionResult = await amm.updatePosition(tusdcAddress, id, 20000)
    await updatePositionResult.wait()
    const receipt = await provider.getTransactionReceipt(updatePositionResult.hash)

    await t.test("raw swap in amounts correct", async _ => {
        const fusdcBeforeBalance = await fusdcContract.balanceOf(defaultAccount)
        const tusdcBeforeBalance = await tusdcContract.balanceOf(defaultAccount)

        // TODO test on swapIn, not raw swap
        // address _token,
        // bool _zeroForOne,
        // int256 _amount,
        // uint256 _priceLimitX96
 
        // swap 10 tUSDC -> fUSDC without hitting the price limit
        response = await amm.swap(tusdcAddress, true, 10, encodeSqrtPrice(30))
        await response.wait();


        let fusdcAfterBalance = await fusdcContract.balanceOf(defaultAccount)
        let tusdcAfterBalance = await tusdcContract.balanceOf(defaultAccount)
        let expectedFusdcAfterBalance = fusdcBeforeBalance + BigInt(995);
        let expectedTusdcAfterBalance = tusdcBeforeBalance - BigInt(10);


        assert(fusdcAfterBalance === expectedFusdcAfterBalance, `expected balances to match! got: ${fusdcAfterBalance}, expected ${expectedFusdcAfterBalance}`)
        assert(tusdcAfterBalance === expectedTusdcAfterBalance, `expected balances to match! got: ${tusdcAfterBalance}, expected ${expectedTusdcAfterBalance}`)


        // swap 1000 fUSDC back to 10 tUSDC
        response = await amm.swap(tusdcAddress, false, 1000, encodeSqrtPrice(500))
        await response.wait();


        fusdcAfterBalance = await fusdcContract.balanceOf(defaultAccount)
        tusdcAfterBalance = await tusdcContract.balanceOf(defaultAccount)
        expectedFusdcAfterBalance -= BigInt(1000);
        expectedTusdcAfterBalance += BigInt(10);

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
    await t.test("price limits", async t => {
        t.todo();
    })
})
