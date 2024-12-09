"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import {
  useAccount,
  useBalance,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { formatUnits, parseEther } from "ethers";
import { abi } from "@/abi/abi";
import { Button } from "../ui/button";
import { ArrowDownUp, Fuel, Loader2 } from "lucide-react";
import { Token } from "@/types";
import Link from "next/link";
// import TokenSelect from "../shared/TokenSelect"

export const SwapForm: React.FC = () => {
  const [tokenAInput, setTokenAInput] = useState<Token>({
    name: "ETH",
    logo_url: "https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png",
    unit: "ETH",
  });
  const [tokenBInput, setTokenBInput] = useState<Token>({
    name: "GOLD",
    logo_url: "https://s2.coinmarketcap.com/static/img/coins/64x64/5705.png",
    unit: "Ounce",
  });
  const [amountAInput, setAmountAInput] = useState("");
  const [amountBInput, setAmountBInput] = useState("");
  const [amountA, setAmountA] = useState("");
  const [amountB, setAmountB] = useState("");
  const [priceA, setPriceA] = useState(0);
  const [priceB, setPriceB] = useState(0);
  const { isConnected, address } = useAccount();
  const nativeBalance = useBalance({
    address,
  });
  const tokenBalance = useReadContract({
    abi,
    address: "0xA1F002bf7cAD148a639418D77b93912871901875",
    functionName: "balanceOf",
    args: [address || "0x0", BigInt(1)],
  });
  const amountAInputRef = useRef<HTMLInputElement>(null);

  const { writeContract, isPending, data: hash } = useWriteContract();

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const [responseA, responseB] = await Promise.all([
          fetch(
            "https://api.diadata.org/v1/assetQuotation/Metis/0xDeadDeAddeAddEAddeadDEaDDEAdDeaDDeAD0000"
          ),
          fetch("https://dgt-dev.vercel.app/v1/token/price"),
        ]);

        if (responseA.ok) {
          const resultA = await responseA.json();
          setPriceA(resultA.Price);
        }

        if (responseB.ok) {
          const resultB = await responseB.json();
          setPriceB(resultB.price * 10 ** 10);
        }
      } catch (error) {}
    };

    fetchPrices();

    if (nativeBalance.data?.value) {
      setAmountA(formatUnits(nativeBalance.data?.value));
    }
    console.log("Effect function");
    if (tokenBalance.data) {
      setAmountB(`${formatUnits(tokenBalance.data?.toString())}000000`);
    }
  }, [address, nativeBalance.data?.value, tokenBalance.data]);

  const amountInputAChange = () => {
    const numericValue = amountAInputRef.current?.value;

    if (numericValue && +numericValue > 0) {
      setAmountAInput(numericValue);
      setAmountBInput(((+numericValue * priceA) / priceB).toString());
    }
  };

  function truncateAddress(address: string) {
    return `${address.slice(0, 6)}...${address.slice(-6)}`;
  }

  const swapHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Add your swap logic here
    if (+amountAInput > 0) {
      if (tokenAInput.name === "ETH") {
        writeContract({
          abi,
          address: "0xA1F002bf7cAD148a639418D77b93912871901875",
          functionName: "buy_gold",
          args: [],
          value: parseEther(amountAInput),
        });
        console.log("buy gold", tokenAInput, amountAInput);
      }
      if (tokenAInput.name === "GOLD") {
        writeContract({
          abi,
          address: "0xA1F002bf7cAD148a639418D77b93912871901875",
          functionName: "sell_gold",
          args: [parseEther(amountAInput)],
        });
        console.log("Sell gold: ", tokenAInput, parseEther(amountAInput));
      }
    }
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  function clickHandler(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void {
    event.preventDefault();

    // swap token input
    const tempTokenInput = tokenAInput;
    setTokenAInput(tokenBInput);
    setTokenBInput(tempTokenInput);

    // swap token amount/balance
    const tempBalance = amountA;
    setAmountA(amountB);
    setAmountB(tempBalance);

    // swap token price
    const tempPrice = priceA;
    setPriceA(priceB);
    setPriceB(tempPrice);

    // reset amount input
    setAmountAInput("");
    if (amountAInputRef.current) {
      amountAInputRef.current.value = "";
    }
    setAmountBInput("");
  }

  return (
    <>
      <form onSubmit={swapHandler} className="">
        <div className="space-y-2">
          <div className="flex items-center gap-1">
            <label className="text-sm text-gray-400 mb-1 block font-semibold">
              From
            </label>
            <Image
              className="dark:invert rounded-full"
              src="https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png"
              alt="Next.js logo"
              width={32}
              height={32}
            />
            <span className="text-white bold">ETH</span>
          </div>
          <div className="space-y-2">
            <div className="p-3 coin-input-text">
              <div className="flex flex-col md:flex-row p-1">
                <div className="md:w-1/2 items-center coin-input-text flex">
                  <Image
                    className="dark:invert rounded-full mr-1"
                    src={tokenAInput.logo_url}
                    alt={tokenAInput.name}
                    width={32}
                    height={32}
                  />
                  <span className="text-white bold">{tokenAInput.name}</span>
                </div>
                <div className="md:w-1/2 items-center p-1">
                  <Input
                    type="number"
                    placeholder="0"
                    className="coin-input-22"
                    onChange={amountInputAChange}
                    step="any"
                    max={amountA}
                    min={0}
                    ref={amountAInputRef}
                  />
                </div>
              </div>
              <div className="num-dollar p-1 flex items-center justify-between">
                <div className="flex gap-1 items-center">
                  <Image
                    className="dark:invert mr-1"
                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACkAAAAoCAYAAABjPNNTAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAGPSURBVHgB7ZixTsMwEIb/RB3oWLbABhsdmRm7MjKy9hl4AkZeAXiNjjAy0rHdYGzHdgv/CRfFLrFbKT07aj7plNhOpF/2+ew7oOOIyEIflGU54OOM1oceyyzLZptGr+4rirvkY0S7gD4fNL9IChRxIyRC7nZQ4A0SEihYM0mBp7AFrmlvtDkOz7huwF3uIe2k0n6iAy+hACeodsxd7mHlfa4lMIQrclB51ww5XnLPWGHCUHR6gfE7Cn3n8xu69M0ESVBfWCcOBx5gL3lsJhQ5ydECfCLXSASfT4ofPtPOoecCEqNv3U7vxqE/yGzOoIS5cW2JbL1PJkMnsilaITJ0LDYOd7CEtKLSNWUUWfn+URdJrmBfrB9pXpGdTzZFjOWWdPUvZ9rl9q8u0ojaKy3pfLIpfCKTTcSqvlKYYkF0XJFTp32fglB3d0t4kNNgU8WQkt+YQiVkLHB4/nUxS6ScoRT0ArsuI7fla0Rka+OY4uUrUk/EKPSTM/qF36WXJD1qLh4sRwsmQYrByiSD6fMDCC1lTEFX9xwAAAAASUVORK5CYII="
                    alt="Next.js logo"
                    width={16}
                    height={20}
                  />
                  <p>Coin Value: {amountA ? amountA.slice(0, 6) : "0.0"}</p>{" "}
                </div>
                {/* Display the coin value */}
                <div className="text-right">
                  ${(+amountA * priceA).toFixed(2)}
                </div>
              </div>
            </div>
            <div className="flex justify-center -my-1.5">
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 rounded-full bg-[#282e3a] swap"
                onClick={clickHandler}
              >
                <ArrowDownUp className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-3 coin-input-text">
              <div className="flex flex-col md:flex-row p-1">
                <div className="md:w-1/2 items-center coin-input-text flex">
                  <Image
                    className="dark:invert rounded-full mr-1"
                    src={tokenBInput.logo_url}
                    alt={tokenBInput.name}
                    width={32}
                    height={32}
                  />
                  <span className="text-white font-medium">
                    {tokenBInput.name}
                  </span>
                </div>
                <div className="md:w-1/2 items-center p-1">
                  <Input
                    type="number"
                    placeholder="0"
                    className="coin-input-22"
                    readOnly
                    value={amountBInput}
                  />
                </div>
              </div>
              <div className="num-dollar p-1 flex items-center justify-between">
                <div className="flex gap-1 items-center">
                  <Image
                    className="dark:invert mr-1"
                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACkAAAAoCAYAAABjPNNTAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAGPSURBVHgB7ZixTsMwEIb/RB3oWLbABhsdmRm7MjKy9hl4AkZeAXiNjjAy0rHdYGzHdgv/CRfFLrFbKT07aj7plNhOpF/2+ew7oOOIyEIflGU54OOM1oceyyzLZptGr+4rirvkY0S7gD4fNL9IChRxIyRC7nZQ4A0SEihYM0mBp7AFrmlvtDkOz7huwF3uIe2k0n6iAy+hACeodsxd7mHlfa4lMIQrclB51ww5XnLPWGHCUHR6gfE7Cn3n8xu69M0ESVBfWCcOBx5gL3lsJhQ5ydECfCLXSASfT4ofPtPOoecCEqNv3U7vxqE/yGzOoIS5cW2JbL1PJkMnsilaITJ0LDYOd7CEtKLSNWUUWfn+URdJrmBfrB9pXpGdTzZFjOWWdPUvZ9rl9q8u0ojaKy3pfLIpfCKTTcSqvlKYYkF0XJFTp32fglB3d0t4kNNgU8WQkt+YQiVkLHB4/nUxS6ScoRT0ArsuI7fla0Rka+OY4uUrUk/EKPSTM/qF36WXJD1qLh4sRwsmQYrByiSD6fMDCC1lTEFX9xwAAAAASUVORK5CYII="
                    alt="Next.js logo"
                    width={16}
                    height={16}
                  />
                  <p>Coin Value: {amountB ? amountB.slice(0, 6) : "0.0"}</p>{" "}
                </div>
                {/* Display the coin value */}
                <div className="text-right">
                  ${(+amountB * priceB).toFixed(2)}
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-1">
            <div className="p-1 text-[#9B9B9B] swap text-xs flex items-center justify-between">
              <div>
                1 {tokenAInput.unit} ={" "}
                {priceA && priceB ? (priceA / priceB).toFixed(5) : ""}{" "}
                {tokenBInput.unit}
                <span className="text-[#5e5e5e]"> (${priceB.toFixed(2)})</span>
              </div>
              <div className="flex items-center gap-1">
                <Fuel width={14} height={14} />
                <div>0.00025 ETH</div>
              </div>
            </div>
            {isPending ? (
              <Button
                disabled
                className="btn-grad h-[54px] w-full flex items-center justify-center"
              >
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : isConfirming ? (
              <Button
                disabled
                className="btn-grad-animate h-[54px] w-full flex items-center justify-center"
              >
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Waiting for confirmation...
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={!isConnected}
                className={`${
                  isConnected && +amountAInput > 0 && "touch"
                } btn-grad h-[54px] w-full flex items-center justify-center`}
              >
                {isConnected ? "Swap" : "Connect Wallet"}
              </Button>
            )}
          </div>
        </div>
        {/* <TokenSelect /> */}
      </form>
      {isConfirmed && (
        <div className="mt-2 text-white text-xs">
          <h3>Transaction confirmed!</h3>
          <span>
            Hash:{" "}
            <Link
              href={`https://sepolia.uniscan.xyz/tx/${hash}`}
              className="font-bold"
              target="_blank"
            >
              {hash && truncateAddress(hash)}
            </Link>
          </span>
        </div>
      )}
    </>
  );
};
