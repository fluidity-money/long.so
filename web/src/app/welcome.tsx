import { Button } from '@/components/ui/button'
import { useWelcomeStore } from '@/stores/useWelcomeStore'
import { Token } from '@/components'

/**
 * Overlay the welcome screen on top of the app
 */
export const Welcome = () => {
  const { setWelcome, welcome } = useWelcomeStore()

  if (!welcome) return null

  return (
    <>
      <div className="absolute top-[35%] z-50 w-full">
        <div className="mt-32 flex flex-col items-center justify-around gap-10 bg-white">
          <div className="mt-10 flex flex-row items-center gap-1 text-3xl font-medium">
            Think{' '}
            <div className="rounded-md bg-black p-1 px-2 text-white">
              inside
            </div>{' '}
            the box.
          </div>

          {/* this text is different on desktop and mobile */}
          {/* mobile */}
          <div className="inline-flex md:hidden">
            Earn rewards on every trade on the first DeFi <br />
            Layer-3 focused on incentives and order flow.
          </div>
          {/* desktop */}
          <div className="hidden md:inline-flex">
            The AMM That Pays You To Use It
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-row flex-wrap items-center justify-center gap-4">
              <div className="group h-10 rounded-full border border-black p-1 px-3 transition-[height] hover:h-14 hover:bg-black hover:text-white ">
                <div className=" flex h-full flex-col items-center justify-center gap-1">
                  <div className="text-sm group-hover:text-base">
                    ⛽️💰 Gas Rebates and Negative Fees for traders
                  </div>
                  <div className="hidden text-xs text-gray-1 group-hover:inline-flex">
                    Less Gas, More Cash.{' '}
                    <span className="ml-1 hidden cursor-pointer underline md:inline-flex">
                      Learn More {'->'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="group h-10 rounded-full border border-black p-1 px-3 transition-[height] hover:h-14 hover:bg-black hover:text-white ">
                <div className="flex h-full flex-col items-center justify-center gap-1">
                  <div className="flex flex-row items-center gap-1 text-sm group-hover:text-base">
                    <div
                      className="group-hover:invert
                    "
                    >
                      <Token size={'medium'} />
                    </div>
                    $29,123 Trader Rewards available on every swap
                  </div>
                  <div className="hidden text-xs text-gray-1 group-hover:inline-flex ">
                    Get rewarded for every transaction you make.{' '}
                    <span className="ml-1 hidden cursor-pointer underline md:inline-flex">
                      Learn More {'->'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-row justify-center">
              <div className="group h-10 rounded-full border border-black p-1 px-3 transition-[height] hover:h-14 hover:bg-black hover:text-white ">
                <div className="flex h-full flex-col items-center justify-center gap-1">
                  <div className="text-sm group-hover:text-base">
                    🔺🚀️ Earn Higher Revenue with Utility Booster
                  </div>
                  <div className="hidden text-xs text-gray-1 group-hover:inline-flex">
                    Earn easy and earn big.{' '}
                    <span className="ml-1 hidden cursor-pointer underline md:inline-flex">
                      Learn More {'->'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <Button onClick={() => setWelcome(false)}>
              <span className="iridescent-text">Get Started</span>
            </Button>
            <Button variant="ghost">Learn more {'->'}</Button>
          </div>
        </div>
      </div>
    </>
  )
}
