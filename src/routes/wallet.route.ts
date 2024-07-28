import express, { Router } from "express";
import { WalletController } from "../controllers";
import { container } from "tsyringe";

const router: Router = express.Router();
const walletController = container.resolve(WalletController);

router.post("/fund-wallet", walletController.fundWallet.bind(walletController));
router.post("/transfer", walletController.transfer.bind(walletController));
router.post("/withdraw", walletController.withdraw.bind(walletController));

export { router as walletRoute };
