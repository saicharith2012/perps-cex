import { liqudationChecks } from "./utils/liquidationCheck";

export async function onPriceUpdateFromBinance(asset: string, price: number) {
    liqudationChecks(asset, price);   
}
