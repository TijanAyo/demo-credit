import express, { Router } from "express";
import { WalletController } from "../controllers";
import { container } from "tsyringe";
import { Authorize, validateTransaction } from "../middlewares";

const router: Router = express.Router();
const walletController = container.resolve(WalletController);

router.post(
  "/set-pin",
  Authorize,
  walletController.setTransactionPin.bind(walletController)
);

router.post(
  "/set-account",
  Authorize,
  walletController.setSettlementAccount.bind(walletController)
);

router.post(
  "/fund-wallet",
  Authorize,
  walletController.fundWallet.bind(walletController)
);

router.post(
  "/transfer",
  Authorize,
  validateTransaction,
  walletController.transfer.bind(walletController)
);

router.post(
  "/withdraw",
  Authorize,
  validateTransaction,
  walletController.withdraw.bind(walletController)
);

export { router as walletRoute };
