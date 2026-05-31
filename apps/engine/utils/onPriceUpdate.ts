import { liqudationChecks } from "./liquidationCheck";

export async function onPriceUpdateFromBinance(asset: string, price: number) {
    liqudationChecks(asset, price);   
}
