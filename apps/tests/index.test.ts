import axios, { AxiosError } from "axios";
import { beforeAll, describe, expect, it } from "bun:test";
import { backendUrl } from "./config";
import type { CreateOrderResponse } from "@repo/common/engineTypes";

describe("testing /api/v1/orders - create order endpoint", () => {
  let user1Token = "";
  let user2Token = "";
  let marketId = "";
  beforeAll(async () => {
    try {
      const adminUsername = `admin-${Math.random()}`;
      const adminPassword = "admin1234";

      // signup admin
      const admin = await axios.post(`${backendUrl}/api/v1/auth/signup`, {
        username: adminUsername,
        password: adminPassword,
        isAdmin: true,
      });

      console.log(`admin created: ${JSON.stringify(admin.data)}`);

      // signin admin
      const adminSigninResponse = await axios.post(
        `${backendUrl}/api/v1/auth/signin`,
        {
          username: adminUsername,
          password: adminPassword,
        },
      );

      console.log(
        `admin signed in: ${JSON.stringify(adminSigninResponse.data)}`,
      );

      // create market
      const market = await axios.post(
        `${backendUrl}/api/v1/market`,
        {
          marketId: `BTC_USDT-${Math.random()}`,
          imageUrl: "url",
        },
        {
          headers: {
            Authorization: `Bearer ${adminSigninResponse.data.token}`,
          },
        },
      );

      marketId = market.data.marketId;

      console.log(`market created: ${JSON.stringify(market.data)}`);

      const username1 = `testacc-${Math.random()}`;
      const username2 = `testacc-${Math.random()}`;
      const user1Password = `Testacc@-${Math.random()}`;
      const user2Password = `Testacc@-${Math.random()}`;

      //   create user1 and signin user1 to store jwt
      const user1 = await axios.post(`${backendUrl}/api/v1/auth/signup`, {
        username: username1,
        password: user1Password,
      });

      console.log(`user1 created: ${JSON.stringify(user1.data)}`);

      const user1Signin = await axios.post(`${backendUrl}/api/v1/auth/signin`, {
        username: username1,
        password: user1Password,
      });

      console.log(`user1 signedin: ${JSON.stringify(user1Signin.data)}`);

      user1Token = user1Signin.data.token;

      //   onramp balance for user 1
      const onrampForUser1 = await axios.post(
        `${backendUrl}/api/v1/wallet/onramp`,
        {
          amount: 100000,
        },
        {
          headers: {
            Authorization: `Bearer ${user1Token}`,
          },
        },
      );

      console.log(
        `balance onramped for user 1: ${JSON.stringify(onrampForUser1.data)}`,
      );

      //   create user2 and signin user2 to store jwt
      const user2 = await axios.post(`${backendUrl}/api/v1/auth/signup`, {
        username: username2,
        password: user2Password,
      });

      console.log(`user2 created: ${JSON.stringify(user2.data)}`);

      const user2Signin = await axios.post(`${backendUrl}/api/v1/auth/signin`, {
        username: username2,
        password: user2Password,
      });

      console.log(`user2 signedin: ${JSON.stringify(user2Signin.data)}`);

      user2Token = user2Signin.data.token;

      //   onramp balance for user 2
      const onrampForUser2 = await axios.post(
        `${backendUrl}/api/v1/wallet/onramp`,
        {
          amount: 100000,
        },
        {
          headers: {
            Authorization: `Bearer ${user2Token}`,
          },
        },
      );

      console.log(
        `balance onramped for user 2: ${JSON.stringify(onrampForUser2.data)}`,
      );
    } catch (error) {
      console.log(error instanceof AxiosError ? error.message : "error");
    }
  });

  it("limit buy order pushed onto the orderbook as resting bid order when orderbook is empty", async () => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/v1/orders`,
        {
          marketId: marketId,
          side: "BUY",
          type: "LIMIT",
          price: 100,
          qty: 5,
          margin: 250,
          leverage: 2,
        },
        {
          headers: {
            Authorization: `Bearer ${user1Token}`,
          },
        },
      );

      console.log(
        `placed a limit buy order from user 1 on the orderbook : ${JSON.stringify(response.data)}`,
      );

      let data: CreateOrderResponse = response.data;

      expect(data.averagePrice).toBe(0);
      expect(data.status).toBe("OPEN");
      expect(data.remainingQty).toBe(5);
      expect(data.filledQty).toBe(0);
      expect(data.fills.length).toBe(0);
      expect(data.takerPosition).toBeNull();
      expect(data.restingOrderType).toBe("BID");
    } catch (error) {
      console.log(error instanceof AxiosError ? error.message : "error");
      expect().fail("couldn't place the order");
    }
  });
});
