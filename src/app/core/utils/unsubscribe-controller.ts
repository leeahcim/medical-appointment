import { Subject, Subscription } from 'rxjs';

export class UnsubscribeController {
  public subscriptions: { [key: string]: Subscription } = {};

  public ngUnsubscribe: Subject<void> = new Subject<void>();

  private subscriptionList: Subscription[] = [];

  set sub(subscription: Subscription) {
    if (!subscription) {
      return;
    }

    this.subscriptionList.push(subscription);
  }

  destroy() {
    if (this.ngUnsubscribe) {
      this.ngUnsubscribe.next();
      this.ngUnsubscribe.complete();

      this.ngUnsubscribe = new Subject<void>();
    }

    Object.keys(this.subscriptions).forEach((name: string) =>
      this.subscriptions[name].unsubscribe()
    );
    this.subscriptions = {};

    this.subscriptionList.forEach((s) => s.unsubscribe());
    this.subscriptionList = [];
  }
}
