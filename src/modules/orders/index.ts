import { Job } from "agenda";
import agenda from "../../shared/scheduler/agenda";
import { CartService } from "../carts/cart.service";
import { ProductService } from "../products/product.service";
import { OrderRouter } from "./order.router";
import { OrderService } from "./order.service";
import { PaymentService } from "../payment/payment.service";
import {
  CancelOrderJob,
  JOB_NAME as CANCEL_ORDER_JOB_NAME,
} from "./jobs/cancelOrderJob";
import { AddressService } from "../addresses/address.service";
import {
  CancelInstallmentsOrderJob,
  JOB_NAME as CANCEL_INSTALLMENTS_ORDER_JOB_NAME,
} from "./jobs/cancelInstallmentsOderJob";
import { EarningService } from "../earnings/earning.service";
export class OrderModule {
  private orderRouter: OrderRouter;
  private cancelOrderJob: CancelOrderJob;
  private cancelInstallmentsOrderJob: CancelInstallmentsOrderJob;
  orderService: OrderService;
  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private paymentService: PaymentService,
    private addressService: AddressService,
    private earningService: EarningService
  ) {
    this.orderService = new OrderService(
      this.productService,
      this.paymentService,
      this.cartService,
      this.addressService,
      this.earningService
    );
    this.orderRouter = new OrderRouter(this.orderService);

    this.cancelOrderJob = new CancelOrderJob(
      this.cartService,
      this.productService,
      this.paymentService
    );
    this.cancelInstallmentsOrderJob = new CancelInstallmentsOrderJob(
      this.paymentService
    );

    this.registerJobs();
  }

  private registerJobs() {
    agenda.define(CANCEL_ORDER_JOB_NAME, async (job: Job) => {
      const { transaction } = job.attrs.data as { transaction: string };
      if (!transaction) {
        console.error("Transaction ID is missing.");
        return;
      }

      try {
        await this.cancelOrderJob.cancelLogic(transaction);
        console.log(
          `✅ Order cancellation job executed for transaction: ${transaction}`
        );
      } catch (error) {
        console.error(
          `❌ Failed to cancel order for transaction ${transaction}:`,
          error
        );
      }
    });

    agenda.define(CANCEL_INSTALLMENTS_ORDER_JOB_NAME, async (job: Job) => {
      const { transaction } = job.attrs.data as { transaction: string };
      if (!transaction) {
        console.error("Transaction ID is missing.");
        return;
      }

      try {
        await this.cancelInstallmentsOrderJob.cancelLogic(transaction);
        console.log(
          `✅ Installments order cancellation job executed for transaction: ${transaction}`
        );
      } catch (error) {
        console.error(
          `❌ Failed to cancel installments order for transaction ${transaction}:`,
          error
        );
      }
    });
  }

  routerFactory() {
    return this.orderRouter.createRouter();
  }
}
