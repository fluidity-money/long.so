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
    const [id, /*user*/, /*pool*/, /*low*/, /*high*/] = args as unknown as mintEventArgs;

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
    console.log("permit2",permit2Address)

    const erc20Factory = new ContractFactory(LightweightERC20.abi, LightweightERC20.bytecode, signer)

    const fusdcAddress = await deployToken(erc20Factory, "Fluid USDC", "FUSDC", 6, sixDecimals(1_000_000), defaultAccount);
    console.log("fusdc",fusdcAddress)

    const tusdcAddress = await deployToken(erc20Factory, "Test USDC", "TUSDC", 6, sixDecimals(1_000_000), defaultAccount);
    console.log("tusdc",tusdcAddress)

    const tusdc2Address = await deployToken(erc20Factory, "Test USDC 2.0", "TUSDC2", 6, sixDecimals(1_000_000), defaultAccount);
    console.log("tusdc2",tusdc2Address)

    execSync(
      "make -B build",
      { env: {
          "FLU_SEAWATER_FUSDC_ADDR": fusdcAddress,
          "FLU_SEAWATER_PERMIT2_ADDR": permit2Address,
          ...process.env,
      } }
    );

    // assuming this went correctly!
    const {
      seawater_proxy: ammAddress,
      seawater_positions_impl: seawaterPositionsImplAddr
    } = JSON.parse(execSync(
        "./deploy.sh",
        { env: {
            "SEAWATER_PROXY_ADMIN": defaultAccount,
            "FLU_SEAWATER_FUSDC_ADDR": fusdcAddress,
            "STYLUS_ENDPOINT": RPC_URL,
            "STYLUS_PRIVATE_KEY": DEFAULT_WALLET,
            "FLU_SEAWATER_PERMIT2_ADDR": permit2Address,
            "NFT_MANAGER_ADDR": defaultAccount,
            ...process.env,
        } },
    )
      .toString()
    );

    console.log("seawater positions impl", seawaterPositionsImplAddr);
    console.log("amm address", ammAddress);

    const amm = new Contract(ammAddress, SeawaterABI, signer);

    const fusdcContract = new Contract(fusdcAddress, LightweightERC20.abi, signer)
    const tusdcContract = new Contract(tusdcAddress, LightweightERC20.abi, signer)
    const tusdc2Contract = new Contract(tusdc2Address, LightweightERC20.abi, signer)

    console.log("seawater proxy admin", ammAddress);

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

    console.log("balance of the tusdc signer", await tusdcContract.balanceOf(signer.address));

    const lowerTick = encodeTick(50);
    const upperTick = encodeTick(150);
    const liquidityDelta = BigInt(20000);

    await setApprovalTo([fusdcContract, tusdcContract, tusdc2Contract], ammAddress, MaxUint256);

    console.log("about to create position")

    const tusdcPositionId = await createPosition(amm, tusdcAddress, lowerTick, upperTick, liquidityDelta);
    const tusdc2PositionId = await createPosition(amm, tusdc2Address, lowerTick, upperTick, liquidityDelta);

    console.log("done creating position")

    //await setApprovalTo([fusdcContract, tusdcContract, tusdc2Contract], ammAddress, BigInt(0));

    let curNonce = await signer.getNonce() + 1;
    const getPermit2Data = async ({
        token,
        maxAmount,
        nonce,
        deadline,
    }: {token: string, maxAmount: number, nonce: number, deadline: number}) => {
        let data = SignatureTransfer.getPermitData(
            {
                permitted: {
                    token,
                    amount: maxAmount,
                },
                spender: ammAddress,
                nonce,
                deadline,
            },
            permit2Address,
            chainid,
        );

        let sig = await signer.signTypedData(data.domain as TypedDataDomain, data.types, data.values);

        return sig;
    }

    await t.test("position modification with permit2 blobs", async t => {
        let maxAmount = 10000000;
        let nonce0 = curNonce++;
        let nonce1 = curNonce++;
        let deadline = await encodeDeadline(provider, 1000);

        let sig0 = await getPermit2Data({token: tusdcAddress, maxAmount, nonce: nonce0, deadline});
        let sig1 = await getPermit2Data({token: fusdcAddress, maxAmount, nonce: nonce1, deadline});

        const fusdcBeforeBalance = await fusdcContract.balanceOf(defaultAccount)
        const tusdcBeforeBalance = await tusdcContract.balanceOf(defaultAccount)

        console.log("about to update position permit2")

        let response = await amm.updatePositionPermit2(
            tusdcAddress, // pool
            tusdcPositionId,
            100, // delta
            nonce0,
            deadline,
            maxAmount,
            sig0,
            nonce1,
            deadline,
            maxAmount,
            sig1,
        );
        await response.wait();

        console.log("done updating position2")

        const fusdcAfterBalance = await fusdcContract.balanceOf(defaultAccount)
        const tusdcAfterBalance = await tusdcContract.balanceOf(defaultAccount)

        assert(fusdcAfterBalance < fusdcBeforeBalance, "expected fusdc balance to decrease");
        assert(tusdcAfterBalance < tusdcBeforeBalance, "expected tusdc balance to decrease");

        await t.test("withdrawing a position shouldn't lose money", async _ => {
            let response = await amm.updatePosition(
                tusdcAddress, // pool
                tusdcPositionId,
                -100, // delta
            );
            await response.wait();

            const fusdcFinalBalance = await fusdcContract.balanceOf(defaultAccount)
            const tusdcFinalBalance = await tusdcContract.balanceOf(defaultAccount)

            console.log(`FUSDC BALANCES ${fusdcFinalBalance} ${fusdcBeforeBalance}`);

            // allow for some dust
            assert((fusdcBeforeBalance - fusdcFinalBalance) < 5, "final fusdc balance should equal initial balance");
            assert((tusdcBeforeBalance - tusdcFinalBalance) < 5, "final tusdc balance should equal initial balance");
        });
    });

    await t.test("swapping with permit2 blobs", async _ => {
        const fusdcBeforeBalance = await fusdcContract.balanceOf(defaultAccount)
        const tusdcBeforeBalance = await tusdcContract.balanceOf(defaultAccount)

        // TODO test on swapIn, not raw swap
        // address _token,
        // bool _zeroForOne,
        // int256 _amount,
        // uint256 _priceLimitX96
        let token = tusdcAddress;
        let amount = 10;
        let maxAmount = amount;
        let nonce = curNonce++;
        let deadline = await encodeDeadline(provider, 1000);

        let sig = await getPermit2Data({token, maxAmount, nonce, deadline});

        // swap 10 tUSDC -> fUSDC without hitting the price limit
        let response = await amm.swapPermit2(
            tusdcAddress,
            true,
            10,
            encodeSqrtPrice(30),
            nonce,
            deadline,
            maxAmount,
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


        // swap 1000 fUSDC back to 10 tUSDC
        token = fusdcAddress;
        amount = 1000;
        nonce = curNonce++;
        deadline = await encodeDeadline(provider, 1000);
        maxAmount = amount;

        sig = await getPermit2Data({token, maxAmount, nonce, deadline});

        response = await amm.swapPermit2(
            tusdcAddress,
            false,
            amount,
            encodeSqrtPrice(500),
            nonce,
            deadline,
            maxAmount,
            sig,
        )
        await response.wait();

        fusdcAfterBalance = await fusdcContract.balanceOf(defaultAccount)
        tusdcAfterBalance = await tusdcContract.balanceOf(defaultAccount)
        expectedFusdcAfterBalance -= BigInt(1000);
        expectedTusdcAfterBalance += BigInt(10);

        assert(fusdcAfterBalance === expectedFusdcAfterBalance, `expected balances to match! got: ${fusdcAfterBalance}, expected ${expectedFusdcAfterBalance}`)
        assert(tusdcAfterBalance === expectedTusdcAfterBalance, `expected balances to match! got: ${tusdcAfterBalance}, expected ${expectedTusdcAfterBalance}`)
    });

    await t.test("swap2 with permit2 blobs", async _ => {
        let maxAmount = 100;
        let nonce = curNonce++;
        let deadline = await encodeDeadline(provider, 1000);
        let sig = await getPermit2Data({token: tusdcAddress, maxAmount, nonce, deadline});

        const tusdcBeforeBalance = await tusdcContract.balanceOf(defaultAccount)
        const tusdc2BeforeBalance = await tusdc2Contract.balanceOf(defaultAccount)

        let response = await amm.swap2ExactInPermit2(
            tusdcAddress,
            tusdc2Address,
            maxAmount,
            0, // minOut
            nonce,
            deadline,
            sig,
        );
        console.log(await response.wait());

        const tusdcAfterBalance = await tusdcContract.balanceOf(defaultAccount)
        const tusdc2AfterBalance = await tusdc2Contract.balanceOf(defaultAccount)

        assert(tusdcAfterBalance < tusdcBeforeBalance, "tusdc balance should decrease");
        assert(tusdc2AfterBalance > tusdc2BeforeBalance, "tusdc2 balance should increase");
    });

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
