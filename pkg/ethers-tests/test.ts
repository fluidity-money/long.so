import {Contract, ContractFactory, JsonRpcProvider, Log, MaxUint256, Provider, TypedDataDomain, Wallet, id } from "ethers";
import LightweightERC20 from "../out/LightweightERC20.sol/LightweightERC20.json"
import Permit2 from "../out/permit2.sol/Permit2.json"
import {abi as SeawaterABI}  from "../out/SeawaterAMM.sol/SeawaterAMM.json"
import test from "node:test"
import assert from "node:assert"
import {execSync} from "node:child_process";

import { SignatureTransfer } from "@uniswap/permit2-sdk";

// stylus testnode wallet
const DEFAULT_WALLET = "0xb6b15c8cb491557369f3c7d2c287b053eb229daa9c22138887752191c9520659";

function encodeSqrtPrice(price: number): BigInt {
    return BigInt(Math.sqrt(price) * 2**96);
}

function sixDecimals(amount: number): BigInt {
    return BigInt(amount) * BigInt(1_000_000);
}

function encodeTick(price: number): number {
    // log_1.0001(num/denom)
    return Math.floor(Math.log(price) / Math.log(1.0001));
}

async function encodeDeadline(signer: Provider, seconds: number) {
    const bn = await signer.getBlockNumber();
    const timestamp = (await signer.getBlock(bn))!.timestamp;
    return timestamp + seconds;
}

async function deployToken(factory: ContractFactory, name: string, sym: string, decimals: number, amount: BigInt, account: string) {
    const contract = await factory.deploy(name, sym, decimals, amount, account);
    const address = await contract.getAddress();
    await contract.waitForDeployment();
    return address;
}

async function deployPermit2(factory: ContractFactory) {
    const contract = await factory.deploy();
    const address = await contract.getAddress();
    await contract.waitForDeployment();
    return address;
}

async function setApprovalTo(tokens: Contract[], to: string, amount: BigInt) {
    for (const token of tokens) {
        await (await token.approve(to, amount)).wait()
    }
}

// mints a position and updates it with liquidity
async function createPosition(
    amm: Contract,
    address: string,
    lower: number,
    upper: number,
    delta: BigInt,
) {
    const mintResult = await amm.mintPosition(address, lower, upper);

    const [mintLog]: [mintLog: Log] = await mintResult.wait()
    console.log(mintLog);
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
    const [id, /*user*/, /*pool*/, /*low*/, /*high*/] = args as unknown as mintEventArgs

    const updatePositionResult = await amm.updatePosition(address, id, delta)
    await updatePositionResult.wait()

    return id;
}

test("amm", async t => {
    // setup and deploy contracts
    const RPC_URL = process.env.RPC_URL
    if (!RPC_URL) throw new Error("Set RPC_URL");
    const provider = new JsonRpcProvider(RPC_URL)
    const chainid = Number((await provider.getNetwork()).chainId);
    console.log(`chainid: ${chainid}`);
    const signer = new Wallet(DEFAULT_WALLET, provider)
    const defaultAccount = await signer.getAddress();

    const permit2Factory = new ContractFactory(Permit2.abi, Permit2.bytecode, signer);
    const permit2Address = await deployPermit2(permit2Factory);

    const erc20Factory = new ContractFactory(LightweightERC20.abi, LightweightERC20.bytecode, signer)

    const fusdcAddress = await deployToken(erc20Factory, "Fluid USDC", "FUSDC", 6, sixDecimals(1_000_000), defaultAccount);
    console.log("fusdc",fusdcAddress)

    const tusdcAddress = await deployToken(erc20Factory, "Test USDC", "TUSDC", 6, sixDecimals(1_000_000), defaultAccount);
    console.log("tusdc",tusdcAddress)

    const tusdc2Address = await deployToken(erc20Factory, "Test USDC 2.0", "TUSDC2", 6, sixDecimals(1_000_000), defaultAccount);
    console.log("tusdc2",tusdc2Address)

    let stdout = execSync(
        "./deploy.sh",
        { env: {
            "PROXY_ADMIN_ADDR": defaultAccount,
            "SEAWATER_ADMIN_ADDR": defaultAccount,
            "NFT_MANAGER_ADDR": defaultAccount,
            "FUSDC_TOKEN_ADDR": fusdcAddress,
            "PERMIT2_ADDR": permit2Address,
            ...process.env,
        } },
    );
    let ammAddressMatch = stdout.toString().split("\n").find(line => line.startsWith("Deployed to: "))?.match(/(0x.{40})/);

    if (!ammAddressMatch) throw new Error("Amm address not found in deploy.sh output!");
    const ammAddress = ammAddressMatch[1]

    const amm = new Contract(ammAddress, SeawaterABI, signer);

    const fusdcContract = new Contract(fusdcAddress, LightweightERC20.abi, signer)
    const tusdcContract = new Contract(tusdcAddress, LightweightERC20.abi, signer)
    const tusdc2Contract = new Contract(tusdc2Address, LightweightERC20.abi, signer)

    // address token,
    // uint256 sqrtPriceX96,
    // uint32 fee,
    // uint8 tickSpacing,
    // uint128 maxLiquidityPerTick
    await (await amm.createPool(tusdcAddress, encodeSqrtPrice(100), 0, 1, 100000000000)).wait();
    await (await amm.createPool(tusdc2Address, encodeSqrtPrice(100), 0, 1, 100000000000)).wait();

    // approve amm for both contracts
    // initialise an empty position
    // update the position with liquidity
    // then make a swap
    await setApprovalTo([fusdcContract, tusdcContract, tusdc2Contract], permit2Address, MaxUint256);

    const lowerTick = encodeTick(50);
    const upperTick = encodeTick(150);
    const liquidityDelta = BigInt(20000);

    await setApprovalTo([fusdcContract, tusdcContract, tusdc2Contract], ammAddress, MaxUint256);

    await createPosition(amm, tusdcAddress, lowerTick, upperTick, liquidityDelta);
    await createPosition(amm, tusdc2Address, lowerTick, upperTick, liquidityDelta);

    await setApprovalTo([fusdcContract, tusdcContract, tusdc2Contract], ammAddress, BigInt(0));

    await t.test("raw swap in amounts correct", async _ => {
        const fusdcBeforeBalance = await fusdcContract.balanceOf(defaultAccount)
        const tusdcBeforeBalance = await tusdcContract.balanceOf(defaultAccount)

        // TODO test on swapIn, not raw swap
        // address _token,
        // bool _zeroForOne,
        // int256 _amount,
        // uint256 _priceLimitX96

        const token = tusdcAddress;
        const amount = 10;
        const nonce = 1;
        const deadline = await encodeDeadline(provider, 1000);
        const max_amount = amount;

        const data = SignatureTransfer.getPermitData(
            {
                permitted: {
                    token,
                    amount: max_amount,
                },
                spender: ammAddress,
                nonce: nonce,
                deadline: deadline,
            },
            permit2Address,
            chainid,
        );

        const sig = await signer.signTypedData(data.domain as TypedDataDomain, data.types, data.values);

        // swap 10 tUSDC -> fUSDC without hitting the price limit
        let response = await amm.swapPermit2(
            tusdcAddress,
            true,
            10,
            encodeSqrtPrice(30),
            nonce,
            deadline,
            max_amount,
            sig,
        )
        await response.wait();

        let fusdcAfterBalance = await fusdcContract.balanceOf(defaultAccount)
        let tusdcAfterBalance = await tusdcContract.balanceOf(defaultAccount)

        // after the swap we expect to pay 10 tokens and get ~1000
        let expectedFusdcAfterBalance = fusdcBeforeBalance + BigInt(995);
        let expectedTusdcAfterBalance = tusdcBeforeBalance - BigInt(10);


        assert(fusdcAfterBalance === expectedFusdcAfterBalance, `expected fusdc balances to match! starting bal: ${fusdcBeforeBalance},  finishing: ${fusdcAfterBalance}, expected ${expectedFusdcAfterBalance}`)
        assert(tusdcAfterBalance === expectedTusdcAfterBalance, `expected tusdc balances to match! starting bal: ${tusdcBeforeBalance}, finishing: ${tusdcAfterBalance}, expected ${expectedTusdcAfterBalance}`)


        return;

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
