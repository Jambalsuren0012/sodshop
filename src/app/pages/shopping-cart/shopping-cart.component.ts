import {
  Component,
  computed,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { ShoppingCartLocalStorageService } from '../../services/shopping-cart-local-storage.service';
import {
  faCheckCircle,
  faExclamationCircle,
  faMinus,
  faPlus,
  faTrashCan,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Router, RouterLink } from '@angular/router';
import { PaymentInfoLocalStorageService } from '../../services/payment-info-local-storage.service';
import { PaymentInfoData } from '../../../type';
import { ShoppingCartItemComponent } from '../../components/shopping-cart-item/shopping-cart-item.component';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-shopping-cart',
  imports: [FontAwesomeModule, ShoppingCartItemComponent, RouterLink],
  template: `
    <div class="mx-auto flex flex-col-reverse lg:flex-row gap-x-20 min-h-full">
      <div class="w-full py-14 lg:py-0 lg:pb-0 lg:pt-28 px-6 lg:pl-24 lg:pr-8">
        <h2 class="text-xl font-bold uppercase">Төлбөрийн мэдээлэл</h2>
        <p>Төлбөрөө хийхийн тулд мэдээллээ оруулна уу</p>
        <form (submit)="simulateCheckoutProcessing($event)">
          <!-- Shipping Address -->
          <fieldset class="mt-4 fieldset px-0 p-4">
            <legend class="fieldset-legend text-lg uppercase">
              Хүргэлтийн хаяг
            </legend>
            <textarea
              type="text"
              required
              class="input validator w-full min-h-[80px]"
              placeholder="your address..."
              (change)="handleInputChange($event, 'address')"
              >{{ paymentInfoData()?.address || '' }}</textarea
            >
          </fieldset>
          <!-- Payment Method -->
          <fieldset class="mt-1 fieldset px-0 p-4">
            <legend class="fieldset-legend text-lg uppercase">
              Төлбөрийн карт
            </legend>

            <div class="space-y-4">
              <div class="w-full space-y-2">
                <label class="fieldset-label">Картны дугаар</label>
                <input
                  type="number"
                  required
                  class="input validator w-full"
                  [value]="paymentInfoData()?.cardNumber"
                  (change)="handleInputChange($event, 'cardNumber')"
                  placeholder="Картны дугаар оруулна уу"
                />
              </div>
              <div class="flex items-center gap-x-2 w-full">
                <div class="w-full space-y-2">
                  <label class="fieldset-label">Хүчинтэй хугацаа</label>
                  <input
                    type="number"
                    required
                    [value]="paymentInfoData()?.expirationDate"
                    (change)="handleInputChange($event, 'expirationDate')"
                    class="input w-full validator"
                    placeholder="MM/YY"
                  />
                </div>
                <div class="w-full space-y-2">
                  <label class="fieldset-label">CVV</label>
                  <input
                    type="number"
                    required
                    [value]="paymentInfoData()?.cvv"
                    (change)="handleInputChange($event, 'cvv')"
                    class="input w-full validator"
                    placeholder="XXX"
                  />
                </div>
              </div>
              <div class="w-full space-y-2">
                <label class="fieldset-label">Карт эзэмшигчийн нэр</label>
                <input
                  required
                  type="text"
                  [value]="paymentInfoData()?.nameOnCard ?? ''"
                  (change)="handleInputChange($event, 'nameOnCard')"
                  class="input w-full validator"
                  placeholder="Нэрээ оруулна уу"
                />
              </div>
            </div>
          </fieldset>
          <div class="w-full flex items-center justify-between gap-x-3">
            <label class="fieldset-label">
              <input
                type="checkbox"
                (change)="toggleRememberPaymentInfo($event)"
                [checked]="rememberPaymentInfo()"
                class="checkbox"
              />
              Төлбөрийн мэдээллийг хадгалах
            </label>
            <div class="tooltip tooltip-left">
              <div class="tooltip-content">
                <div class="text-sm w-[250px]">
                  Мэдээллийг зөвхөн таны браузерт хадгална, сервер рүү
                  илгээгдэхгүй
                </div>
              </div>
              <fa-icon [icon]="faExclamationCircle"></fa-icon>
            </div>
          </div>
          @if (cartItemQuantity() >= 1) {
            <div class="border-t border-t-base-300 pt-4 mt-4 space-y-2">
              <div class="flex items-center justify-between">
                <span>Тоо ширхэг</span>
                <span class="text-lg font-bold">{{ cartItemQuantity() }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span>Нийт дүн</span>
                <span class="text-lg font-bold">{{ totalPrice() }}</span>
              </div>
            </div>
            <button class="btn btn-primary w-full mt-2" type="submit">
              @if (!isLoading() && !isSuccess()) {
                Төлөх
                {{ totalPrice() }}
              } @else if (!isLoading() && isSuccess()) {
                Амжилттай төлөв
              } @else {
                Төлбөр боловсруулах...
              }
            </button>
          }
        </form>
      </div>
      <div
        class="w-full pb-14 lg:pb-0 lg:py-0 pt-28 lg:pt-28 px-6 lg:pr-24 lg:pl-8"
      >
        <h2 class="text-xl font-bold uppercase">Захиалгын тойм</h2>
        <p>Бараагаа шалгаж, хүргэлтийн тохиргоо сонгоно уу</p>
        <div>
          @if (cartItemQuantity() >= 1) {
            <div
              class="mt-4 border border-gray-900 rounded-lg px-4 py-6 space-y-6 max-h-[calc(100dvh-200px)] overflow-y-auto"
            >
              @for (item of cartItems(); track item.id) {
                <div
                  class="border-b border-b-gray-900 pb-5 last:pb-0 last:border-b-0"
                >
                  <app-shopping-cart-item [item]="item" />
                </div>
              }
            </div>
          } @else {
            <div
              class="mt-10 flex items-center justify-center flex-col gap-y-2"
            >
              <p class="text-xl text-center text-gray-400">
                Таны сагсанд бараа байхгүй байна. Дэлгүүр лүү буцаж бараа
                сонгоорой.
              </p>
              <a routerLink="/" class="btn btn-soft">Дэлгүүр луу буцах</a>
            </div>
          }
        </div>
      </div>
    </div>
    <dialog #checkoutSuccessDialog class="modal modal-bottom sm:modal-middle">
      <div class="modal-box">
        <div class="flex items-center justify-center w-full mb-4">
          <fa-icon
            [icon]="faCheckCircle"
            class="text-6xl text-emerald-500"
          ></fa-icon>
        </div>
        <h3 class="text-xl font-bold text-center">Таны захиалга амжилттай</h3>
        <div class="modal-action">
          <form method="dialog">
            <button (click)="closeDialog()" class="btn btn-sm">Хаах</button>
          </form>
        </div>
      </div>
    </dialog>
  `,
})
export class ShoppingCartComponent {
  constructor(
    private meta: Meta,
    private title: Title,
  ) {
    this.title.setTitle('Shopping Cart');
    this.meta.updateTag({
      name: 'description',
      content:
        "Shopping Cart Page - This is a modern, responsive e-commerce template built Angular and TailwindCSS. It's designed to be a starting point for building full-featured e-commerce applications. The template includes a clean and customizable design, ideal for minimalist online stores.",
    });
    this.meta.updateTag({ property: 'og:title', content: 'Shopping Cart' });
    this.meta.updateTag({
      property: 'og:description',
      content:
        "Shopping Cart Page - This is a modern, responsive e-commerce template built Angular and TailwindCSS. It's designed to be a starting point for building full-featured e-commerce applications. The template includes a clean and customizable design, ideal for minimalist online stores.",
    });
  }

  faPlus = faPlus;
  faMinus = faMinus;
  faTrashCan = faTrashCan;
  faCheckCircle = faCheckCircle;
  faExclamationCircle = faExclamationCircle;

  private readonly shoppingCartLocalStorageService = inject(
    ShoppingCartLocalStorageService,
  );
  private readonly paymentInfoLocalStorageService = inject(
    PaymentInfoLocalStorageService,
  );

  private readonly router = inject(Router);

  rememberPaymentInfo = signal(true);
  isLoading = signal(false);
  isSuccess = signal(false);

  private checkoutSuccessDialog = viewChild<ElementRef<HTMLDialogElement>>(
    'checkoutSuccessDialog',
  );

  cartItems = computed(() => this.shoppingCartLocalStorageService.cartItems());
  cartItemQuantity = computed(() =>
    this.shoppingCartLocalStorageService.cartItemQuantity(),
  );
  paymentInfoData = signal(
    this.paymentInfoLocalStorageService.paymentInfoData(),
  );

  totalPrice = computed(() => {
    const total = this.cartItems().reduce((a, c) => {
      return a + (c?.price || 0) * (c?.stock || 0);
    }, 0);

    // Монгол төгрөг форматтай
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'MNT', // төгрөгийн тэмдэг
      minimumFractionDigits: 0, // хэрвээ копейк харуулахгүй бол
    }).format(total);
  });
  simulateCheckoutProcessing(event: Event) {
    event.preventDefault();

    this.isLoading.set(true);
    setTimeout(() => {
      this.isLoading.set(false);
      this.isSuccess.set(true);
      this.checkoutSuccessDialog()?.nativeElement.showModal();
    }, 1000);
  }

  closeDialog() {
    this.checkoutSuccessDialog()?.nativeElement.close();
    this.isLoading.set(false);
    this.isSuccess.set(false);

    // Save payment info data
    if (this.rememberPaymentInfo() && this.paymentInfoData()) {
      this.paymentInfoLocalStorageService.saveData(this.paymentInfoData()!);
    } else {
      this.paymentInfoLocalStorageService.clearItem();
    }

    // Clear localStorage for shopping cart items
    this.shoppingCartLocalStorageService.clearItems();
    // Currently clear out the payment info form when form close
    this.paymentInfoData.set(null);
    this.router.navigate(['/']);
  }

  toggleRememberPaymentInfo(event: Event) {
    const target = event.target as HTMLInputElement;
    this.rememberPaymentInfo.set(target.checked);
  }

  handleInputChange(event: Event, field: keyof PaymentInfoData) {
    const target = event.target as HTMLInputElement;
    // Update the corresponding field in the signal
    this.paymentInfoData.set({
      ...this.paymentInfoData()!,
      [field]: target.value,
    });
  }
}
